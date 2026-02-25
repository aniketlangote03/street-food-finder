import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function GET() {
  try {
    const supabase = createClient()
    const profile = await getProfile().catch(() => null)
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch recent items from submissions, stalls, and users
    const [submissions, stalls, users] = await Promise.all([
      supabase
        .from("submissions")
        .select("id, submitted_at, status, stall_id")
        .order("submitted_at", { ascending: false })
        .limit(10),
      supabase
        .from("stalls")
        .select("id, name, created_at, approval_status")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("users")
        .select("id, email, full_name, created_at, role")
        .order("created_at", { ascending: false })
        .limit(10),
    ])

    const items: Array<{
      id: string
      type: string
      title: string
      time: string
    }> = []

    if (submissions.data) {
      for (const s of submissions.data) {
        items.push({
          id: s.id,
          type: "submission",
          title: `Submission ${s.status}: ${s.stall_id?.slice(0, 8) ?? "stall"}`,
          time: s.submitted_at,
        })
      }
    }

    if (stalls.data) {
      for (const st of stalls.data) {
        items.push({
          id: st.id,
          type: "stall",
          title: `${st.approval_status === "Approved" ? "Approved" : "New stall"}: ${st.name ?? st.id.slice(0, 8)}`,
          time: st.created_at,
        })
      }
    }

    if (users.data) {
      for (const u of users.data) {
        items.push({
          id: u.id,
          type: "user",
          title: `New user: ${u.email ?? u.full_name ?? u.id.slice(0, 8)}`,
          time: u.created_at,
        })
      }
    }

    // Sort combined items by time desc and cap to 12
    const sorted = items
      .filter((i) => !!i.time)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 12)

    return NextResponse.json({ items: sorted })
  } catch (e) {
    console.error("activity route error", e)
    return NextResponse.json({ error: "Failed to load activity" }, { status: 500 })
  }
}
