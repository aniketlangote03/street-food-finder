import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const name = (formData.get("name") || "") as string;
  const description = (formData.get("description") || "") as string;
  const cuisine_type = (formData.get("cuisine_type") || "") as string;
  const opening_time = (formData.get("opening_time") || "") as string;
  const closing_time = (formData.get("closing_time") || "") as string;
  const location_description = (formData.get("location_description") || "") as string;

  if (!name.trim()) {
    return NextResponse.json({ message: "Name is required." }, { status: 400 });
  }

  // Securely read authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("stalls").insert({
    owner_id: user.id,
    name,
    description,
    cuisine_type,
    opening_time,
    closing_time,
    location_description,
    is_approved: false,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  // ✅ FIXED: Must use an absolute URL
  const redirectUrl = new URL("/owner/stalls", req.url);

  return NextResponse.redirect(redirectUrl);
}
