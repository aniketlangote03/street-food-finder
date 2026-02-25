import { Suspense } from "react"
import { SearchFilterBar } from "@/components/public/search-filter-bar"
import { CombinedStallGrid } from "@/components/combined-stall-grid"
import { getStalls } from "@/lib/data"

export default async function StallsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Browse All Stalls</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing street food stalls in your area with real-time updates and reviews.
        </p>
      </div>

      <SearchFilterBar />

      <Suspense fallback={<div className="text-center py-8">Loading stalls...</div>}>
        <AllStalls />
      </Suspense>
    </div>
  )
}

async function AllStalls() {
  const stalls = await getStalls()
  return (
    <CombinedStallGrid 
      manualStalls={stalls}
      showGooglePlaces={true}
      searchRadius={2000}
    />
  )
}
