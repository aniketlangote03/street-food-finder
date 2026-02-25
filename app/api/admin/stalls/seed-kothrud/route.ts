import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth"

// Admin-only seed endpoint to insert a few stalls in Kothrud, Pune
// Invoke with: POST /api/admin/stalls/seed-kothrud
export async function POST() {
  const supabase = createClient()
  const profile = await getProfile()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Coordinates around Kothrud, Pune
  // These are approximate for demo/seed purposes
  const seedStalls = [
    {
      name: "Kothrud Vada Pav Corner",
      description: "Crispy vada pav and hot chai. Popular evening spot.",
      cuisine_type: "Indian",
      latitude: 18.5079,
      longitude: 73.8073,
      location_description: "Karve Road, Near Kothrud Bus Depot, Kothrud, Pune",
      opening_time: "10:00",
      closing_time: "22:00",
      image_url: null as string | null,
    },
    {
      name: "Joshi Misal & Snacks",
      description: "Spicy misal pav with farsan and matki usal.",
      cuisine_type: "Indian",
      latitude: 18.5038,
      longitude: 73.8095,
      location_description: "Paud Road, Opp. Vanaz, Kothrud, Pune",
      opening_time: "08:00",
      closing_time: "21:00",
      image_url: null as string | null,
    },
    {
      name: "Annapurna South Indian",
      description: "Idli, dosa, filter coffee. Quick bite for students.",
      cuisine_type: "South Indian",
      latitude: 18.5065,
      longitude: 73.8142,
      location_description: "DP Road, Near Karishma Society, Kothrud, Pune",
      opening_time: "07:30",
      closing_time: "22:00",
      image_url: null as string | null,
    },
    {
      name: "Spice Route Chinese Cart",
      description: "Hakka noodles, manchurian, momos.",
      cuisine_type: "Chinese",
      latitude: 18.5121,
      longitude: 73.8049,
      location_description: "Rambaug Colony Road, Kothrud, Pune",
      opening_time: "17:00",
      closing_time: "23:00",
      image_url: null as string | null,
    },
    {
      name: "Bombay Sandwich & Grill",
      description: "Toasty sandwiches, cheese grillers, and juices.",
      cuisine_type: "Fast Food",
      latitude: 18.5009,
      longitude: 73.8158,
      location_description: "Mahaganesh Colony, Kothrud, Pune",
      opening_time: "11:00",
      closing_time: "22:30",
      image_url: null as string | null,
    },
  ]

  // Prepare rows with required fields; assign current admin as owner for seed data
  const rows = seedStalls.map((s) => ({
    owner_id: profile.id,
    name: s.name,
    description: s.description,
    cuisine_type: s.cuisine_type,
    latitude: s.latitude,
    longitude: s.longitude,
    location_description: s.location_description,
    opening_time: s.opening_time,
    closing_time: s.closing_time,
    image_url: s.image_url,
    is_approved: true,
    status: "open" as const,
    average_rating: null as number | null,
    review_count: null as number | null,
    current_queue_length: 0 as number | null,
  }))

  // Idempotency: check existing by name and skip duplicates
  const names = seedStalls.map((s) => s.name)
  const { data: existing, error: fetchErr } = await supabase
    .from("stalls")
    .select("id, name")
    .in("name", names)

  if (fetchErr) {
    console.error("Error querying existing Kothrud stalls:", fetchErr)
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  const existingNames = new Set((existing || []).map((e) => e.name))
  const toInsert = rows.filter((r) => !existingNames.has(r.name))

  if (toInsert.length === 0) {
    return NextResponse.json({ inserted: [], skipped: names }, { status: 200 })
  }

  const { data, error } = await supabase.from("stalls").insert(toInsert).select("id, name")

  if (error) {
    console.error("Error seeding Kothrud stalls:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const skipped = names.filter((n) => existingNames.has(n))
  return NextResponse.json({ inserted: data, skipped }, { status: 201 })
}
