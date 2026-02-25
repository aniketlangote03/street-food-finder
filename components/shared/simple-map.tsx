"use client"

import { useEffect, useRef } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
// Google Maps types are loaded at runtime; using any to avoid type dependency
type googleMaps = any

interface SimpleMapProps {
  stalls?: Array<{
    id: string
    name: string
    description: string
    cuisine_tags: string[]
    location_lat: number
    location_lng: number
    address: string
    is_open: boolean
    image_url?: string
  }>
  height?: string
  className?: string
  onStallSelect?: (stallId: string) => void
  center: { lat: number; lng: number }
  zoom: number
  mapId?: string
  // Enable fetching user live location to recenter map accurately
  useLiveLocation?: boolean
  // Show a button to manually trigger fetching precise location
  showLocateButton?: boolean
}

export default function SimpleMap({
  stalls = [],
  height = "500px",
  className = "",
  onStallSelect,
  center,
  zoom,
  mapId,
  useLiveLocation = false,
  showLocateButton = true,
}: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any | null>(null)
  const markerInstance = useRef<any | null>(null)
  const userMarkerRef = useRef<any | null>(null)

  useEffect(() => {
    let cancelled = false
    let intervalId: number | null = null

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return
      if (!mapInstance.current) {
        // Initialize the map only once
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapId,
          disableDefaultUI: true, // Keep it simple
        })

        // Add a marker
        markerInstance.current = new window.google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current,
          position: center,
          title: "Stall Location",
        })
      } else {
        // Update map center and marker position if props change
        mapInstance.current.setCenter(center)
        mapInstance.current.setZoom(zoom)
        if (markerInstance.current) {
          markerInstance.current.position = center
        }
      }
    }

    if (typeof window !== "undefined" && (window as any).google?.maps) {
      initMap()
    } else if (typeof window !== "undefined") {
      // Poll until Google Maps script has loaded
      intervalId = window.setInterval(() => {
        if ((window as any).google?.maps) {
          if (intervalId !== null) window.clearInterval(intervalId)
          if (!cancelled) initMap()
        }
      }, 300)
    }

    return () => {
      cancelled = true
      if (intervalId !== null) window.clearInterval(intervalId)
    }
  }, [center, zoom, mapId])

  // Fetch an accurate, fresh user location and recenter the map
  const getAccurateUserLocation = () => {
    if (!navigator?.geolocation) return
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude }
          try {
            if (mapInstance.current) {
              mapInstance.current.setCenter(loc)
              mapInstance.current.setZoom(Math.max(14, zoom || 14))

              // Draw or update a distinct user marker
              if (userMarkerRef.current) {
                userMarkerRef.current.setMap(null)
                userMarkerRef.current = null
              }
              if (window.google?.maps) {
                userMarkerRef.current = new window.google.maps.Marker({
                  position: loc,
                  map: mapInstance.current,
                  title: "Your Location",
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                  },
                })
              }
            }
          } catch {}
        },
        () => {},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      )
    } catch {}
  }

  // Optionally fetch live location shortly after mount
  useEffect(() => {
    if (!useLiveLocation) return
    const id = window.setTimeout(() => getAccurateUserLocation(), 400)
    return () => window.clearTimeout(id)
  }, [useLiveLocation])

  const openStalls = stalls.filter((stall) => stall.is_open)

  const handleGetDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, "_blank")
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
        style={{ height }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Map Background" fill className="object-cover" />
        </div>

        {/* Live Indicator */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 z-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">LIVE</span>
            </div>
            <span className="text-xs text-muted-foreground">{openStalls.length} open now</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-xs">Open & Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-xs">Closed</span>
            </div>
          </div>
        </div>

        {/* Locate Me Button */}
        {showLocateButton && (
          <div className="absolute top-4 right-4 z-10">
            <Button size="sm" variant="secondary" onClick={getAccurateUserLocation} className="shadow">
              <Navigation className="h-3 w-3 mr-1" />
              My location
            </Button>
          </div>
        )}

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <MapPin className="h-16 w-16 mx-auto text-orange-500 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <h3 className="text-xl font-bold mb-2">Interactive Street Food Map</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover {stalls.length} street food stalls in your area with real-time status updates
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => {
                    // Open Google Maps with all stall locations
                    const locations = stalls.map((s) => `${s.location_lat},${s.location_lng}`).join("|")
                    const url = `https://www.google.com/maps/search/street+food/@${stalls[0]?.location_lat || 40.7128},${stalls[0]?.location_lng || -74.006},12z`
                    window.open(url, "_blank")
                  }}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Open in Maps
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stall Cards */}
        {stalls.slice(0, 3).map((stall, index) => (
          <div
            key={stall.id}
            className={`absolute bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 max-w-xs cursor-pointer hover:shadow-xl transition-all duration-300 z-10 ${
              index === 0
                ? "top-20 right-4"
                : index === 1
                  ? "bottom-20 right-4"
                  : "top-1/2 left-4 transform -translate-y-1/2"
            }`}
            onClick={() => onStallSelect?.(stall.id)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={stall.image_url || "/placeholder.svg?height=48&width=48"}
                    alt={stall.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    stall.is_open ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{stall.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{stall.address.split(",")[0]}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge
                    className={`text-xs px-2 py-0 ${
                      stall.is_open ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {stall.is_open ? "OPEN" : "CLOSED"}
                  </Badge>
                  {stall.cuisine_tags.slice(0, 1).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Google Map */}
        <div ref={mapRef} className="h-full w-full rounded-lg" />
      </div>
    </div>
  )
}
