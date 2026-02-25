import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data: stalls, error } = await supabase
    .from("stalls")
    .select("*")
    .eq("is_approved", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching stalls:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(stalls);
}
