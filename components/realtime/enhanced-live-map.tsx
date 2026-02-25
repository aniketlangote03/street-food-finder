"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import type { Stall as LiveStall } from "@/types"
// Google Maps will be loaded dynamically via script tag

interface EnhancedLiveMapProps {
  center: { lat: number; lng: number }
  zoom: number
  mapId?: string
}

interface MarkerData {
  id: string
  marker: any // Google Maps Marker
  infoWindow: any // Google Maps InfoWindow
}

export function EnhancedLiveMap({ center, zoom, mapId }: EnhancedLiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any | null>(null)
  const markers = useRef<Map<string, MarkerData>>(new Map())
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Function to create or update a marker
  const updateMarker = (stall: LiveStall) => {
    if (!mapInstance.current || !window.google?.maps) return

    const position = { lat: stall.latitude, lng: stall.longitude }
    let markerData = markers.current.get(stall.id)

    if (!markerData) {
      // Create new marker
      const marker = new window.google.maps.Marker({
        map: mapInstance.current,
        position: position,
        title: stall.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: stall.status === "open" ? "#22c55e" : stall.status === "maintenance" ? "#f59e0b" : "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-lg">${stall.name}</h3>
            <p class="text-sm text-muted-foreground">${stall.location_description}</p>
            <p class="text-sm">Status: <span class="${stall.status === "open" ? "text-green-500" : "text-red-500"} font-semibold">${stall.status === "open" ? "Open" : "Closed"}</span></p>
            <p class="text-sm">Queue: <span class="font-semibold text-orange-500">${stall.current_queue_length || 0}</span></p>
            <p class="text-sm">Rating: ${stall.average_rating?.toFixed(1) || "N/A"} (${stall.review_count || 0} reviews)</p>
            <a href="/stall/${stall.id}" class="text-blue-500 hover:underline text-sm mt-2 inline-block">View Details</a>
          </div>
        `,
      })

      marker.addListener("click", () => {
        // Close any open info windows before opening a new one
        markers.current.forEach((m) => m.infoWindow.close())
        infoWindow.open(mapInstance.current, marker)
      })

      markerData = { id: stall.id, marker, infoWindow }
      markers.current.set(stall.id, markerData)
    } else {
      // Update existing marker position and title
      markerData.marker.setPosition(position)
      markerData.marker.setTitle(stall.name)
      // Update info window content if it's open
      if (markerData.infoWindow.getMap()) {
        markerData.infoWindow.setContent(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${stall.name}</h3>
            <p class="text-sm text-muted-foreground">${stall.location_description}</p>
            <p class="text-sm">Status: <span class="${stall.status === "open" ? "text-green-500" : "text-red-500"} font-semibold">${stall.status === "open" ? "Open" : "Closed"}</span></p>
            <p class="text-sm">Queue: <span class="font-semibold text-orange-500">${stall.current_queue_length || 0}</span></p>
            <p class="text-sm">Rating: ${stall.average_rating?.toFixed(1) || "N/A"} (${stall.review_count || 0} reviews)</p>
            <a href="/stall/${stall.id}" class="text-blue-500 hover:underline text-sm mt-2 inline-block">View Details</a>
          </div>
        `)
      }
    }
  }

  // Initialize map and fetch initial data
  useEffect(() => {
    if (mapRef.current && window.google?.maps && !mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      const fetchAndSubscribe = async () => {
        // Fetch initial stalls
        const { data, error } = await supabase
          .from("stalls")
          .select(`*`)
          // Skip is_approved filter for compatibility

        if (error) {
          console.error("Error fetching initial stalls for map:", error)
        } else {
          data.forEach(updateMarker)
        }

        // Set up real-time subscription
        const channel = supabase
          .channel("live_map_stalls")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "stalls",
            },
            (payload: any) => {
              console.log("Map Realtime change:", payload)
              if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                updateMarker(payload.new as LiveStall)
              } else if (payload.eventType === "DELETE") {
                const markerData = markers.current.get(payload.old.id)
                if (markerData) {
                  markerData.marker.setMap(null) // Remove marker from map
                  markerData.infoWindow.close() // Close info window if open
                  markers.current.delete(payload.old.id)
                }
              }
            },
          )
          .subscribe()

        channelRef.current = channel
      }

      fetchAndSubscribe()
    }
  }, [center, zoom, mapId, supabase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      markers.current.forEach((markerData) => {
        markerData.marker.setMap(null) // Remove all markers from the map
        markerData.infoWindow.close() // Close all info windows
      })
      markers.current.clear()
      mapInstance.current = null // Clear map instance
    }
  }, [supabase])

  return <div ref={mapRef} className="h-full w-full rounded-lg" />
}
