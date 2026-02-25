import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // TEMP DISABLE VIA ENV
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH_MIDDLEWARE === "true") {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // INIT SUPABASE CLIENT
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) =>
          response.cookies.set({ name, value, ...options }),
        remove: (name: string, options: any) =>
          response.cookies.set({ name, value: "", ...options }),
      } as any,
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isOwnerRoute = pathname.startsWith("/owner");
  const isOwnerLogin = pathname === "/owner/login";
  const isOwnerSignup = pathname === "/owner/signup";

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  // 1. GUEST ACCESS — allow login/signup
  if (!user) {
    if (isOwnerLogin || isOwnerSignup || isAdminLogin) {
      return response; // Allow
    }

    if (isOwnerRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/owner/login";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // 2. VERIFIED USER ROLE CHECK
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    // OWNER ACCESS
    if (isOwnerRoute && profile?.role !== "stall_owner") {
      const url = request.nextUrl.clone();
      url.pathname = "/owner/login";
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }

    // ADMIN ACCESS
    if (isAdminRoute && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }

    // If already logged in and visiting login page → redirect to dashboard
    if (isOwnerLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/owner/dashboard";
      return NextResponse.redirect(url);
    }

    if (isAdminLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/owner/:path*", "/admin/:path*"],
};
