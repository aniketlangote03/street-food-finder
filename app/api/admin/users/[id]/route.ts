import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const profile = await getProfile().catch(() => null)

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { role } = await request.json()
  const userId = params.id

  if (!userId || !role) {
    return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
  }

  // Update user's role in public.users. Note: Requires an RLS policy that allows admins to update roles,
  // or use a SECURITY DEFINER function. If you have SUPABASE_SERVICE_ROLE_KEY configured and want to
  // bypass RLS, switch server client to use service role.
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "User role updated" })
}
