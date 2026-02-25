# Google Places API Integration Setup

This guide explains how to set up Google Places API integration to show real food stalls from Google Maps in your Street Food Finder application.

## Prerequisites

1. **Google Maps API Key** - You should already have this from the main Google Maps setup
2. **Places API Enabled** - Make sure Places API is enabled in your Google Cloud Console

## Required APIs

Make sure these APIs are enabled in your Google Cloud Console:

1. **Places API** - For searching nearby food places
2. **Maps JavaScript API** - For displaying maps
3. **Geocoding API** - For location services

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_here
```

## Features Added

### 1. **Combined Stall Display**
- Shows both manually added stalls (from your database) and Google Places
- Google Places are marked with a "Google" badge
- Local stalls are marked with a "Local" badge

### 2. **Location-Based Search**
- Automatically detects user location (with permission)
- Searches for nearby food stalls within a configurable radius (default: 2km)
- Searches for: street food, food stalls, hawkers, food trucks, food courts

### 3. **Real-Time Data**
- Google Places data includes:
  - Name, address, ratings, reviews
  - Photos from Google Places
  - Opening hours and current status
  - Price level and cuisine type
  - Contact information (phone, website)

### 4. **Smart Cuisine Detection**
- Automatically categorizes places by cuisine type
- Maps Google Place types to readable cuisine names
- Supports: Chinese, Indian, Japanese, Korean, Thai, Vietnamese, Mexican, Italian, etc.

## How It Works

1. **User visits the stalls page** (`/stalls`)
2. **Location permission is requested** (if not already granted)
3. **Nearby places are searched** using Google Places API
4. **Results are combined** with your database stalls
5. **All stalls are displayed** in a unified grid

## API Usage

The integration uses these Google Places API endpoints:

- **Nearby Search** - Find food places near user location
- **Place Details** - Get detailed information about specific places
- **Photos** - Display place photos

## Cost Considerations

- **Places API** has usage limits and costs
- **Nearby Search** costs per request
- **Place Details** costs per request
- **Photos** may have additional costs

Monitor your usage in Google Cloud Console and set up billing alerts.

## Customization

### Search Radius
```typescript
<CombinedStallGrid 
  searchRadius={2000} // 2km radius
  showGooglePlaces={true}
/>
```

### Search Keywords
Modify the search keywords in `lib/services/google-places.ts`:
```typescript
keyword: 'street food|food stall|hawker|food truck|food court'
```

### Cuisine Types
Add new cuisine mappings in the `determineCuisineType` method.

## Troubleshooting

### Common Issues

1. **"Places service not initialized"**
   - Make sure Google Maps is loaded before using Places API
   - Check that Places API is enabled in Google Cloud Console

2. **"Location permission denied"**
   - User needs to grant location permission
   - App will show manual search option

3. **"No places found"**
   - Check if you're in an area with food places
   - Try increasing the search radius
   - Verify your API key has Places API access

4. **Rate limit exceeded**
   - Google Places API has usage limits
   - Implement caching to reduce API calls
   - Consider upgrading your Google Cloud plan

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'google-places')
```

## Security

- **API Key Restrictions** - Restrict your API key to specific domains
- **Rate Limiting** - Implement client-side rate limiting
- **Caching** - Cache results to reduce API calls

## Production Deployment

1. **Update API key restrictions** with your production domain
2. **Set up monitoring** for API usage and costs
3. **Test location services** in production environment
4. **Configure error handling** for API failures

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify API key permissions in Google Cloud Console
3. Test with a simple Places API request
4. Check Google Cloud Console for usage and billing information

