"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, IndianRupee } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: string
  stall_id: string
  name: string
  description: string
  price: number
  image_url?: string
  available: boolean
  created_at: string
}

interface MenuItemCardProps {
  item: MenuItem
  onUpdate: () => void
}

export function MenuItemCard({ item, onUpdate }: MenuItemCardProps) {
  const [updating, setUpdating] = useState(false)

  const toggleAvailability = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/menu-items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Failed to update menu item:", error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteItem = async () => {
    if (!confirm("Are you sure you want to delete this menu item? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/menu-items/${item.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Failed to delete menu item:", error)
    }
  }

  return (
    <Card className="glass-morphism border-orange-200/30 hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
          <Image
            src={item.image_url || "/placeholder.svg?height=150&width=300&query=food dish"}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <Badge
              className={
                item.available
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {item.available ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morphism border-orange-200">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteItem} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-heading font-semibold text-lg text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-500" />
            <span className="text-lg font-bold text-green-600">Rs {item.price.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-orange-200/30">
            <span className="text-sm font-medium text-gray-700">{item.available ? "Available" : "Unavailable"}</span>
            <Switch
              checked={item.available}
              onCheckedChange={toggleAvailability}
              disabled={updating}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
