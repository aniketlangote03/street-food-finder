"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GoogleMaps } from "@/components/shared/google-maps"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function ClientMapWithList({ initialStalls }: { initialStalls: any[] }) {
  const [places, setPlaces] = useState<
    { id: string; name: string; lat: number; lng: number; rating?: number; userRatingsTotal?: number; openNow?: boolean }[]
  >([])
  const [stalls, setStalls] = useState<
    { id: string; name: string; lat: number; lng: number; status?: string; distanceKm?: number }[]
  >([])
  const [dataSource, setDataSource] = useState<"combined" | "platform" | "google">("combined")
  const [radiusKm, setRadiusKm] = useState<number>(3)
  const [filterOpenNow, setFilterOpenNow] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">("rating")
  const [stallSortBy, setStallSortBy] = useState<"distance" | "name" | "status">("distance")
  const [stallStatusFilter, setStallStatusFilter] = useState<"all" | "open" | "maintenance" | "closed">("all")

  const router = useRouter()
  const search = useSearchParams()

  // Initialize from URL
  useEffect(() => {
    const src = search.get("src") as any
    const rad = Number(search.get("rad"))
    const open = search.get("open")
    const sort = search.get("sort") as any
    if (src === "platform" || src === "google" || src === "combined") setDataSource(src)
    if (Number.isFinite(rad) && rad >= 1 && rad <= 20) setRadiusKm(rad)
    if (open === "1" || open === "0") setFilterOpenNow(open === "1")
    if (sort === "rating" || sort === "distance" || sort === "name") setSortBy(sort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("src", dataSource)
    params.set("rad", String(radiusKm))
    params.set("open", filterOpenNow ? "1" : "0")
    params.set("sort", sortBy)
    const qs = params.toString()
    router.replace(`?${qs}`)
  }, [dataSource, radiusKm, filterOpenNow, sortBy, router])

  return (
    <Tabs defaultValue="map" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="map">Map</TabsTrigger>
        <TabsTrigger value="places">Places</TabsTrigger>
        <TabsTrigger value="stalls">Stalls</TabsTrigger>
      </TabsList>

      <TabsContent value="map">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Data Source</Label>
            <Select value={dataSource} onValueChange={(v) => setDataSource(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="combined">Combined</SelectItem>
                <SelectItem value="platform">Platform</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Radius: {radiusKm} km</Label>
            <Slider value={[radiusKm]} min={1} max={20} step={1} onValueChange={(v) => setRadiusKm(v[0])} />
          </div>
          <div className="space-y-2">
            <Label className="invisible">Reset</Label>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  setDataSource("combined")
                  setRadiusKm(3)
                  setFilterOpenNow(false)
                  setSortBy("rating")
                }}
              >
                Reset filters
              </Button>
            </div>
          </div>
        </div>
        <GoogleMaps
          stalls={initialStalls}
          className="w-full h-[600px]"
          showUserLocation={true}
          dataSource={dataSource}
          radiusKm={radiusKm}
          filterOpenNow={filterOpenNow}
          sortBy={sortBy}
          onPlacesUpdate={(p) => setPlaces(p)}
          onStallsUpdate={(s) => setStalls(s)}
        />
      </TabsContent>

      <TabsContent value="places">
        {/* Places controls */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Open now</Label>
            <div className="flex items-center gap-2">
              <Switch checked={filterOpenNow} onCheckedChange={setFilterOpenNow} />
              <span className="text-sm text-gray-600">Only show places currently open</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sort by</Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {places.slice(0, 20).map((p) => (
            <div key={p.id} className="border rounded-md p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-gray-600">
                {typeof p.rating === "number" ? `${p.rating.toFixed(1)} ★` : "No rating"}
                {typeof p.userRatingsTotal === "number" ? ` • ${p.userRatingsTotal} reviews` : ""}
                {typeof p.openNow === "boolean" ? ` • ${p.openNow ? "Open now" : "Closed"}` : ""}
                {typeof (p as any).distanceKm === "number" ? ` • ${(p as any).distanceKm} km` : ""}
              </div>
              <div className="mt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 hover:underline text-sm"
                >
                  Directions
                </a>
              </div>
            </div>
          ))}
          {places.length === 0 && (
            <div className="text-sm text-gray-600">No Google results yet. Click “My Location” or “Search this area”.</div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="stalls">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Sort stalls by</Label>
            <Select value={stallSortBy} onValueChange={(v) => setStallSortBy(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={stallStatusFilter} onValueChange={(v) => setStallStatusFilter(v as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(() => {
          let list = [...stalls]
          if (stallStatusFilter !== "all") {
            list = list.filter((s) => (s.status || "").toLowerCase() === stallStatusFilter)
          }
          if (stallSortBy === "distance") {
            list.sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY))
          } else if (stallSortBy === "name") {
            list.sort((a, b) => a.name.localeCompare(b.name))
          } else if (stallSortBy === "status") {
            const rank: Record<string, number> = { open: 0, maintenance: 1, closed: 2 }
            list.sort((a, b) => (rank[(a.status || "zzz").toLowerCase()] ?? 99) - (rank[(b.status || "zzz").toLowerCase()] ?? 99))
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {list.slice(0, 50).map((s) => (
                <div key={s.id} className="border rounded-md p-3">
                  <div className="font-medium flex items-center justify-between">
                    <span>{s.name}</span>
                    {s.status && (
                      <span className={`text-xs px-2 py-0.5 rounded ${s.status === "open" ? "bg-green-100 text-green-700" : s.status === "maintenance" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    {typeof s.distanceKm === "number" ? `~ ${s.distanceKm} km` : ""}
                  </div>
                  <div className="mt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${s.lat},${s.lng}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-700 hover:underline text-sm"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="text-sm text-gray-600">No platform stalls in range. Try increasing the radius, selecting Combined/Platform source, or changing filters.</div>
              )}
            </div>
          )
        })()}
      </TabsContent>
    </Tabs>
  )
}
