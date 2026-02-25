import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function POST(request: Request) {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()
  const { stall_id, rating, comment } = payload

  if (!stall_id || !rating) {
    return NextResponse.json({ error: "Stall ID and rating are required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      stall_id,
      user_id: profile.id,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
