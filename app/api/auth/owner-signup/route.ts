import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";  // NEW

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const display_name = formData.get("display_name") as string;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  // 1) Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  // 2) Insert user role USING SERVICE ROLE CLIENT
  await supabaseAdmin.from("users").insert({
    id: data.user?.id,
    display_name,
    role: "stall_owner",
  });

  return NextResponse.json(
    { message: "Signup successful!", user: data.user },
    { status: 200 }
  );
}
