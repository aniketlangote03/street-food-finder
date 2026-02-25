import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getProfile() {
  const supabase = createClient()
  const user = await getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("id, email, display_name, role")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return profile
}

export async function requireAuth(redirectTo = "/login") {
  const user = await getUser()
  if (!user) {
    redirect(redirectTo)
  }
  return user
}

export async function requireRole(role: "admin" | "stall_owner" | "user", redirectTo = "/login") {
  const user = await requireAuth(redirectTo)
  const profile = await getProfile()

  if (!profile || profile.role !== role) {
    redirect(redirectTo)
  }
  return user
}
