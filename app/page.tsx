import { Suspense } from "react"
import { getStalls, getPopularStalls } from "@/lib/data"
import { HeroSection3D } from "@/components/public/hero-section-3d"
import { SearchFilterBar } from "@/components/public/search-filter-bar"
import { StallGrid } from "@/components/public/stall-grid"
import { CombinedStallGrid } from "@/components/combined-stall-grid"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/ui/error-boundary"

function StallGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden glass-morphism">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function PopularStalls() {
  const stalls = await getPopularStalls()

  return (
    <section className="py-16 relative" aria-labelledby="popular-stalls-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-50/30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 id="popular-stalls-heading" className="text-4xl font-heading font-bold text-center mb-12 text-gray-900">
          Popular Food Stalls
        </h2>
        <ErrorBoundary>
          <StallGrid stalls={stalls} />
        </ErrorBoundary>
      </div>
    </section>
  )
}

async function AllStalls({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const search = searchParams.search ? (Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search) : undefined
  const cuisine = searchParams.cuisine ? (Array.isArray(searchParams.cuisine) ? searchParams.cuisine[0] : searchParams.cuisine) : undefined
  const location = searchParams.location ? (Array.isArray(searchParams.location) ? searchParams.location[0] : searchParams.location) : undefined

  const stalls = await getStalls({ search, cuisine, location })

  return (
    <section
      className="py-16 bg-gradient-to-br from-gray-50 to-cyan-50/20 relative"
      aria-labelledby="all-stalls-heading"
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2 id="all-stalls-heading" className="text-4xl font-heading font-bold text-center mb-12 text-gray-900">
          All Food Stalls
        </h2>
        <div className="mb-12">
          <ErrorBoundary>
            <SearchFilterBar />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <CombinedStallGrid
            manualStalls={stalls}
            showGooglePlaces={true}
            searchRadius={2000}
          />
        </ErrorBoundary>
      </div>
    </section>
  )
}

export default function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <ErrorBoundary>
        <HeroSection3D />
      </ErrorBoundary>

      <main id="main-content">
        <ErrorBoundary>
          <Suspense fallback={<StallGridSkeleton />}>
            <PopularStalls />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<StallGridSkeleton />}>
            <AllStalls searchParams={searchParams} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
