import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function GET(request: Request) {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { count: totalStalls, error: stallsError } = await supabase
    .from("stalls")
    .select("*", { count: "exact", head: true })

  const { count: pendingSubmissions, error: submissionsError } = await supabase
    .from("stalls")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", false)

  const { count: totalUsers, error: usersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  if (stallsError || submissionsError || usersError) {
    console.error("Error fetching admin dashboard stats:", stallsError || submissionsError || usersError)
    return NextResponse.json(
      {
        error:
          stallsError?.message || submissionsError?.message || usersError?.message || "Failed to fetch dashboard stats",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    totalStalls,
    pendingSubmissions,
    totalUsers,
  })
}
