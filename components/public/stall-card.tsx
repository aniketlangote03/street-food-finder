import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star, Users } from "lucide-react"
import { HoverLift3D, PulseGlow3D } from "@/components/3d/micro-interactions"
import { FavoritesButton } from "@/components/ui/favorites-button"
import type { Stall } from "@/types"

interface StallCardProps {
  stall: Stall
}

export function StallCard({ stall }: StallCardProps) {
  const queueMinutes = Math.max(0, Math.floor((stall.current_queue_length || 0) * 1.5))
  const queueStatus = queueMinutes <= 10 ? "short" : queueMinutes <= 20 ? "medium" : "long"
  const queueColor =
    queueStatus === "short" ? "bg-green-500" : queueStatus === "medium" ? "bg-yellow-500" : "bg-red-500"

  return (
    <HoverLift3D intensity={0.8}>
      <Card className="overflow-hidden glass-morphism border-cyan-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 group backdrop-blur-md bg-white/80">
        <div className="relative">
          <Image
            src={stall.image_url || "/placeholder.svg?height=200&width=300&query=delicious street food stall"}
            alt={stall.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />

          <div className="absolute top-3 left-3 z-10">
            <FavoritesButton stallId={stall.id} className="glass-morphism bg-white/90 backdrop-blur-sm shadow-lg" />
          </div>

          <div className="absolute top-3 right-3">
            <PulseGlow3D>
              <div
                className={`${queueColor} text-white px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg backdrop-blur-sm`}
              >
                <Clock className="w-3 h-3" />
                {queueMinutes}min
              </div>
            </PulseGlow3D>
          </div>

          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="glass-morphism bg-white/90 text-cyan-700 border-cyan-200/50 shadow-lg"
            >
              {stall.cuisine_type}
            </Badge>
          </div>

          <div className="absolute bottom-3 right-3">
            <div className="glass-morphism bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700">{stall.average_rating?.toFixed(1) || "0.0"}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-heading font-bold text-xl text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
              {stall.name}
            </h3>
            <div className="flex items-center gap-1 text-sm glass-morphism px-2 py-1 rounded-full bg-cyan-50/50">
              <span className="font-medium text-cyan-700">({stall.review_count || 0})</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-body leading-relaxed" title={stall.description || undefined}>
            {stall.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-500" aria-hidden="true" />
              <span className="truncate font-body" title={stall.address}>
                {stall.address}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm glass-morphism px-3 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50">
              <Users className="w-4 h-4 text-cyan-500" aria-hidden="true" />
              <span className="font-medium text-cyan-700">Queue: {queueMinutes} min</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="glass-morphism border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 text-cyan-700 hover:text-cyan-800 transition-all duration-300 shadow-lg hover:shadow-xl bg-transparent"
            >
              <Link href={`/stall/${stall.id}`} aria-label={`View details for ${stall.name}`}>
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </HoverLift3D>
  )
}
