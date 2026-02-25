import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

// GET /api/owner/stalls/:id
// Returns the stall (owned by the current user) plus its menu_items
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // Ensure caller is an authenticated stall owner
  const profile = await getProfile().catch(() => null)
  if (!profile || profile.role !== "stall_owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient()

  // Fetch stall with its menu_items, but only if owned by this user
  const { data: stall, error } = await supabase
    .from("stalls")
    .select(
      `
      *,
      menu_items (*)
    `,
    )
    .eq("id", id)
    .eq("owner_id", profile.id)
    .single()

  if (error) {
    console.error("Error fetching owner stall for menu:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!stall) {
    return NextResponse.json({ error: "Stall not found or you do not own this stall" }, { status: 404 })
  }

  return NextResponse.json(stall)
}
