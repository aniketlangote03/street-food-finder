import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function GET(request: Request) {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: users, error } = await supabase.from("users").select("id, email, display_name, role, created_at")

  if (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(users)
}

export async function PUT(request: Request) {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId, newRole } = await request.json()

  if (!userId || !newRole) {
    return NextResponse.json({ error: "User ID and new role are required" }, { status: 400 })
  }

  // Call the PostgreSQL function to change user role
  const { error } = await supabase.rpc("authorize_admin_change_user_role", {
    target_user_id: userId,
    new_role: newRole,
  })

  if (error) {
    console.error("Error changing user role:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "User role updated successfully" }, { status: 200 })
}
