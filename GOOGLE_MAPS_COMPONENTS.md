# Google Maps Components and Functionalities in Street Food Finder

## Overview

This document details the Google Maps integration in the Street Food Finder application. It covers all components used for map functionality, how we display and manage restaurants, stalls, cafes, and other related features, and the implementation details of various map-based functions.

## Key Components

### 1. `lib/google-loader.ts`
- **Purpose**: Handles the dynamic loading of the Google Maps JavaScript API.
- **Functionality**:
  - Loads the Google Maps API script asynchronously with the provided API key.
  - Supports loading additional libraries (e.g., "places").
  - Prevents multiple loads by caching the promise.
  - Checks for window availability (client-side only).
- **Usage**: Called in map components to ensure the API is loaded before initializing maps.
- **Implementation**:
  - Uses a global flag `loaded` and `loadPromise` to manage loading state.
  - Appends a script tag to the document head with the API key and libraries.
  - Resolves the promise on successful load or rejects on error.

### 2. `components/owner/owner-map.tsx`
- **Purpose**: The main map component for stall owners, displaying interactive maps with stalls, user location, and directions.
- **Key Features**:
  - Initializes a Google Map centered on the user's location.
  - Displays markers for nearby stalls (restaurants, cafes, food stalls).
  - Shows user location with a marker and accuracy circle.
  - Provides directions from user to selected stall.
  - Includes an overlay panel listing nearby stalls.
- **Props**:
  - `initialZoom`: Default zoom level (default: 15).
  - `nearbyRadiusKm`: Radius for fetching nearby stalls (default: 3 km).
- **State Management**:
  - `loading`: Boolean for map initialization status.
  - `stalls`: Array of stall objects fetched from API.
  - `error`: String for error messages.
  - `selectedStall`: Currently selected stall for routing.

## Displaying Restaurants, Stalls, and Cafes

### Data Fetching
- **API Endpoint**: `/api/stalls/nearby`
  - Parameters: `lat`, `lng`, `radiusKm`
  - Returns: Array of stall objects with `id`, `name`, `description`, `latitude`, `longitude`.
- **Trigger**: Fetched when user location changes (via geolocation watch).
- **Note**: In this application, "stalls" encompass various food vendors including restaurants, cafes, street food stalls, etc. The term "stall" is used generically for all food establishments.

### Marker Placement
- **Process**:
  1. For each stall in the fetched data, create a `google.maps.Marker`.
  2. Position the marker at the stall's latitude and longitude.
  3. Set the marker title to the stall name.
  4. Add a click listener to:
     - Set the selected stall.
     - Pan the map to the marker position.
     - Compute and render directions.
     - Open an InfoWindow with stall details and a link to view the stall.
- **Customization**: Markers use default Google Maps icons. Custom icons can be added by setting the `icon` property (e.g., for different types of establishments).

### Info Windows
- **Content**: Displays stall name, description, and a "View" link to the stall's detail page.
- **Styling**: Basic HTML with inline styles for layout.
- **Security**: HTML content is escaped to prevent XSS.

### Overlay Panel
- **Location**: Positioned at bottom-right of the map.
- **Content**: Lists all nearby stalls with name, description, and a "Go" button.
- **Functionality**: Clicking "Go" pans the map to the stall and computes directions.

## Other Map Functions

### User Location Tracking
- **Geolocation API**: Uses `navigator.geolocation.watchPosition()` to track user location in real-time.
- **Options**:
  - `enableHighAccuracy`: true
  - `maximumAge`: 5000ms
  - `timeout`: 10000ms
- **Visualization**:
  - Blue marker for user position.
  - Accuracy circle based on geolocation accuracy.
- **Error Handling**: Displays error message if geolocation fails or is unavailable.

### Directions and Routing
- **Services Used**:
  - `google.maps.DirectionsService`: Computes routes.
  - `google.maps.DirectionsRenderer`: Displays routes on the map.
- **Configuration**:
  - Travel mode: Walking (can be changed to driving if needed).
  - Suppresses default markers to avoid overlap.
  - Preserves viewport when rendering.
- **Trigger**: Computed when a stall is selected or when user moves significantly.

### Map Initialization
- **Center**: Initially set to (0,0), then updated to user location.
- **Controls**: Disables map type and street view controls for cleaner UI.
- **Zoom**: Set to initialZoom prop value.

### Cleanup
- **Geolocation Watcher**: Cleared on component unmount.
- **Markers and Directions**: Removed when component unmounts or when new data is fetched.

## Integration with Other Parts of the App

- **Authentication**: Map is used in owner-specific pages, protected by middleware.
- **Data Flow**: Stalls data comes from Supabase via API routes.
- **Real-time Updates**: While not directly implemented in the map component, the app supports real-time stall updates via Supabase Realtime (see `lib/realtime.ts`).
- **Responsive Design**: Map height adjusts for mobile (`h-[72vh]` on mobile, `h-[80vh]` on desktop).

## Environment Variables
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Required for loading the Google Maps API. Must be set in environment variables.

## Potential Enhancements
- Add custom marker icons for different stall types (restaurant, cafe, etc.).
- Implement clustering for dense areas.
- Add search functionality using Google Places API.
- Support for multiple travel modes (driving, transit).
- Integrate with Google Street View for immersive previews.

## Usage Examples
- **In Owner Dashboard**: Used to visualize and manage stall locations.
- **In Stall Creation/Editing**: Could be extended to allow location selection on the map.
- **Public Stall Browsing**: Similar map component could be used for customers to find nearby food options.

This implementation provides a robust, interactive map experience for managing and discovering street food establishments in the Street Food Finder application.
