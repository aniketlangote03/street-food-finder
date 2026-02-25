"use server"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

export async function signIn(formData: FormData, expectedRole?: "admin" | "owner" | "stall_owner" | "user") {
  if (!formData) return { success: false, message: "Form data is missing" }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message }
  }

  const supabase = createClient()
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("Sign-in error:", error.message)
      return { success: false, message: error.message || "An unexpected error occurred during sign-in." }
    }

    if (expectedRole) {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error("Error fetching user after sign-in:", userError?.message)
        await supabase.auth.signOut()
        return { success: false, message: "Authentication failed. Please try again." }
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      const normalizedExpected = expectedRole === "owner" ? "stall_owner" : expectedRole
      if (profileError || !profile || profile.role !== normalizedExpected) {
        console.error(`Role mismatch: Expected ${expectedRole}, got ${profile?.role || "none"}`)
        await supabase.auth.signOut()
        return { success: false, message: `Access denied. This login is for ${expectedRole}s only.` }
      }
    }

    if (expectedRole === "admin") redirect("/admin/dashboard")
    else if (expectedRole === "owner" || expectedRole === "stall_owner") redirect("/owner/dashboard")
    else redirect("/")
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error("Login error:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(formData: FormData) {
  if (!formData) return { success: false, message: "Form data is missing" }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("display_name") as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message }
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
      console.error("Sign-up error:", error.message)
      return { success: false, message: error.message || "An unexpected error occurred during sign-up." }
    }
    if (data.user) {
      const baseProfile = { id: data.user.id, email: data.user.email, display_name: name }
      let { error: insertError } = await supabase.from("users").insert({ ...baseProfile, role: "user" })
      if (insertError) {
        const retry = await supabase.from("users").insert({ ...baseProfile, role: "stall_owner" })
        if (retry.error) {
          console.error("Error inserting user into public.users:", insertError.message, "retry:", retry.error.message)
          return { success: false, message: "Account created, but failed to set up user profile. Please contact support or adjust user_role enum." }
        }
      }
    }
    return { success: true, message: "Sign-up successful. If email confirmations are enabled in Supabase, please verify your email before signing in." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

export async function signUpOwner(formData: FormData) {
  if (!formData) return { success: false, message: "Form data is missing" }

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("display_name") as string

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message }
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
      console.error("Owner Sign-up error:", error.message)
      return { success: false, message: error.message || "Failed to sign up owner." }
    }
    if (data.user) {
      const baseProfile = { id: data.user.id, email: data.user.email, display_name: name }
      const { error: insertError } = await supabase.from("users").insert({ ...baseProfile, role: "stall_owner" })
      if (insertError) {
        console.error("Error inserting stall_owner profile:", insertError.message)
        return { success: false, message: "Account created, but failed to set role. Please contact support." }
      }
    }
    return { success: true, message: "Owner account created. If email confirmations are enabled, please verify your email before signing in." }
  } catch (error) {
    console.error("Owner sign up error:", error)
    return { success: false, message: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Sign-out error:", error.message)
    return { success: false, message: error.message || "An unexpected error occurred during sign-out." }
  }
  redirect("/login")
}
