"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Filter, Globe, Compass, Layers } from "lucide-react"
import { SceneWrapper } from "@/components/3d/scene-wrapper"
import { MapGlobe3D } from "@/components/3d/map-globe-3d"
import { NavigationCompass3D } from "@/components/3d/navigation-compass-3d"
import { InteractiveBackground } from "@/components/3d/interactive-background"
import { motion } from "framer-motion"
import { getStalls } from "@/lib/data-client" // Using client-side data functions
import type { Stall } from "@/types"

export function MapView3D() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedStall, setSelectedStall] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [stalls, setStalls] = useState<Stall[]>([])
  const [viewMode, setViewMode] = useState<"3d" | "traditional">("3d")

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const stallsData = await getStalls()
        setStalls(stallsData)
      } catch (error) {
        console.error("Error fetching stalls:", error)
      }
    }
    fetchStalls()
  }, [])

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
        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setIsLocating(false)
        alert("Unable to get your location.")
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    )
  }

  // Convert stalls to 3D markers
  const stallMarkers = stalls.map((stall, index) => ({
    id: stall.id,
    name: stall.name,
    position: [
      (Math.random() - 0.5) * 6, // Random X position
      (Math.random() - 0.5) * 6, // Random Y position
      (Math.random() - 0.5) * 6, // Random Z position
    ] as [number, number, number],
    status: (stall.status === "open" ? "open" : "closed") as "open" | "closed",
    queueTime: Math.max(0, Math.floor((stall.current_queue_length || 0) * 1.5)),
    cuisineType: stall.cuisine_type,
  }))

  const handleStallClick = (stallId: string) => {
    setSelectedStall(stallId)
  }

  const handleDirectionsClick = () => {
    if (selectedStall && userLocation) {
      // In a real app, this would open directions
      alert(`Getting directions to stall ${selectedStall}`)
    }
  }

  const selectedStallData = stalls.find((s) => s.id === selectedStall)

  return (
    <div className="space-y-6">
      {/* 3D Map Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="glass-morphism-vibrant border-orange-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-orange-700">
              <Globe className="h-5 w-5 text-orange-500" />
              3D Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={getCurrentLocation}
                disabled={isLocating}
                variant="outline"
                size="sm"
                className="glass-morphism-vibrant border-orange-200 bg-transparent hover:bg-orange-50"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {isLocating ? "Locating..." : "Find My Location"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="glass-morphism-vibrant border-pink-200 bg-transparent hover:bg-pink-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter Stalls
              </Button>

              <Button
                onClick={() => setViewMode(viewMode === "3d" ? "traditional" : "3d")}
                variant="outline"
                size="sm"
                className="glass-morphism-vibrant border-green-200 hover:bg-green-50"
              >
                <Layers className="h-4 w-4 mr-2" />
                {viewMode === "3d" ? "2D View" : "3D View"}
              </Button>
            </div>

            {userLocation && (
              <div className="mt-4 p-3 glass-morphism-vibrant rounded-lg">
                <p className="text-sm font-body text-gray-700">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 3D Interactive Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="glass-morphism-vibrant border-orange-200/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[700px] w-full relative">
              {viewMode === "3d" ? (
                <SceneWrapper
                  className="w-full h-full"
                  cameraPosition={[0, 0, 10]}
                  environment="city"
                  enableControls={true}
                >
                  <InteractiveBackground />

                  {/* Main 3D Map Globe */}
                  <MapGlobe3D stalls={stallMarkers} onStallClick={handleStallClick} />

                  {/* Navigation Compass */}
                  <NavigationCompass3D
                    userLocation={userLocation || undefined}
                    targetLocation={
                      selectedStallData
                        ? {
                            lat: selectedStallData.latitude || 0,
                            lng: selectedStallData.longitude || 0,
                          }
                        : undefined
                    }
                    onDirectionsClick={handleDirectionsClick}
                  />
                </SceneWrapper>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 via-pink-100 to-green-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <p className="font-heading font-semibold text-gray-700">Traditional 2D Map</p>
                    <p className="font-body text-sm text-gray-600">Switch to 3D view for immersive experience</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Stall Info */}
      {selectedStallData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass-morphism-vibrant border-orange-200/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-orange-700">
                <Compass className="h-5 w-5 text-orange-500" />
                Selected Stall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{selectedStallData.name}</h3>
                  <p className="font-body text-gray-600 mb-3">{selectedStallData.description}</p>
                  <div className="flex gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className={`${
                        selectedStallData.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedStallData.status}
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {selectedStallData.cuisine_type}
                    </Badge>
                  </div>
                  <p className="font-body text-sm text-gray-600">
                    Queue time:{" "}
                    <span className="font-semibold text-orange-600">{Math.max(0, Math.floor((selectedStallData.current_queue_length || 0) * 1.5))} minutes</span>
                  </p>
                </div>
                <Button
                  onClick={handleDirectionsClick}
                  className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 3D Map Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="glass-morphism-vibrant border-orange-200/30">
          <CardHeader>
            <CardTitle className="font-heading text-orange-700">3D Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-body">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Open Stalls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Closed Stalls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Selected Stall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
