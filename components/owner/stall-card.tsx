"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, Clock, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Stall {
  id: string
  name: string
  description: string
  cuisine_type: string
  image_url?: string
  latitude: number
  longitude: number
  location_description: string
  opening_time: string
  closing_time: string
  status: "open" | "closed" | "maintenance"
  is_approved: boolean
  created_at: string
}

interface StallCardProps {
  stall: Stall
  onUpdate: () => void
}

export function StallCard({ stall, onUpdate }: StallCardProps) {
  const [updating, setUpdating] = useState(false)

  const toggleStatus = async () => {
    setUpdating(true)
    try {
      const newStatus = stall.status === "open" ? "closed" : "open"
      const response = await fetch(`/api/owner/stalls/${stall.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Failed to update stall status:", error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteStall = async () => {
    if (!confirm("Are you sure you want to delete this stall? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/owner/stalls/${stall.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Failed to delete stall:", error)
    }
  }

  const getStatusBadge = () => {
    if (!stall.is_approved) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Approval</Badge>
    }

    const statusColors = {
      open: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-red-100 text-red-800 border-red-200",
      maintenance: "bg-orange-100 text-orange-800 border-orange-200",
    }

    return (
      <Badge className={statusColors[stall.status]}>
        {stall.status.charAt(0).toUpperCase() + stall.status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card className="glass-morphism border-orange-200/30 hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={stall.image_url || "/placeholder.svg?height=200&width=400&query=food stall"}
            alt={stall.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">{getStatusBadge()}</div>
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism border-orange-200">
                <DropdownMenuItem asChild>
                  <Link href={`/stall/${stall.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteStall} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Stall
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-heading font-semibold text-lg text-gray-900">{stall.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{stall.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {stall.cuisine_type}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="truncate">{stall.location_description}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>
                {stall.opening_time} - {stall.closing_time}
              </span>
            </div>
          </div>

          {stall.is_approved && (
            <div className="flex items-center justify-between pt-2 border-t border-orange-200/30">
              <span className="text-sm font-medium text-gray-700">
                {stall.status === "open" ? "Currently Open" : "Currently Closed"}
              </span>
              <Switch
                checked={stall.status === "open"}
                onCheckedChange={toggleStatus}
                disabled={updating}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
