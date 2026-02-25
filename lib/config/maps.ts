export const mapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  libraries: ["places", "geometry", "marker"] as const,
  defaultCenter: {
    lat: 1.3521, // Singapore coordinates as default
    lng: 103.8198,
  },
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 8,
  region: "SG", // Singapore region code
  language: "en",
}

export function validateMapsConfig() {
  if (!mapsConfig.apiKey) {
    throw new Error(
      "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file. See docs/GOOGLE_MAPS_SETUP.md for setup instructions.",
    )
  }

  if (mapsConfig.apiKey === "your-google-maps-api-key-here") {
    throw new Error("Please replace the placeholder Google Maps API key with your actual API key in .env.local")
  }

  if (!mapsConfig.mapId) {
    console.warn(
      "Google Maps Map ID is not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID to your .env.local file for custom map styling.",
    )
  }

  if (mapsConfig.mapId === "your-google-maps-map-id-here") {
    console.warn("Please replace the placeholder Google Maps Map ID with your actual Map ID in .env.local")
  }

  return true
}

export function getMapsUrl() {
  const params = new URLSearchParams({
    key: mapsConfig.apiKey || "",
    libraries: mapsConfig.libraries.join(","),
    region: mapsConfig.region,
    language: mapsConfig.language,
    loading: "async",
  })

  return `https://maps.googleapis.com/maps/api/js?${params.toString()}`
}
