import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()

  const { data: stall, error } = await supabase
    .from("stalls")
    .select(
      `
      *,
      menu_items (*),
      reviews (
        *,
        users (display_name)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching stall:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!stall) {
    return NextResponse.json({ error: "Stall not found or not approved" }, { status: 404 })
  }

  // Map reviews to include user_display_name directly
  const reviewsWithDisplayName = stall.reviews.map((review: any) => ({
    ...review,
    user_display_name: review.users?.display_name || null,
  }))

  return NextResponse.json({ ...stall, reviews: reviewsWithDisplayName })
}
