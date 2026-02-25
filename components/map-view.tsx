"use client"

import { useState } from "react"
import { EnhancedLiveMap } from "@/components/realtime/enhanced-live-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Filter } from "lucide-react"
import { mapsConfig } from "@/lib/config/maps"

export function MapView() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState(mapsConfig.defaultCenter)
  const [isLocating, setIsLocating] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(location)
        setMapCenter(location)
        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setIsLocating(false)
        alert("Unable to get your location. Using default location.")
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    )
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Map Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={getCurrentLocation} disabled={isLocating} variant="outline" size="sm">
              <Navigation className="h-4 w-4 mr-2" />
              {isLocating ? "Locating..." : "Find My Location"}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Stalls
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Live Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <EnhancedLiveMap center={mapCenter} zoom={mapsConfig.defaultZoom} mapId={mapsConfig.mapId} />
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Open Stalls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Closed Stalls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Busy (Long Queue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
