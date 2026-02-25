# Supabase Setup Guide

This guide will help you set up Supabase for the Street Food Finder application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Street Food Finder
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
4. Click "Create new project" and wait for it to be ready

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Google Maps Configuration (optional for now)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## Step 4: Set Up the Database

Run the SQL scripts in your Supabase SQL Editor in this order:

1. **00-create-enums.sql** - Creates custom types
2. **01-create-database-schema.sql** - Creates tables
3. **02-create-functions.sql** - Creates database functions
4. **03-row-level-security.sql** - Sets up security policies
5. **04-insert-sample-data.sql** - Adds sample data
6. **05-create-storage-buckets.sql** - Sets up file storage
7. **06-realtime-features.sql** - Enables real-time features

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs for production later

## Step 6: Test the Connection

1. Restart your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should see the homepage with street food stalls

## Troubleshooting

### Common Issues:

1. **"Your project's URL and Key are required"**
   - Check that your `.env.local` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **"Failed to fetch stalls"**
   - Make sure you've run all the database setup scripts
   - Check the Supabase logs in your dashboard

3. **Authentication not working**
   - Verify your site URL is configured correctly
   - Check that RLS policies are set up properly

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Review the application logs in your browser's developer tools
