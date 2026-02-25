import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function GET(request: Request) {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: stalls, error } = await supabase.from("stalls").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all stalls for admin:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(stalls)
}
