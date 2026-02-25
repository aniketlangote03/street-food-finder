"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createStall } from "@/lib/actions/stalls"
import { LocationPicker } from "@/components/shared/location-picker"
import { ImageUpload } from "@/components/shared/image-upload"
import { uploadImage } from "@/lib/storage"
import { Clock, Utensils } from "lucide-react"

interface AddStallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddStallDialog({ open, onOpenChange, onSuccess }: AddStallDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const url = await uploadImage(file, "stall_images", "stalls")
      setImageUrl(url)
      return url
    } catch (error) {
      console.error("Image upload failed:", error)
      return null
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")

    if (!selectedLocation) {
      setError("Please select a location on the map")
      setLoading(false)
      return
    }

    // Add location data to form
    formData.set("latitude", selectedLocation.lat.toString())
    formData.set("longitude", selectedLocation.lng.toString())
    formData.set("location_description", selectedLocation.address)

    if (imageUrl) {
      formData.set("image_url", imageUrl)
    }

    try {
      const result = await createStall(formData)
      if (result.success) {
        onSuccess()
        onOpenChange(false)
        // Reset form state
        setSelectedLocation(null)
        setImageUrl(null)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-gray-900">Add New Stall</DialogTitle>
          <DialogDescription className="font-body text-gray-600">
            Create a new food stall. It will need admin approval before going live.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold text-gray-700">
                  <Utensils className="w-4 h-4 inline mr-2" />
                  Stall Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Tony's Tacos"
                  required
                  className="glass-morphism border-orange-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine_type" className="font-semibold text-gray-700">
                  Cuisine Type
                </Label>
                <Select name="cuisine_type" required>
                  <SelectTrigger className="glass-morphism border-orange-200">
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mexican">Mexican</SelectItem>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="Thai">Thai</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your food stall and what makes it special..."
                  className="glass-morphism border-orange-200 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening_time" className="font-semibold text-gray-700">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Opening Time
                  </Label>
                  <Input
                    id="opening_time"
                    name="opening_time"
                    type="time"
                    required
                    className="glass-morphism border-orange-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closing_time" className="font-semibold text-gray-700">
                    Closing Time
                  </Label>
                  <Input
                    id="closing_time"
                    name="closing_time"
                    type="time"
                    required
                    className="glass-morphism border-orange-200"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <ImageUpload
                onUpload={handleImageUpload}
                currentImageUrl={imageUrl}
                label="Stall Image"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location Picker */}
          <LocationPicker onLocationSelect={setSelectedLocation} className="w-full h-[300px]" />

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
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
              disabled={loading || !selectedLocation}
            >
              {loading ? "Creating..." : "Create Stall"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
