// This file is likely deprecated or a duplicate of components/public/stall-card.tsx
// Keeping it for completeness based on previous context, but consider consolidating.
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star } from "lucide-react"
import type { Stall } from "@/types"

interface StallCardProps {
  stall: Stall
}

export function StallCard({ stall }: StallCardProps) {
  return (
    <Link href={`/stall/${stall.id}`} className="block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <div className="relative w-full h-48">
          <Image
            src={stall.image_url || "/placeholder.svg?height=192&width=384&query=food+stall"}
            alt={stall.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
          <Badge
            className={`absolute top-2 right-2 ${stall.status === "open" ? "bg-green-500" : "bg-red-500"} text-white`}
          >
            {stall.status === "open" ? "Open" : "Closed"}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold truncate">{stall.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {stall.location_description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 text-sm text-muted-foreground">
          <p className="line-clamp-2">{stall.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {stall.opening_time} - {stall.closing_time}
            </span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span>
              {stall.average_rating?.toFixed(1) || "N/A"} ({stall.review_count || 0} reviews)
            </span>
          </div>
          <Badge variant="secondary" className="mt-2">
            {stall.cuisine_type}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
