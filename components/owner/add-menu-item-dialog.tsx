"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/shared/image-upload"
import { uploadImage } from "@/lib/storage"
import { DollarSign, Utensils } from "lucide-react"

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stallId: string
  onSuccess: () => void
}

export function AddMenuItemDialog({ open, onOpenChange, stallId, onSuccess }: AddMenuItemDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const url = await uploadImage(file, "stall_images", "menu_items")
      setImageUrl(url)
      return url
    } catch (error) {
      console.error("Image upload failed:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      stall_id: stallId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      image_url: imageUrl,
      available: formData.get("available") === "on",
    }

    try {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        onSuccess()
        setImageUrl(null) // Reset image state
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create menu item")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-gray-900">Add Menu Item</DialogTitle>
          <DialogDescription className="font-body text-gray-600">Add a new item to your stall's menu</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold text-gray-700">
                  <Utensils className="w-4 h-4 inline mr-2" />
                  Item Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Spicy Chicken Tacos"
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
                  placeholder="9.99"
                  required
                  className="glass-morphism border-orange-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your menu item..."
                  className="glass-morphism border-orange-200 min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="available" name="available" defaultChecked />
                <Label htmlFor="available" className="font-semibold text-gray-700">
                  Available for order
                </Label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <ImageUpload
                onUpload={handleImageUpload}
                currentImageUrl={imageUrl}
                label="Menu Item Image"
                disabled={loading}
              />
            </div>
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
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
