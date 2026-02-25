"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getProfile } from "@/lib/auth"

const stallSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().optional(),
  location_description: z.string().min(5, "Location description is required."),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  opening_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  closing_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  cuisine_type: z.string().min(2, "Cuisine type is required."),
  image_url: z.string().url("Invalid image URL.").optional().nullable(),
})

export async function createStall(formData: FormData) {
  const profile = await getProfile()
  if (!profile || profile.role !== "stall_owner") {
    return { success: false, message: "Unauthorized: Only stall owners can create stalls." }
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    location_description: formData.get("location_description") as string,
    latitude: Number.parseFloat(formData.get("latitude") as string),
    longitude: Number.parseFloat(formData.get("longitude") as string),
    opening_time: formData.get("opening_time") as string,
    closing_time: formData.get("closing_time") as string,
    cuisine_type: formData.get("cuisine_type") as string,
    image_url: formData.get("image_url") as string,
  }

  const validation = stallSchema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0].message,
    }
  }

  const supabase = createClient()

  const { data: newStall, error } = await supabase
    .from("stalls")
    .insert({
      owner_id: profile.id,
      name: validation.data.name,
      description: validation.data.description,
      location_description: validation.data.location_description,
      latitude: validation.data.latitude,
      longitude: validation.data.longitude,
      opening_time: validation.data.opening_time,
      closing_time: validation.data.closing_time,
      cuisine_type: validation.data.cuisine_type,
      image_url: validation.data.image_url,
      is_approved: false, // New stalls require admin approval
      status: "closed", // Default to closed until approved/opened by owner
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating stall:", error)
    return { success: false, message: error.message || "Failed to create stall." }
  }

  redirect(`/owner/stalls/${newStall.id}`)
}

export async function updateStall(stallId: string, formData: FormData) {
  const profile = await getProfile()
  if (!profile || profile.role !== "stall_owner") {
    return { success: false, message: "Unauthorized: Only stall owners can update stalls." }
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    location_description: formData.get("location_description") as string,
    latitude: Number.parseFloat(formData.get("latitude") as string),
    longitude: Number.parseFloat(formData.get("longitude") as string),
    opening_time: formData.get("opening_time") as string,
    closing_time: formData.get("closing_time") as string,
    cuisine_type: formData.get("cuisine_type") as string,
    image_url: formData.get("image_url") as string,
    status: formData.get("status") as "open" | "closed" | "maintenance",
  }

  const validation = stallSchema.safeParse(data) // Re-use schema for validation

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0].message,
    }
  }

  const supabase = createClient()

  // Verify ownership before updating
  const { data: existingStall, error: fetchError } = await supabase
    .from("stalls")
    .select("owner_id")
    .eq("id", stallId)
    .single()

  if (fetchError || !existingStall || existingStall.owner_id !== profile.id) {
    return { success: false, message: "Unauthorized: You do not own this stall." }
  }

  const { data: updatedStall, error } = await supabase
    .from("stalls")
    .update({
      name: validation.data.name,
      description: validation.data.description,
      location_description: validation.data.location_description,
      latitude: validation.data.latitude,
      longitude: validation.data.longitude,
      opening_time: validation.data.opening_time,
      closing_time: validation.data.closing_time,
      cuisine_type: validation.data.cuisine_type,
      image_url: validation.data.image_url,
      status: data.status, // Status can be updated by owner
    })
    .eq("id", stallId)
    .select()
    .single()

  if (error) {
    console.error("Error updating stall:", error)
    return { success: false, message: error.message || "Failed to update stall." }
  }

  return { success: true, message: "Stall updated successfully!", stall: updatedStall }
}

export async function deleteStall(stallId: string) {
  const profile = await getProfile()
  if (!profile || profile.role !== "stall_owner") {
    return { success: false, message: "Unauthorized: Only stall owners can delete stalls." }
  }

  const supabase = createClient()

  // Verify ownership before deleting
  const { data: existingStall, error: fetchError } = await supabase
    .from("stalls")
    .select("owner_id")
    .eq("id", stallId)
    .single()

  if (fetchError || !existingStall || existingStall.owner_id !== profile.id) {
    return { success: false, message: "Unauthorized: You do not own this stall." }
  }

  const { error } = await supabase.from("stalls").delete().eq("id", stallId)

  if (error) {
    console.error("Error deleting stall:", error)
    return { success: false, message: error.message || "Failed to delete stall." }
  }

  return { success: true, message: "Stall deleted successfully!" }
}
