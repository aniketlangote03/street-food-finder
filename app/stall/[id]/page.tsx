import { getStallById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MapPin, Clock, Utensils, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Stall } from "@/types"
import SimpleMap from "@/components/shared/simple-map"
import { StallActions } from "@/components/public/stall-actions"

interface StallDetailPageProps {
  params: {
    id: string
  }
}

export default async function StallDetailPage({ params }: StallDetailPageProps) {
  const stall = (await getStallById(params.id).catch(() => null)) as Stall | null
  if (!stall) notFound()

  const lat = Number((stall as any).latitude ?? (stall as any).location_lat)
  const lng = Number((stall as any).longitude ?? (stall as any).location_lng)
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)

  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        (stall as any).location_description || (stall as any).address || stall.name,
      )}`

  const phone = (stall as any).phone || (stall as any).contact_phone || null

  return (
    <div className="min-h-screen">
      {/* Hero Section with Stall Showcase */}
      <section className="relative min-h-screen bg-gradient-to-br from-cyan-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="glass-morphism">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stalls
              </Link>
            </Button>
          </div>

          {/* Stall Showcase Placeholder */}
          <div className="h-48 mb-8 rounded-lg bg-gradient-to-r from-cyan-100 to-blue-100 flex items-center justify-center text-gray-700">
            Stall spotlight coming soon
          </div>

          {/* Stall Information Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <Card className="glass-morphism border-cyan-200/30 h-full">
                <CardHeader>
                  <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={stall.image_url || "/placeholder.svg?height=400&width=600&query=food+stall"}
                      alt={stall.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <CardTitle className="text-3xl font-heading font-bold text-white mb-2">{stall.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className={`${((stall as any).status === "open" ? "bg-green-500" : "bg-red-500")} text-white`}
                        >
                          {(((stall as any).status ?? "closed") === "open" ? "Open" : "Closed")}
                        </Badge>
                        <Badge variant="secondary" className="bg-cyan-500 text-white">
                          {stall.cuisine_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-body text-gray-700 mb-4">{stall.description}</CardDescription>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-500" />
                      <span className="font-body">
                        {stall.opening_time} - {stall.closing_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-cyan-500" />
                      <span className="font-body">{stall.cuisine_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-body">
                        {stall.average_rating?.toFixed(1) || "N/A"} ({stall.review_count || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-cyan-500" />
                      <span className="font-body">{(stall as any).location_description || ""}</span>
                    </div>
                  </div>

                  <StallActions stallName={stall.name} phone={phone} directionsUrl={directionsUrl} />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="glass-morphism border-cyan-200/30 h-full">
                <CardHeader>
                  <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-cyan-500" />
                    Location & Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasCoords ? (
                    <div className="h-80 w-full rounded-lg overflow-hidden">
                      <SimpleMap
                        center={{ lat, lng }}
                        zoom={15}
                        mapId={undefined}
                        stalls={[
                          {
                            id: stall.id,
                            name: stall.name,
                            description: stall.description || "",
                            cuisine_tags: stall.cuisine_type ? [stall.cuisine_type] : [],
                            location_lat: lat,
                            location_lng: lng,
                            address: (stall as any).location_description || (stall as any).address || "",
                            is_open: ((stall as any).status ?? "closed") === "open",
                            image_url: stall.image_url || undefined,
                          },
                        ]}
                        useLiveLocation={false}
                        showLocateButton={false}
                        height="100%"
                      />
                    </div>
                  ) : (
                    <div className="h-80 w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-4" />
                        <p>Location not available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Menu Section */}
      {stall.menu_items && stall.menu_items.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50/80 to-cyan-50/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Our Menu</h2>
              <p className="font-body text-gray-600">Explore our delicious offerings</p>
            </div>

            {/* Traditional Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stall.menu_items.map((menuItem, index) => (
                <div key={menuItem.id}>
                  <Card className="glass-morphism border-cyan-200/30 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h4 className="font-heading font-semibold text-lg text-gray-900 mb-2">{menuItem.name}</h4>
                      <p className="font-body text-gray-600 text-sm mb-3">{menuItem.description || ""}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-2xl text-cyan-600">
                          Rs {Number(menuItem.price).toFixed(2)}
                        </span>
                        <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                          Add to Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

        {/* Reviews Section */}
        {stall.reviews && stall.reviews.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Customer Reviews</h2>
                <p className="font-body text-gray-600">What our customers are saying</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stall.reviews.map((review, index) => (
                  <div key={review.id}>
                    <Card className="glass-morphism border-cyan-200/30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-heading font-semibold text-gray-900">
                            {review.user_display_name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="font-body text-gray-600 text-sm mb-3">{review.comment}</p>
                        <p className="font-body text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
    </div>
  )
}
