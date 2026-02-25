import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function POST(request: Request) {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "stall_owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()
  const { stall_id } = payload

  // Verify that the current user owns the stall for which they are adding a menu item
  const { data: stall, error: stallError } = await supabase
    .from("stalls")
    .select("owner_id")
    .eq("id", stall_id)
    .single()

  if (stallError || !stall || stall.owner_id !== profile.id) {
    return NextResponse.json({ error: "Unauthorized: You do not own this stall." }, { status: 403 })
  }

  const { data, error } = await supabase.from("menu_items").insert(payload).select().single()

  if (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
