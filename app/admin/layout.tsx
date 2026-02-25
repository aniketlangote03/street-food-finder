import type React from "react"
import { AdminNav } from "@/components/admin/admin-nav"
import { getProfile } from "@/lib/auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // We no longer redirect here; middleware handles protection for admin routes.
  // We can still fetch profile to conditionally render nav on protected pages.
  const profile = await getProfile().catch(() => null)

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {profile?.role === "admin" ? (
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pl-8 pr-6 lg:py-8">
            <AdminNav />
          </div>
        </aside>
      ) : null}
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
    </div>
  )
}
