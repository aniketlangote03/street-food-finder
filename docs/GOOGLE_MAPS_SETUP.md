# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the Street Food Finder application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud Console:

1. **Maps JavaScript API** - For displaying maps
2. **Places API** - For location search and autocomplete
3. **Geocoding API** - For converting addresses to coordinates

To enable APIs:
1. Go to "APIs & Services" > "Library"
2. Search for each API and click "Enable"

## Step 3: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key
4. Click on the API key to configure restrictions

## Step 4: Configure API Key Restrictions

For security, restrict your API key:

### Application Restrictions
- **HTTP referrers (web sites)**: Add your domains
  - `http://localhost:3000/*` (for development)
  - `https://yourdomain.com/*` (for production)

### API Restrictions
Restrict to only the APIs you need:
- Maps JavaScript API
- Places API
- Geocoding API

## Step 5: Create a Map ID

1. Go to [Google Maps Platform](https://console.cloud.google.com/google/maps-apis/studio/maps)
2. Click "Create Map ID"
3. Choose "JavaScript" as the map type
4. Configure your map style (optional)
5. Copy the Map ID

## Step 6: Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_here
\`\`\`

## Step 7: Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/map` in your browser
3. You should see a Google Map with street food stall markers

## Troubleshooting

### Common Issues

1. **"This page can't load Google Maps correctly"**
   - Check if your API key is correct
   - Verify that Maps JavaScript API is enabled
   - Check API key restrictions

2. **Map shows but no custom styling**
   - Verify your Map ID is correct
   - Check that the Map ID is associated with your project

3. **Markers not showing**
   - Check browser console for errors
   - Verify that your database has stall data
   - Check if real-time subscriptions are working

### Rate Limits and Billing

- Google Maps API has usage limits
- Set up billing alerts in Google Cloud Console
- Monitor usage in the APIs dashboard

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all keys**
3. **Restrict API keys to specific domains**
4. **Regularly rotate API keys**
5. **Monitor API usage for unusual activity**

## Production Deployment

When deploying to production:

1. Update API key restrictions with your production domain
2. Set environment variables in your hosting platform
3. Test all map functionality in production
4. Monitor API usage and costs

## Support

If you encounter issues:
1. Check the [Google Maps Platform documentation](https://developers.google.com/maps/documentation)
2. Review the browser console for error messages
3. Check the Google Cloud Console for API usage and errors
