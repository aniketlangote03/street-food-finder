import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Simple bounding-box filter for nearby stalls
export async function GET(request: Request) {
	try {
		const url = new URL(request.url)
		const lat = parseFloat(url.searchParams.get("lat") || "")
		const lng = parseFloat(url.searchParams.get("lng") || "")
		const radiusKm = Math.min(parseFloat(url.searchParams.get("radiusKm") || "3"), 25)

		if (!isFinite(lat) || !isFinite(lng)) {
			return NextResponse.json({ error: "lat and lng are required" }, { status: 400 })
		}

		// Approximate degrees per km
		const degPerKmLat = 1 / 110.574
		const degPerKmLng = 1 / (111.320 * Math.cos((lat * Math.PI) / 180))
		const dLat = radiusKm * degPerKmLat
		const dLng = radiusKm * degPerKmLng

		let supabase: any
		try {
			supabase = createClient()
		} catch (e) {
			// Supabase not configured: return empty list to keep public map working
			return NextResponse.json([])
		}

		const { data, error } = await supabase
			.from("stalls")
			.select("*")
			.gte("latitude", lat - dLat)
			.lte("latitude", lat + dLat)
			.gte("longitude", lng - dLng)
			.lte("longitude", lng + dLng)
			.order("created_at", { ascending: false })
			.limit(100)

		if (error) {
			// Do not fail public map; return empty when DB not ready
			console.error("/api/stalls/nearby error:", error.message)
			return NextResponse.json([])
		}

		return NextResponse.json(data)
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
	}
}

