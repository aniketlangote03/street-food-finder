"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { EnhancedLiveMap } from "@/components/realtime/enhanced-live-map"
// Using runtime Google Maps script; avoid compile-time type dependency
type google = any

// Use the declaration from components/shared/google-maps.tsx to avoid conflicts

interface LiveMapProps extends React.HTMLAttributes<HTMLDivElement> {
  apiKey: string
  center?: { lat: number; lng: number }
  zoom?: number
  mapId?: string
}

export function LiveMap({
  apiKey,
  center = { lat: 34.052235, lng: -118.243683 }, // Default to Los Angeles
  zoom = 12,
  mapId = "DEMO_MAP_ID",
  className,
  ...props
}: LiveMapProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.google && window.google.maps) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=marker&v=beta&map_ids=${mapId}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    ;(window as any).initMap = () => {
      setScriptLoaded(true)
    }

    return () => {
      document.head.removeChild(script)
      if ((window as any).initMap) delete (window as any).initMap
    }
  }, [apiKey, mapId])

  if (!scriptLoaded) {
    return (
      <div className={cn("flex h-96 w-full items-center justify-center bg-muted", className)} {...props}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading map...</span>
      </div>
    )
  }

  return (
    <div className={cn("h-96 w-full", className)} {...props}>
      {/* You can choose between SimpleMap or EnhancedLiveMap based on complexity needed */}
      <EnhancedLiveMap center={center} zoom={zoom} mapId={mapId} />
    </div>
  )
}
