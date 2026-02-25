import { mapsConfig } from "@/lib/config/maps"

export interface GooglePlace {
  id: string
  name: string
  description?: string
  address: string
  location_lat: number
  location_lng: number
  cuisine_type?: string
  image_url?: string
  average_rating?: number
  review_count?: number
  is_approved: boolean
  current_queue_length?: number
  opening_time?: string
  closing_time?: string
  place_id: string
  price_level?: number
  open_now?: boolean
  types?: string[]
  photos?: string[]
  website?: string
  phone_number?: string
}

export interface PlaceSearchRequest {
  location: { lat: number; lng: number }
  radius?: number
  keyword?: string
  type?: string
  minPriceLevel?: number
  maxPriceLevel?: number
  openNow?: boolean
}

export class GooglePlacesService {
  private static instance: GooglePlacesService
  private placesService: any = null
  private map: any = null

  private constructor() {}

  public static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService()
    }
    return GooglePlacesService.instance
  }

  public initialize(map: any): void {
    this.map = map
    if (window.google?.maps?.places) {
      this.placesService = new window.google.maps.places.PlacesService(map)
    }
  }

  // Ensure the PlacesService is initialized. If no map provided yet,
  // create a hidden map to back the service lazily on the client.
  private ensureInitialized(): void {
    if (this.placesService) return
    if (typeof window === 'undefined' || !(window as any).google?.maps?.places) return

    if (!this.map) {
      const container = document.createElement('div')
      container.style.width = '0px'
      container.style.height = '0px'
      container.style.overflow = 'hidden'
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      document.body.appendChild(container)
      this.map = new (window as any).google.maps.Map(container, {
        center: { lat: 0, lng: 0 },
        zoom: 3,
      })
    }
    this.placesService = new (window as any).google.maps.places.PlacesService(this.map)
  }

  public async searchNearbyFoodStalls(request: PlaceSearchRequest): Promise<GooglePlace[]> {
    this.ensureInitialized()
    if (!this.placesService) {
      throw new Error("Places service not initialized. Ensure Google Maps Places API is loaded.")
    }

    return new Promise((resolve, reject) => {
      const gmaps: any = (window as any).google.maps
      const searchRequest = {
        location: new gmaps.LatLng(request.location.lat, request.location.lng),
        radius: request.radius || 2000, // 2km default radius
        keyword: request.keyword || "street food|food stall|hawker|food truck|food court",
        type: request.type || "restaurant",
        minPriceLevel: request.minPriceLevel,
        maxPriceLevel: request.maxPriceLevel,
      }

      this.placesService.nearbySearch(searchRequest, (results: any[], status: any) => {
        if (status === (window as any).google.maps.places.PlacesServiceStatus.OK) {
          const places = results.map((r: any) => this.convertGooglePlaceToStall(r))
          resolve(places)
        } else {
          reject(new Error(`Places search failed: ${status}`))
        }
      })
    })
  }

  public async getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
    this.ensureInitialized()
    if (!this.placesService) {
      throw new Error("Places service not initialized. Ensure Google Maps Places API is loaded.")
    }

    return new Promise((resolve, reject) => {
      const request = {
        placeId,
        fields: [
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'user_ratings_total',
          'price_level',
          'opening_hours',
          'photos',
          'types',
          'website',
          'formatted_phone_number',
          'reviews'
        ]
      }

      this.placesService.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const convertedPlace = this.convertGooglePlaceToStall(place, true)
          resolve(convertedPlace)
        } else {
          reject(new Error(`Place details failed: ${status}`))
        }
      })
    })
  }

  private convertGooglePlaceToStall(place: any, isDetailed: boolean = false): GooglePlace {
    const location = place.geometry?.location
    const photos = place.photos || []
    const photoUrl = photos.length > 0 
      ? photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
      : undefined

    // Determine cuisine type from place types
    const cuisineType = this.determineCuisineType(place.types || [])

    // Extract opening hours
    const openingHours = place.opening_hours
    const openingTime = openingHours?.weekday_text?.[0]?.split(' ')[1] || '09:00'
    const closingTime = openingHours?.weekday_text?.[0]?.split(' ')[3] || '21:00'

    return {
      id: `google_${place.place_id}`,
      name: place.name || 'Unknown Place',
      description: place.editorial_summary?.overview || `A ${cuisineType} restaurant located at ${place.formatted_address}`,
      address: place.formatted_address || place.vicinity || 'Address not available',
      location_lat: location?.lat() || 0,
      location_lng: location?.lng() || 0,
      cuisine_type: cuisineType,
      image_url: photoUrl,
      average_rating: place.rating || 0,
      review_count: place.user_ratings_total || 0,
      is_approved: true, // Google Places are considered approved
      current_queue_length: Math.floor(Math.random() * 20), // Random queue length for demo
      opening_time: openingTime,
      closing_time: closingTime,
      place_id: place.place_id,
      price_level: place.price_level,
      types: place.types || [],
      photos: photos.map((photo: any) => photo.getUrl({ maxWidth: 400, maxHeight: 300 })),
      website: place.website,
      phone_number: place.formatted_phone_number,
    }
  }

  private determineCuisineType(types: string[]): string {
    const cuisineMap: { [key: string]: string } = {
      'chinese_restaurant': 'Chinese',
      'indian_restaurant': 'Indian',
      'japanese_restaurant': 'Japanese',
      'korean_restaurant': 'Korean',
      'thai_restaurant': 'Thai',
      'vietnamese_restaurant': 'Vietnamese',
      'mexican_restaurant': 'Mexican',
      'italian_restaurant': 'Italian',
      'french_restaurant': 'French',
      'american_restaurant': 'American',
      'seafood_restaurant': 'Seafood',
      'steak_house': 'Steakhouse',
      'pizza_restaurant': 'Pizza',
      'fast_food_restaurant': 'Fast Food',
      'cafe': 'Cafe',
      'bakery': 'Bakery',
      'dessert_shop': 'Dessert',
      'ice_cream_shop': 'Ice Cream',
      'food': 'Food',
      'restaurant': 'Restaurant',
    }

    for (const type of types) {
      if (cuisineMap[type]) {
        return cuisineMap[type]
      }
    }

    return 'Restaurant'
  }

  public async getUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0, // Do not use cached position; force a fresh fix
        }
      )
    })
  }
}

export const googlePlacesService = GooglePlacesService.getInstance()

