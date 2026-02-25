import { useState, useEffect, useCallback } from 'react'
import { googlePlacesService, GooglePlace, PlaceSearchRequest } from '@/lib/services/google-places'

interface UseGooglePlacesReturn {
  places: GooglePlace[]
  loading: boolean
  error: string | null
  searchNearby: (request: PlaceSearchRequest) => Promise<void>
  getUserLocation: () => Promise<{ lat: number; lng: number }>
  refreshPlaces: () => void
  mapsReady: boolean
}

export function useGooglePlaces(): UseGooglePlacesReturn {
  const [places, setPlaces] = useState<GooglePlace[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSearchRequest, setLastSearchRequest] = useState<PlaceSearchRequest | null>(null)
  const [mapsReady, setMapsReady] = useState(false)

  // Detect when Google Maps Places API has loaded in the browser
  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => !!(window as any).google?.maps?.places
    if (check()) {
      setMapsReady(true)
      return
    }
    const id = window.setInterval(() => {
      if (check()) {
        setMapsReady(true)
        window.clearInterval(id)
      }
    }, 300)
    return () => window.clearInterval(id)
  }, [])

  const searchNearby = useCallback(async (request: PlaceSearchRequest) => {
    setLastSearchRequest(request)
    if (!mapsReady) {
      // Do not throw; surface a friendly, non-crashing message
      setError('Google Maps Places API not loaded yet. Please wait a moment and try again.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const results = await googlePlacesService.searchNearbyFoodStalls(request)
      setPlaces(results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search nearby places'
      setError(errorMessage)
      console.error('Google Places search error:', err)
    } finally {
      setLoading(false)
    }
  }, [mapsReady])

  const getUserLocation = useCallback(async (): Promise<{ lat: number; lng: number }> => {
    try {
      return await googlePlacesService.getUserLocation()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user location'
      setError(errorMessage)
      throw err
    }
  }, [])

  const refreshPlaces = useCallback(() => {
    if (lastSearchRequest) {
      searchNearby(lastSearchRequest)
    }
  }, [lastSearchRequest, searchNearby])

  return {
    places,
    loading,
    error,
    searchNearby,
    getUserLocation,
    refreshPlaces,
    mapsReady,
  }
}

