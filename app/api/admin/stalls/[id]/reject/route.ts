import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Call the PostgreSQL function to reject the stall
  const { error } = await supabase.rpc("authorize_admin_stall_action", {
    stall_id: id,
    action: "rejected",
  })

  if (error) {
    console.error("Error rejecting stall:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Stall rejected successfully" }, { status: 200 })
}
