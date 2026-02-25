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
  // Note: The `authorize_admin_stall_action` function currently only sets `is_approved`.
  // If you need a distinct "rejected" status, you'd need to modify the DB schema
  // (e.g., add an `approval_status` column) and the function.
  // For now, setting `is_approved` to false effectively "rejects" it from public view.
  const { error } = await supabase.rpc("authorize_admin_stall_action", {
    stall_id: id,
    action: "rejected", // Pass 'rejected' to the function
  })

  if (error) {
    console.error("Error rejecting stall:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Stall rejected successfully" }, { status: 200 })
}
