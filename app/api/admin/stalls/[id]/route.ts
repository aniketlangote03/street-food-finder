import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const profile = await getProfile().catch(() => null)

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as { is_approved?: boolean; name?: string }

  const { error } = await supabase
    .from("stalls")
    .update({ ...body })
    .eq("id", params.id)

  if (error) {
    console.error("admin/stalls PATCH error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
