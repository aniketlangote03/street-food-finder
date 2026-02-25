import { createClient } from "@/lib/supabase/server"
import type { Stall } from "@/types"

export async function getStalls(filters?: {
  search?: string
  cuisine?: string
  location?: string
}): Promise<Stall[]> {
  try {
    const supabase = createClient()

    let query = supabase.from("stalls").select(`*`)

    // Only show approved stalls (RLS policy should handle this, but being explicit)
    query = query.eq("is_approved", true)

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.cuisine && filters.cuisine !== "all") {
      query = query.ilike("cuisine_type", `%${filters.cuisine}%`)
    }

    if (filters?.location && filters.location !== "all") {
      query = query.ilike("location_description", `%${filters.location}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error.message)
      return []
    }

    return (data as Stall[]) || []
  } catch (error) {
    console.error("Error in getStalls:", error)
    return []
  }
}

export async function getPopularStalls(): Promise<Stall[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("stalls")
      .select(`*`)
      .eq("is_approved", true)
      .order("average_rating", { ascending: false })
      .limit(6)

    if (error) {
      console.error("Database error:", error.message)
      return []
    }

    return (data as Stall[]) || []
  } catch (error) {
    console.error("Error fetching popular stalls:", error)
    return []
  }
}

export async function getStallById(id: string): Promise<Stall | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("stalls")
      .select(`*`)
      .eq("id", id)
      .eq("is_approved", true)
      .limit(1)

    if (error) {
      console.error("Database error:", error.message)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    return data[0] as Stall
  } catch (error) {
    console.error("Error fetching stall:", error)
    return null
  }
}
