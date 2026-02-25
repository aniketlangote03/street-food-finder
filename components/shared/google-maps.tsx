"use client"
import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mapsConfig, validateMapsConfig, getMapsUrl } from "@/lib/config/maps"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    initMap?: () => void
    google: {
      maps: {
        Map: any
        Marker: any
        InfoWindow: any
        LatLngBounds: any
        SymbolPath: any
        marker: {
          AdvancedMarkerElement: any
        }
        places: {
          PlacesService: any
          PlacesServiceStatus: any
        }
        Geocoder: any
        event: {
          addListener: (instance: any, eventName: string, handler: Function) => any
        }
      }
    }
  }
}

import type { Stall } from "@/types"

type DataSource = "platform" | "google" | "combined"
type SortBy = "rating" | "distance" | "name"

interface GoogleMapsProps {
  stalls?: Stall[]
  onStallClick?: (stallId: string) => void
  className?: string
  showUserLocation?: boolean
  center?: { lat: number; lng: number }
  zoom?: number
  dataSource?: DataSource
  radiusKm?: number
  filterOpenNow?: boolean
  sortBy?: SortBy
  onPlacesUpdate?: (places: { id: string; name: string; lat: number; lng: number; rating?: number; userRatingsTotal?: number; openNow?: boolean; distanceKm?: number }[]) => void
  onStallsUpdate?: (stalls: { id: string; name: string; lat: number; lng: number; status?: string; distanceKm?: number }[]) => void
}

