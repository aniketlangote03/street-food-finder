# Street Food Finder

A Next.js application for discovering and managing street food stalls with real-time features.

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment template:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Fill in your Supabase credentials in `.env.local`:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project or select existing one
   - Go to Settings > API
   - Copy the Project URL and API keys

3. Add Google Maps API key (optional):
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create or select a project
   - Enable Maps JavaScript API
   - Create credentials and copy the API key

### 2. Database Setup

Run the SQL scripts in order:

\`\`\`bash
# In your Supabase SQL Editor, run these files in order:
# 1. scripts/00-create-enums.sql
# 2. scripts/01-create-database-schema.sql
# 3. scripts/02-create-functions.sql
# 4. scripts/03-row-level-security.sql
# 5. scripts/04-insert-sample-data.sql
# 6. scripts/05-create-storage-buckets.sql
# 7. scripts/06-realtime-features.sql
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Features

- 🏪 Street food stall discovery
- 🗺️ Interactive maps with Google Maps
- 👤 User authentication (customers, stall owners, admins)
- 📱 Responsive design
- ⚡ Real-time updates
- 🔍 Search and filtering
- ⭐ Reviews and ratings
- 📊 Admin dashboard
- 🏪 Stall owner management

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database setup scripts
├── types/                 # TypeScript type definitions
└── public/               # Static assets
\`\`\`

## Troubleshooting

### Database Connection Issues

If you see "Your project's URL and Key are required to create a Supabase client!", check:

1. Your `.env.local` file exists and has the correct variables
2. Your Supabase project is active
3. The API keys are correct and not expired

### Google Maps Not Loading

1. Ensure your Google Maps API key is valid
2. Check that the Maps JavaScript API is enabled
3. Verify API key restrictions if any

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
