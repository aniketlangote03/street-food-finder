import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const formData = await req.formData();
  const updates = Object.fromEntries(formData.entries());

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("stalls")
    .update({
      ...updates,
      owner_id: user.id
    })
    .eq("id", params.id)
    .eq("owner_id", user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.redirect("/owner/dashboard");
}
