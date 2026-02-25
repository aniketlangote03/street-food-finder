"use server"

import { createClient } from "@/lib/supabase/server"

export async function signUpOwner(formData: FormData) {
  if (!formData) return { success: false, message: "Form data is missing" }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("display_name") as string

  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  const supabase = createClient()
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        data: { name },
      },
    })
    if (error) {
      return { success: false, message: error.message || "Failed to sign up owner." }
    }
    if (data.user) {
      const baseProfile = { id: data.user.id, email: data.user.email, display_name: name }
      const { error: insertError } = await supabase.from("users").insert({ ...baseProfile, role: "stall_owner" })
      if (insertError) {
        return { success: false, message: "Account created, but failed to set role. Please contact support." }
      }
    }
    return { success: true, message: "Owner account created. If email confirmations are enabled, please verify your email before signing in." }
  } catch (e: any) {
    return { success: false, message: e?.message || "An unexpected error occurred. Please try again." }
  }
}
