import { GoogleMaps } from "@/components/shared/google-maps"
import { getStalls } from "@/lib/data"
import { ClientMapWithList } from "@/components/client-map-with-list"

export const dynamic = "force-dynamic"

export default async function MapPage() {
  // Avoid passing event handlers from a Server Component to a Client Component.
  // Also guard against missing server env by falling back to empty list.
  const stalls = await getStalls().catch(() => [])

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-blue-50/50 to-indigo-50/50"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-heading font-bold tracking-tight text-gray-900 mb-2">
            Interactive Street Food Map
          </h1>
          <p className="text-lg font-body text-gray-600">
            Explore street food stalls near you
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Find Street Food Stalls Near You</h2>
            <ClientMapWithList initialStalls={stalls} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-green-600">Open Now</h3>
              <p className="text-2xl font-bold">{stalls.filter((s) => s.status === "open").length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-yellow-600">Maintenance</h3>
              <p className="text-2xl font-bold">{stalls.filter((s) => s.status === "maintenance").length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="font-semibold text-red-600">Closed</h3>
              <p className="text-2xl font-bold">{stalls.filter((s) => s.status === "closed").length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
