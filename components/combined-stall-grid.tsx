"use client"
import { useState, useEffect } from 'react'
import { StallGrid } from './public/stall-grid'
import { StallCard } from './public/stall-card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MapPin, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { useGooglePlaces } from '@/hooks/use-google-places'
import { createClient } from '@/lib/supabase/client'
import type { Stall } from '@/types'
import type { GooglePlace } from '@/lib/services/google-places'

interface CombinedStallGridProps {
  manualStalls?: Stall[]
  showGooglePlaces?: boolean
  userLocation?: { lat: number; lng: number }
  searchRadius?: number
}

export function CombinedStallGrid({ 
  manualStalls = [], 
  showGooglePlaces = true,
  userLocation,
  searchRadius = 2000 
}: CombinedStallGridProps) {
  const [allStalls, setAllStalls] = useState<(Stall | GooglePlace)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  
  const { 
    places: googlePlaces, 
    loading: placesLoading, 
    error: placesError,
    searchNearby,
    getUserLocation,
    mapsReady,
  } = useGooglePlaces()

  // Use manual stalls if provided, otherwise fetch all
  useEffect(() => {
    if (manualStalls.length > 0) {
      setAllStalls(prev => {
        const googleStalls = prev.filter(stall => stall.id.startsWith('google_'))
        return [...manualStalls, ...googleStalls]
      })
    } else {
      const fetchManualStalls = async () => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('stalls')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error fetching manual stalls:', error)
            return
          }

          setAllStalls(prev => {
            const manualStalls = data || []
            const googleStalls = prev.filter(stall => stall.id.startsWith('google_'))
            return [...manualStalls, ...googleStalls]
          })
        } catch (err) {
          console.error('Error fetching manual stalls:', err)
        }
      }

      fetchManualStalls()
    }
  }, [manualStalls])

  // Update combined stalls when Google Places change
  useEffect(() => {
    if (googlePlaces.length > 0) {
      setAllStalls(prev => {
        const manualStalls = prev.filter(stall => !stall.id.startsWith('google_'))
        return [...manualStalls, ...googlePlaces]
      })
    }
  }, [googlePlaces])

  // Get user location and search for nearby places (only after Maps Places API is ready)
  useEffect(() => {
    if (!mapsReady || !showGooglePlaces) return
    if (!userLocation) {
      handleGetUserLocation()
    } else {
      searchForNearbyPlaces(userLocation)
    }
  }, [mapsReady, showGooglePlaces, userLocation])

  const handleGetUserLocation = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const location = await getUserLocation()
      setLocationPermission('granted')
      await searchForNearbyPlaces(location)
    } catch (err) {
      setLocationPermission('denied')
      setError('Unable to get your location. Please enable location access or search manually.')
      console.error('Location error:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchForNearbyPlaces = async (location: { lat: number; lng: number }) => {
    try {
      await searchNearby({
        location,
        radius: searchRadius,
        keyword: 'street food|food stall|hawker|food truck|food court',
        type: 'restaurant',
        openNow: true
      })
    } catch (err) {
      console.error('Error searching nearby places:', err)
    }
  }

  const handleRefresh = () => {
    if (!mapsReady && showGooglePlaces) {
      setError('Google Maps is still loading. Please try again in a moment.')
      return
    }
    if (userLocation) {
      searchForNearbyPlaces(userLocation)
    } else {
      handleGetUserLocation()
    }
  }

  if (allStalls.length === 0 && !loading && !placesLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No food stalls found</h3>
        <p className="text-gray-500 mb-4">
          {showGooglePlaces 
            ? "We couldn't find any nearby food stalls. Try enabling location access or search in a different area."
            : "No stalls are available in your area right now."
          }
        </p>
        {showGooglePlaces && (
          <Button onClick={handleGetUserLocation} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
            Find Nearby Stalls
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Food Stalls ({allStalls.length})
          </h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {allStalls.filter(stall => !stall.id.startsWith('google_')).length} Local
            </Badge>
            {showGooglePlaces && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {allStalls.filter(stall => stall.id.startsWith('google_')).length} Google Places
              </Badge>
            )}
          </div>
        </div>
        
        {showGooglePlaces && (
          <Button 
            onClick={handleRefresh} 
            disabled={loading || placesLoading}
            variant="outline"
            size="sm"
          >
            {(loading || placesLoading) ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        )}
      </div>

      {/* Error display */}
      {(error || placesError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Error loading places</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            {error || placesError}
          </p>
        </div>
      )}

      {/* Loading indicator */}
      {(loading || placesLoading) && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-gray-600">Finding nearby food stalls...</span>
        </div>
      )}

      {/* Stalls grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allStalls.map((stall) => (
          <div key={stall.id} className="relative">
            <StallCard stall={stall as Stall} />
            {stall.id.startsWith('google_') && (
              <Badge 
                className="absolute top-2 right-2 bg-green-500 text-white text-xs"
                variant="secondary"
              >
                Google
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

