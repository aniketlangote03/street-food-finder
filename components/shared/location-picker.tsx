"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Loader2, Search, AlertCircle, RefreshCw } from "lucide-react"
import { mapsConfig, validateMapsConfig, getMapsUrl } from "@/lib/config/maps"

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number }
  className?: string
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  className = "w-full h-[400px]",
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markerRef = useRef<any | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null)
  const [address, setAddress] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadGoogleMaps = async () => {
      try {
        validateMapsConfig()
        setIsLoading(true)
        setError(null)
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Configuration error")
          setIsLoading(false)
        }
        return
      }

      if (window.google?.maps) {
        if (isMounted) {
          setIsLoaded(true)
          setIsLoading(false)
        }
        return
      }

      const script = document.createElement("script")
      script.src = getMapsUrl()
      script.async = true
      script.defer = true

      script.onload = () => {
        if (isMounted) {
          setIsLoaded(true)
          setIsLoading(false)
        }
      }

      script.onerror = () => {
        if (isMounted) {
          setError("Failed to load Google Maps. Please check your API key and internet connection.")
          setIsLoading(false)
        }
      }

      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }

    loadGoogleMaps()

    return () => {
      isMounted = false
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialLocation || mapsConfig.defaultCenter,
        zoom: 15,
        maxZoom: mapsConfig.maxZoom,
        minZoom: mapsConfig.minZoom,
        mapId: mapsConfig.mapId,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "cooperative",
      })

      mapInstanceRef.current = map

      // Add click listener to map
      map.addListener("click", (event: any) => {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
        updateLocation(location)
      })

      // Initialize with initial location if provided
      if (initialLocation) {
        updateLocation(initialLocation)
      }
    } catch (err) {
      console.error("[v0] Map initialization error:", err)
      setError("Failed to initialize map. Please check your Google Maps configuration.")
    }
  }, [isLoaded, initialLocation])

  const updateLocation = useCallback(
    async (location: { lat: number; lng: number }) => {
      if (!mapInstanceRef.current) return

      setSelectedLocation(location)

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setPosition(location)
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          draggable: true,
          title: "Selected Location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        })

        // Add drag listener to marker
        markerRef.current.addListener("dragend", (event: any) => {
          const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          }
          updateLocation(newLocation)
        })
      }

      // Reverse geocode to get address
      try {
        const geocoder = new window.google.maps.Geocoder()
        const response = await geocoder.geocode({ location })

        if (response.results[0]) {
          const formattedAddress = response.results[0].formatted_address
          setAddress(formattedAddress)
          onLocationSelect({ ...location, address: formattedAddress })
        } else {
          const fallbackAddress = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
          setAddress(fallbackAddress)
          onLocationSelect({ ...location, address: fallbackAddress })
        }
      } catch (err) {
        console.error("[v0] Geocoding failed:", err)
        const fallbackAddress = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
        setAddress(fallbackAddress)
        onLocationSelect({ ...location, address: fallbackAddress })
      }
    },
    [onLocationSelect],
  )

  const [isSearching, setIsSearching] = useState(false)

  const searchLocation = async () => {
    if (!searchQuery.trim() || !isLoaded || isSearching) return

    setIsSearching(true)
    try {
      const geocoder = new window.google.maps.Geocoder()
      const response = await geocoder.geocode({ address: searchQuery })

      if (response.results[0]) {
        const location = response.results[0].geometry.location
        const newLocation = {
          lat: location.lat(),
          lng: location.lng(),
        }

        mapInstanceRef.current?.setCenter(newLocation)
        mapInstanceRef.current?.setZoom(15)
        updateLocation(newLocation)
      } else {
        setError("Location not found. Please try a different search term.")
      }
    } catch (err) {
      console.error("[v0] Search failed:", err)
      setError("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        mapInstanceRef.current?.setCenter(location)
        mapInstanceRef.current?.setZoom(15)
        updateLocation(location)
        setIsGettingLocation(false)
      },
      (error) => {
        setError("Unable to get your location. Please check your browser permissions.")
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    )
  }

  const retryLoad = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
  }

  if (error) {
    return (
      <div className="space-y-4">
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
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="font-semibold text-gray-700">
          <MapPin className="w-4 h-4 inline mr-2" />
          Select Location
        </Label>

        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchLocation()}
            className="glass-morphism border-orange-200"
            disabled={!isLoaded}
          />
          <Button
            type="button"
            onClick={searchLocation}
            disabled={!isLoaded || isSearching || !searchQuery.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
          <Button
            type="button"
            onClick={getCurrentLocation}
            disabled={!isLoaded || isGettingLocation}
            variant="outline"
            className="glass-morphism border-orange-200 bg-transparent"
          >
            {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className={`relative ${className} rounded-lg overflow-hidden border border-orange-200`}>
        <div ref={mapRef} className="w-full h-full" />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading Google Maps...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="glass-morphism p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-2">Selected Location</h4>
          <p className="text-sm text-gray-600 mb-2">{address || "Getting address..."}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>Latitude: {selectedLocation.lat.toFixed(6)}</div>
            <div>Longitude: {selectedLocation.lng.toFixed(6)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
