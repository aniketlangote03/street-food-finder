"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { DollarSign, ImageIcon, Utensils } from "lucide-react"

interface MenuItem {
  id: string
  stall_id: string
  name: string
  description: string
  price: number
  image_url?: string
  available: boolean
}

interface EditMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  menuItem: MenuItem | null
  onSuccess: () => void
}

export function EditMenuItemDialog({ open, onOpenChange, menuItem, onSuccess }: EditMenuItemDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!menuItem) return

    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      image_url: (formData.get("image_url") as string) || null,
      available: formData.get("available") === "on",
    }

    try {
      const response = await fetch(`/api/menu-items/${menuItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update menu item")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!menuItem) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-gray-900">Edit Menu Item</DialogTitle>
          <DialogDescription className="font-body text-gray-600">Update your menu item details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-gray-700">
                <Utensils className="w-4 h-4 inline mr-2" />
                Item Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={menuItem.name}
                required
                className="glass-morphism border-orange-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="font-semibold text-gray-700">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={menuItem.price}
                required
                className="glass-morphism border-orange-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={menuItem.description}
              className="glass-morphism border-orange-200 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="font-semibold text-gray-700">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Image URL (Optional)
            </Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={menuItem.image_url || ""}
              className="glass-morphism border-orange-200"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="available" name="available" defaultChecked={menuItem.available} />
            <Label htmlFor="available" className="font-semibold text-gray-700">
              Available for order
            </Label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass-morphism border-gray-300"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