export function GoogleMaps({
  stalls = [],
  onStallClick,
  className = "w-full h-[400px]",
  showUserLocation = true,
  center,
  zoom = mapsConfig.defaultZoom,
  dataSource = "combined",
  radiusKm = 3,
  filterOpenNow = false,
  sortBy = "rating",
  onPlacesUpdate,
  onStallsUpdate,
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const userAccuracyRef = useRef<number | null>(null)
  const userAccuracyCircleRef = useRef<any | null>(null)
  const [accuracyBadge, setAccuracyBadge] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const preloadedLastGoodRef = useRef<boolean>(false)
  const { toast } = useToast()
  // Runtime guards to avoid zoom/fetch loops
  const userInteractedRef = useRef(false)
  const suppressIdleFetchRef = useRef(false)
  const lastFetchCenterRef = useRef<{ lat: number; lng: number } | null>(null)
  const autoFitDoneRef = useRef(false)
  const [nearbyPlaces, setNearbyPlaces] = useState<
    { id: string; name: string; lat: number; lng: number; rating?: number; userRatingsTotal?: number; openNow?: boolean }
  >([])
  const [placesForList, setPlacesForList] = useState<
    { id: string; name: string; lat: number; lng: number; rating?: number; userRatingsTotal?: number; openNow?: boolean; distanceKm?: number }[]
  >([])
  const [placeFilter, setPlaceFilter] = useState<{ keyword: string; type?: string } | null>({
    keyword: "street food|food stall|hawker|food truck",
    type: "restaurant",
  })
  const [platformNearby, setPlatformNearby] = useState<Stall[] | null>(null)

  const haversineMeters = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371000
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const lat1 = (a.lat * Math.PI) / 180
    const lat2 = (b.lat * Math.PI) / 180
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)))
  }

  useEffect(() => {
    let isMounted = true
    let failTimeout: any

    const loadGoogleMaps = async () => {
      try {
        validateMapsConfig()
        setIsLoading(true)
        setError(null)
        // Debug: indicate whether an API key is present (masked)
        if (process.env.NODE_ENV !== "production") {
          const hasKey = !!mapsConfig.apiKey
          console.info("[Maps] API key present:", hasKey ? "yes" : "no")
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Configuration error")
          setIsLoading(false)
        }
        return
      }

      // If already loaded by another component/page, reuse
      if (window.google?.maps) {
        if (isMounted) {
          setIsLoaded(true)
          setIsLoading(false)
        }
        return
      }

      // Prevent double-loading by sharing a single global load promise
      const w = window as any
      if (!w.__gmapsLoadPromise) {
        w.__gmapsLoadPromise = new Promise<void>((resolve, reject) => {
          // Reuse existing tag if present
          const existing = document.querySelector('script[data-gmaps="true"]') as HTMLScriptElement | null
          const script = existing ?? document.createElement("script")
          if (!existing) {
            script.src = getMapsUrl()
            script.async = true
            script.defer = true
            script.setAttribute("data-gmaps", "true")
            document.head.appendChild(script)
          }
          script.addEventListener("load", () => resolve(), { once: true })
          script.addEventListener("error", () => reject(new Error("Failed to load Google Maps script")), { once: true })
        })
      }

      try {
        await w.__gmapsLoadPromise
        if (isMounted) {
          setIsLoaded(true)
          setIsLoading(false)
        }
      } catch (e) {
        if (isMounted) {
          setError("Failed to load Google Maps. Please check your API key and internet connection.")
          setIsLoading(false)
          toast({ title: "Google Maps failed to load", description: "Check API key and enable Maps + Places APIs.", variant: "destructive" })
        }
      }

      // If the script doesn't call onload within 6s, surface an error
      failTimeout = setTimeout(() => {
        if (isMounted && !window.google?.maps) {
          setError(
            "Google Maps failed to load. Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and that Maps JavaScript API + Places API are enabled.",
          )
          setIsLoading(false)
          toast({ title: "Map timeout", description: "Maps script didn’t load. Verify API key and network.", variant: "destructive" })
        }
      }, 6000)

      return () => {
        // Do not reference out-of-scope 'script'; safely remove any leftover loader by data attribute
        const tag = document.querySelector('script[data-gmaps="true"]') as HTMLScriptElement | null
        if (tag && document.head.contains(tag)) {
          document.head.removeChild(tag)
        }
      }
    }

    loadGoogleMaps()

    return () => {
      isMounted = false
      if (failTimeout) clearTimeout(failTimeout)
    }
  }, [])

  // Preload last known good fix on map load to avoid random coarse start
  useEffect(() => {
    try {
      if (!isLoaded || userLocation) return
      const raw = localStorage.getItem("lastGoodLocation")
      if (!raw) return
      const parsed = JSON.parse(raw) as { loc: { lat: number; lng: number }; acc: number; t: number }
      // Use if not too old (e.g., 10 minutes)
      if (parsed && parsed.loc && typeof parsed.loc.lat === "number" && Date.now() - parsed.t < 10 * 60 * 1000) {
        setUserLocation(parsed.loc)
        userAccuracyRef.current = parsed.acc
        setAccuracyBadge(`${Math.round(parsed.acc)} m`)
        try {
          mapInstanceRef.current?.setCenter?.(parsed.loc)
        } catch {}
        // Keep a note that we preloaded, but do NOT skip fetching a fresh fix
        preloadedLastGoodRef.current = true
      }
    } catch {}
  }, [isLoaded, userLocation])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    try {
      const mapCenter = center || mapsConfig.defaultCenter
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom,
        maxZoom: mapsConfig.maxZoom,
        minZoom: mapsConfig.minZoom,
        mapId: mapsConfig.mapId,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      mapInstanceRef.current = map

      map.addListener("click", (event: any) => {
        console.log("[v0] Map clicked at:", event.latLng.lat(), event.latLng.lng())
      })

      // Mark when the user interacts so we stop auto-fitting bounds
      window.google.maps.event.addListener(map, "dragstart", () => {
        userInteractedRef.current = true
      })
      window.google.maps.event.addListener(map, "zoom_changed", () => {
        userInteractedRef.current = true
      })

      // Debounced auto-search on idle
      let idleTimer: any
      const onIdle = () => {
        if (idleTimer) clearTimeout(idleTimer)
        idleTimer = setTimeout(() => {
          try {
            if (suppressIdleFetchRef.current) return
            const c = map.getCenter?.()
            if (c) {
              const loc = { lat: c.lat(), lng: c.lng() }
              // Only fetch if center moved > 120m from last fetch
              const last = lastFetchCenterRef.current
              const movedEnough = !last || haversineMeters(last, loc) > 120
              if (movedEnough) {
                lastFetchCenterRef.current = loc
                fetchNearbyPlaces(loc)
                fetchNearbyPlatformStalls(loc)
              }
            }
          } catch (e) {
            console.error("idle search failed", e)
          }
        }, 500)
      }
      window.google.maps.event.addListener(map, "idle", onIdle)

      // Trigger an initial places search at the default center only if we are NOT using user location
      // This avoids the map jumping to default results right before a live fix arrives
      if (!showUserLocation) {
        const initialCenter = map.getCenter?.()
        if (initialCenter) {
          fetchNearbyPlaces({ lat: initialCenter.lat(), lng: initialCenter.lng() })
        }
      }
    } catch (err) {
      console.error("[v0] Map initialization error:", err)
      setError("Failed to initialize map. Please check your Google Maps configuration.")
    }
  }, [isLoaded, center, zoom])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    const bounds = new window.google.maps.LatLngBounds()

    const includePlatform = dataSource === "platform" || dataSource === "combined"
    const displayStalls = includePlatform
      ? ((platformNearby && platformNearby.length > 0 ? platformNearby : stalls) as Stall[])
      : ([] as Stall[])

    // Determine an origin to compute distances (user location preferred, otherwise map center)
    const originForStalls = (userLocation ?? (mapInstanceRef.current?.getCenter?.()
      ? { lat: mapInstanceRef.current?.getCenter?.().lat?.(), lng: mapInstanceRef.current?.getCenter?.().lng?.() }
      : null)) as { lat: number; lng: number } | null

    displayStalls.forEach((stall) => {
      const lat = Number((stall as any).latitude)
      const lng = Number((stall as any).longitude)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.warn("Skipping stall with invalid coordinates", { stall })
        return
      }
      const position = { lat, lng }

      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: stall.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor:
            (stall as any).status === "open"
              ? "#22c55e"
              : (stall as any).status === "maintenance"
              ? "#f59e0b"
              : (stall as any).status === "closed"
              ? "#ef4444"
              : "#6b7280", // gray for unknown
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      const status = (stall as any).status ?? "unknown"
      const statusClass =
        status === "open"
          ? "text-green-600"
          : status === "maintenance"
          ? "text-yellow-600"
          : status === "closed"
          ? "text-red-600"
          : "text-gray-600"
      const statusLabel = typeof status === "string" ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"

      const distKm = originForStalls ? Math.round((haversineMeters(originForStalls, position) / 1000) * 10) / 10 : null

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${stall.name}</h3>
            <p class="text-sm text-gray-600">${stall.cuisine_type}</p>
            <p class="text-sm font-medium ${statusClass}">
              ${statusLabel}
            </p>
            ${distKm !== null ? `<p class="text-xs text-gray-600">~ ${distKm} km away</p>` : ""}
            <p class="mt-2">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${position.lat},${position.lng}`)}" target="_blank" rel="noopener noreferrer" class="text-cyan-700 underline text-sm">Directions</a>
            </p>
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker)
        onStallClick?.(stall.id)
      })

      markersRef.current.push(marker)
      try {
        bounds.extend(position)
      } catch (e) {
        console.warn("Failed to extend bounds with position", position, e)
      }
    })

    // Render Google Places results with a distinct color, de-duplicated by distance vs platform stalls
    const platforms = (displayStalls || []).map((s) => ({ lat: (s as any).latitude, lng: (s as any).longitude }))
    const includePlaces = dataSource === "google" || dataSource === "combined"
    let placesFiltered = includePlaces
      ? nearbyPlaces.filter((p) => {
          const isDup = platforms.some((s) => haversineMeters(s, { lat: p.lat, lng: p.lng }) < 100)
          return !isDup
        })
      : []

    // Apply "Open now" filter if requested
    if (filterOpenNow) {
      const hasOpenData = placesFiltered.some((p) => typeof p.openNow === "boolean")
      if (hasOpenData) {
        placesFiltered = placesFiltered.filter((p) => p.openNow === true)
      } else {
        // Inform user once that precise Open Now requires details API; skipping filter to avoid empty results.
        try {
          toast({ title: "Open Now unavailable", description: "Precise open status requires place details. Showing all results.", variant: "default" })
        } catch {}
      }
    }

    // Lightweight client-side clustering for places
    const zoom = mapInstanceRef.current.getZoom?.() || 12
    const baseCell = 0.2 // degrees at low zoom
    const cellSize = baseCell / Math.max(1, Math.pow(2, (zoom - 5) * 0.5))
    const keyOf = (lat: number, lng: number) => `${Math.floor(lat / cellSize)}:${Math.floor(lng / cellSize)}`
    const origin = (userLocation ?? mapInstanceRef.current?.getCenter?.() ? { lat: mapInstanceRef.current?.getCenter?.().lat?.(), lng: mapInstanceRef.current?.getCenter?.().lng?.() } : null) as
      | { lat: number; lng: number }
      | null

    // Sort places before clustering for more predictable clusters and better list output
    if (sortBy === "rating") {
      placesFiltered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === "name") {
      placesFiltered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "distance" && origin) {
      placesFiltered.sort(
        (a, b) =>
          haversineMeters(origin, { lat: a.lat, lng: a.lng }) - haversineMeters(origin, { lat: b.lat, lng: b.lng }),
      )
    }

    const clusters = new Map<string, { lat: number; lng: number; count: number; samples: typeof placesFiltered }>()
    placesFiltered.forEach((p) => {
      const k = keyOf(p.lat, p.lng)
      const c = clusters.get(k)
      if (c) {
        c.lat = (c.lat * c.count + p.lat) / (c.count + 1)
        c.lng = (c.lng * c.count + p.lng) / (c.count + 1)
        c.count += 1
        c.samples.push(p)
      } else {
        clusters.set(k, { lat: p.lat, lng: p.lng, count: 1, samples: [p] })
      }
    })

    clusters.forEach((c) => {
      const position = { lat: c.lat, lng: c.lng }
      const isCluster = c.count > 1
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: isCluster ? `${c.count} places` : c.samples[0].name,
        label: isCluster ? { text: String(c.count), color: "#ffffff", fontSize: "12px" } : undefined,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isCluster ? 10 : 7,
          fillColor: isCluster ? "#6d28d9" : "#8b5cf6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      if (!isCluster) {
        const place = c.samples[0]
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${place.name}</h3>
              <p class="text-xs text-gray-600">Google</p>
              <p class="text-sm">${place.rating ? `${place.rating.toFixed(1)} ⭐ (${place.userRatingsTotal || 0})` : "No rating"}</p>
              ${
                typeof place.openNow === "boolean"
                  ? `<p class="text-xs ${place.openNow ? "text-green-600" : "text-red-600"}">${
                      place.openNow ? "Open now" : "Closed"
                    }</p>`
                  : ""
              }
            </div>
          `,
        })

        marker.addListener("click", () => infoWindow.open(mapInstanceRef.current, marker))
      } else {
        marker.addListener("click", () => {
          // Zoom into cluster
          const z = (mapInstanceRef.current.getZoom?.() || 12) + 2
          mapInstanceRef.current.setZoom(Math.min(18, z))
          mapInstanceRef.current.setCenter(position)
        })
      }

      markersRef.current.push(marker)
      bounds.extend(position)
    })

    if ((displayStalls.length > 0 || placesFiltered.length > 0) && !autoFitDoneRef.current) {
      try {
        suppressIdleFetchRef.current = true
        mapInstanceRef.current.fitBounds(bounds)
        autoFitDoneRef.current = true
      } finally {
        setTimeout(() => (suppressIdleFetchRef.current = false), 300)
      }
    }
    
    // Notify callers with list including optional distanceKm for UI lists
    // Build enriched list for both external callback and internal list UI
    const enriched = placesFiltered.map((p) => ({
      ...p,
      distanceKm: origin ? Math.round((haversineMeters(origin, { lat: p.lat, lng: p.lng }) / 1000) * 10) / 10 : undefined,
    }))

    setPlacesForList(enriched)
    onPlacesUpdate?.(enriched)

    if (onStallsUpdate) {
      const enrichedStalls = displayStalls.map((s) => {
        const slat = Number((s as any).latitude)
        const slng = Number((s as any).longitude)
        const dkm = originForStalls ? Math.round((haversineMeters(originForStalls, { lat: slat, lng: slng }) / 1000) * 10) / 10 : undefined
        return {
          id: (s as any).id as string,
          name: (s as any).name as string,
          lat: slat,
          lng: slng,
          status: (s as any).status as string | undefined,
          distanceKm: dkm,
        }
      })
      onStallsUpdate(enrichedStalls)
    }
  }, [stalls, isLoaded, onStallClick, nearbyPlaces, platformNearby, dataSource, filterOpenNow, sortBy, radiusKm])

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      toast({ title: "Location not supported", description: "Your browser does not support geolocation.", variant: "destructive" })
      return
    }

    const options: PositionOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }

    // Strategy: briefly watchPosition to obtain a better (lower accuracy value) fix, up to ~10s
    let best: GeolocationPosition | null = null
    let watchId: number | null = null
    const start = Date.now()

    const stopWatch = () => {
      if (watchId !== null) {
        try { navigator.geolocation.clearWatch(watchId) } catch {}
      }
    }

    const usePosition = (position: GeolocationPosition) => {
      const loc = { lat: position.coords.latitude, lng: position.coords.longitude }
      const newAcc = Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null
      const prevAcc = userAccuracyRef.current
      setUserLocation(loc)
      userAccuracyRef.current = typeof newAcc === 'number' ? (prevAcc ? Math.min(prevAcc, newAcc) : newAcc) : (prevAcc ?? null)
      // Persist last good fix if reasonably accurate
      try {
        if (userAccuracyRef.current && userAccuracyRef.current <= 5000) {
          localStorage.setItem("lastGoodLocation", JSON.stringify({ loc, acc: userAccuracyRef.current, t: Date.now() }))
        }
      } catch {}

      // Update accuracy badge
      if (userAccuracyRef.current) {
        const m = Math.round(userAccuracyRef.current)
        setAccuracyBadge(`${m} m`)
        if (m > 1000) {
          try { toast({ title: "Low location accuracy", description: "Accuracy is over 1 km. Try moving near a window, enable Wi‑Fi/GPS, or retry.", variant: "default" }) } catch {}
        }
      } else {
        setAccuracyBadge(null)
      }

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.setCenter(loc)
          mapInstanceRef.current.setZoom(15)
          // Prevent auto-fit or idle handlers from immediately overriding the live recenter
          try {
            suppressIdleFetchRef.current = true
            autoFitDoneRef.current = true
            setTimeout(() => { suppressIdleFetchRef.current = false }, 600)
          } catch {}

          // Marker for user
          new window.google.maps.Marker({
            position: loc,
            map: mapInstanceRef.current,
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

          // Draw/Update accuracy circle if accuracy is available
          try {
            const radius = userAccuracyRef.current || null
            if (radius && window.google?.maps) {
              if (userAccuracyCircleRef.current) {
                userAccuracyCircleRef.current.setMap(null)
                userAccuracyCircleRef.current = null
              }
              userAccuracyCircleRef.current = new window.google.maps.Circle({
                strokeColor: "#60a5fa",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#93c5fd",
                fillOpacity: 0.2,
                map: mapInstanceRef.current,
                center: loc,
                radius,
              })
            }
          } catch {}
        } catch (e) {
          console.warn("Failed to mark user location on map", e)
        }
      }

      // Query nearby after fixing location
      fetchNearbyPlaces(loc)
      fetchNearbyPlatformStalls(loc)
      setLocating(false)
    }

    try {
      setLocating(true)
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          // Keep best by accuracy (smaller is better). If accuracy missing, treat as worse.
          const acc = pos.coords.accuracy
          const bestAcc = best?.coords.accuracy ?? Number.POSITIVE_INFINITY
          if (!best || (typeof acc === "number" && acc < bestAcc)) {
            best = pos
            // If very good fix, use immediately
            if (typeof acc === "number" && acc <= 50) {
              stopWatch()
              usePosition(best)
            }
          }
          // Stop after 8 seconds regardless and use best
          if (Date.now() - start > 10000) {
            stopWatch()
            usePosition(best || pos)
          }
        },
        (geoError) => {
          stopWatch()
          // Fallback: single-shot getCurrentPosition
          navigator.geolocation.getCurrentPosition(
            (single) => usePosition(single),
            (err2) => {
              let message = "Unable to get your location"
              if (geoError?.code === geoError.PERMISSION_DENIED || err2?.code === err2.PERMISSION_DENIED) {
                message = "Location permission denied. Please allow location access in your browser settings."
              } else if (geoError?.code === geoError.POSITION_UNAVAILABLE || err2?.code === err2.POSITION_UNAVAILABLE) {
                message = "Location information is unavailable."
              } else if (geoError?.code === geoError.TIMEOUT || err2?.code === err2.TIMEOUT) {
                message = "Location request timed out."
              }
              setError(message)
              toast({ title: "Location error", description: message, variant: "destructive" })
              setLocating(false)

              try {
                const fallback = center || mapsConfig.defaultCenter
                mapInstanceRef.current?.setCenter?.(fallback)
              } catch {}
            },
            options,
          )
        },
        options,
      )
    } catch (e) {
      // If watchPosition fails synchronously, fallback to single-shot
      navigator.geolocation.getCurrentPosition(
        (pos) => { usePosition(pos); setLocating(false) },
        () => {
          setError("Unable to get your location")
          toast({ title: "Location error", description: "Could not determine location.", variant: "destructive" })
          setLocating(false)
        },
        options,
      )
    }
  }

  const fetchNearbyPlaces = (location: { lat: number; lng: number }) => {
    try {
      if (!window.google?.maps || !mapInstanceRef.current) return

      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current)
      const request = {
        location,
        radius: Math.max(100, Math.min(50000, Math.round((radiusKm || 3) * 1000))),
        keyword: placeFilter?.keyword,
        type: placeFilter?.type,
      } as any

      service.nearbySearch(request, async (results: any[], status: any) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !Array.isArray(results)) return

        const basic = results
          .filter((r) => r.geometry?.location)
          .map((r) => ({
            id: r.place_id as string,
            name: r.name as string,
            lat: r.geometry.location.lat(),
            lng: r.geometry.location.lng(),
            rating: typeof r.rating === "number" ? r.rating : undefined,
            userRatingsTotal: typeof r.user_ratings_total === "number" ? r.user_ratings_total : undefined,
            // Do not access deprecated opening_hours.open_now here to avoid warnings.
            // Accurate "Open now" requires Places Details API isOpen(); leaving undefined by default.
            openNow: undefined,
          }))

        // Fetch details for top results to enrich list (address, open status, photo)
        const fields: any = [
          "place_id",
          "name",
          "formatted_address",
          "opening_hours",
          "price_level",
          "website",
          "formatted_phone_number",
          "photos",
          "geometry",
        ]

        const concurrency = 4
        const targets = basic.slice(0, 12)
        const queue: Promise<any>[] = []
        const enriched: typeof basic = [...basic]

        const getPhotoUrl = (place: any): string | undefined => {
          try {
            const p = Array.isArray(place.photos) && place.photos[0]
            if (!p) return undefined
            return p.getUrl({ maxWidth: 400, maxHeight: 300 })
          } catch { return undefined }
        }

        const fetchOne = (placeId: string, idx: number) =>
          new Promise<void>((resolve) => {
            try {
              service.getDetails({ placeId, fields }, (det: any, st: any) => {
                if (st === window.google.maps.places.PlacesServiceStatus.OK && det) {
                  try {
                    const isOpen = typeof det.opening_hours?.isOpen === "function" ? det.opening_hours.isOpen() : undefined
                    const photoUrl = getPhotoUrl(det)
                    enriched[idx] = {
                      ...enriched[idx],
                      name: det.name || enriched[idx].name,
                      lat: det.geometry?.location?.lat?.() ?? enriched[idx].lat,
                      lng: det.geometry?.location?.lng?.() ?? enriched[idx].lng,
                      openNow: typeof isOpen === "boolean" ? isOpen : enriched[idx].openNow,
                      // Attach as any extra props for UI
                      ...(det.formatted_address ? { formatted_address: det.formatted_address } as any : {}),
                      ...(typeof det.price_level === "number" ? { price_level: det.price_level } as any : {}),
                      ...(photoUrl ? { photoUrl } as any : {}),
                      ...(det.website ? { website: det.website } as any : {}),
                      ...(det.formatted_phone_number ? { phone: det.formatted_phone_number } as any : {}),
                    }
                  } catch {}
                }
                resolve()
              })
            } catch {
              resolve()
            }
          })

        // Run details fetch with limited concurrency
        for (let i = 0; i < targets.length; i++) {
          const p = fetchOne(targets[i].id, i)
          queue.push(p)
          if (queue.length >= concurrency) {
            await Promise.all(queue.splice(0))
          }
        }
        if (queue.length) await Promise.all(queue)

        setNearbyPlaces(enriched)
        onPlacesUpdate?.(enriched)
      })
    } catch (e) {
      console.error("Failed to query Google Places", e)
    }
  }

  // Auto-prompt for location once when map is ready and button is visible
  useEffect(() => {
    // Always attempt to fetch a fresh fix even if a preloaded lastGoodLocation exists
    if (showUserLocation && isLoaded && !userLocation) {
      // Slight delay to avoid blocking first render
      const id = setTimeout(() => getUserLocation(), 300)
      return () => clearTimeout(id)
    }
  }, [showUserLocation, isLoaded, userLocation])

  const fetchNearbyPlatformStalls = async (location: { lat: number; lng: number }) => {
    try {
      const params = new URLSearchParams({ lat: String(location.lat), lng: String(location.lng), radiusKm: String(radiusKm || 3) })
      const res = await fetch(`/api/stalls/nearby?${params.toString()}`)
      if (!res.ok) return
      const data = (await res.json()) as Stall[]
      setPlatformNearby(data)
    } catch (e) {
      console.error("Failed to load nearby platform stalls", e)
    }
  }

  const retryLoad = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
  }

  if (error) {
    // Fallback: show a simple Google Maps embed without API key so user still sees a map
    const q = encodeURIComponent("street food near me")
    const embedUrl = `https://www.google.com/maps?q=${q}&output=embed`
    return (
      <div className={`relative ${className}`}>
        <div className="absolute z-10 top-2 left-2 right-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={retryLoad} size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
        </div>
        <iframe title="Map fallback" className="w-full h-full rounded-lg border" src={embedUrl} />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading Google Maps...</span>
          </div>
        </div>
      )}

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      )}

      {isLoaded && (
        <div className="absolute top-4 right-4 flex flex-wrap gap-2 items-center">
          {showUserLocation && (
            <Button onClick={getUserLocation} size="sm" disabled={locating} className="bg-white text-gray-700 hover:bg-gray-50 border shadow-md">
              {locating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <MapPin className="h-4 w-4 mr-1" />}
              My Location
            </Button>
          )}
          {accuracyBadge && (
            <span className="text-xs px-2 py-1 rounded bg-white border shadow-sm text-gray-700">Acc: {accuracyBadge}</span>
          )}
          <Button
            onClick={() => {
              try {
                const centerObj = center || mapsConfig.defaultCenter
                mapInstanceRef.current?.setCenter?.(centerObj)
                mapInstanceRef.current?.setZoom?.(mapsConfig.defaultZoom)
                fetchNearbyPlaces(centerObj)
                fetchNearbyPlatformStalls(centerObj)
              } catch (e) {
                console.error("Failed to recenter", e)
              }
            }}
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-50 border shadow-md"
          >
            Recenter
          </Button>
          <Button
            onClick={() => {
              try { useMapCenterAsLocation() } catch {}
            }}
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-50 border shadow-md"
          >
            Use map center
          </Button>
          <Button
            onClick={() => {
              try { getUserLocation() } catch {}
            }}
            size="sm"
            disabled={locating}
            className="bg-white text-gray-700 hover:bg-gray-50 border shadow-md"
          >
            Retry location
          </Button>
          <Button
            onClick={() => {
              try {
                const c = mapInstanceRef.current?.getCenter?.()
                if (c) {
                  const centerObj = { lat: c.lat(), lng: c.lng() }
                  fetchNearbyPlaces(centerObj)
                }
              } catch (e) {
                console.error("Failed to search this area", e)
              }
            }}
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-50 border shadow-md"
          >
            Search this area
          </Button>
        </div>
      )}

      {isLoaded && (
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {[{
            label: "Street food",
            keyword: "street food|food stall|hawker|food truck",
            type: "restaurant",
          },
          { label: "Restaurants", keyword: "restaurant", type: "restaurant" },
          { label: "Cafes", keyword: "cafe", type: "cafe" }].map((opt) => (
            <Button
              key={opt.label}
              size="sm"
              variant={placeFilter?.label === opt.label ? "default" : "outline" as any}
              className="bg-white text-gray-700 hover:bg-gray-50 border shadow-md"
              onClick={() => {
                // store label in state for UI selection
                setPlaceFilter({ ...opt } as any)
                const c = mapInstanceRef.current?.getCenter?.()
                if (c) fetchNearbyPlaces({ lat: c.lat(), lng: c.lng() })
              }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}
      {/* Inline results list below the map for Google Places */}
      {isLoaded && placesForList && placesForList.length > 0 && (
        <div className="absolute left-0 right-0 bottom-0 translate-y-full mt-3">
          <div className="bg-white/95 backdrop-blur border rounded-lg shadow p-3 mx-1 sm:mx-0">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Results</div>
              <div className="text-xs text-gray-500">{placesForList.length} places</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-auto">
              {placesForList.slice(0, 20).map((p) => (
                <div key={p.id} className="border rounded-md p-2 flex items-start gap-2">
                  {Boolean((p as any).photoUrl) && (
                    <img src={(p as any).photoUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate" title={p.name}>{p.name || "Unnamed place"}</div>
                    <div className="text-xs text-gray-600 truncate" title={(p as any).formatted_address || ""}>
                      {(p as any).formatted_address || ""}
                    </div>
                    <div className="text-xs text-gray-700 mt-1 flex flex-wrap gap-1">
                      <span>
                        {typeof p.rating === "number" ? `${p.rating.toFixed(1)} ★` : "No rating"}
                        {typeof p.userRatingsTotal === "number" ? ` • ${p.userRatingsTotal} reviews` : ""}
                        {typeof p.openNow === "boolean" ? ` • ${p.openNow ? "Open now" : "Closed"}` : ""}
                        {typeof (p as any).price_level === "number" ? ` • ${"$".repeat(Math.max(1, Math.min(4, (p as any).price_level)))}` : ""}
                        {typeof p.distanceKm === "number" ? ` • ${p.distanceKm} km` : ""}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-700 hover:underline text-xs"
                      >
                        Directions
                      </a>
                      {Boolean((p as any).website) && (
                        <a
                          href={(p as any).website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:underline text-xs"
                        >
                          Website
                        </a>
                      )}
                      {Boolean((p as any).phone) && (
                        <a href={`tel:${(p as any).phone}`} className="text-gray-700 hover:underline text-xs">
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
