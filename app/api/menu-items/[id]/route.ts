import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()

  const { data: menuItem, error } = await supabase.from("menu_items").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching menu item:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!menuItem) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
  }

  return NextResponse.json(menuItem)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json()

  // First, verify that the user owns the stall associated with this menu item
  const { data: menuItem, error: fetchError } = await supabase
    .from("menu_items")
    .select("stall_id")
    .eq("id", id)
    .single()

  if (fetchError || !menuItem) {
    console.error("Error fetching menu item for update:", fetchError)
    return NextResponse.json({ error: "Menu item not found or access denied" }, { status: 404 })
  }

  const { data: stall, error: stallError } = await supabase
    .from("stalls")
    .select("owner_id")
    .eq("id", menuItem.stall_id)
    .single()

  if (stallError || !stall || stall.owner_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized: You do not own this menu item's stall." }, { status: 403 })
  }

  const { data, error } = await supabase.from("menu_items").update(payload).eq("id", id).select().single()

  if (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // First, verify that the user owns the stall associated with this menu item
  const { data: menuItem, error: fetchError } = await supabase
    .from("menu_items")
    .select("stall_id")
    .eq("id", id)
    .single()

  if (fetchError || !menuItem) {
    console.error("Error fetching menu item for delete:", fetchError)
    return NextResponse.json({ error: "Menu item not found or access denied" }, { status: 404 })
  }

  const { data: stall, error: stallError } = await supabase
    .from("stalls")
    .select("owner_id")
    .eq("id", menuItem.stall_id)
    .single()

  if (stallError || !stall || stall.owner_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized: You do not own this menu item's stall." }, { status: 403 })
  }

  const { error } = await supabase.from("menu_items").delete().eq("id", id)

  if (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Menu item deleted successfully" }, { status: 200 })
}
