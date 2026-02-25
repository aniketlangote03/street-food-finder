import type React from "react"
import { DashboardNav } from "@/components/owner/dashboard-nav"
import { getProfile } from "@/lib/auth"

interface OwnerLayoutProps {
  children: React.ReactNode
}

export default async function OwnerLayout({ children }: OwnerLayoutProps) {
  // Rely on middleware to protect /owner routes. Do not redirect here to avoid wrapping /owner/login.
  const profile = await getProfile().catch(() => null)

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {profile?.role === "stall_owner" ? (
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pl-8 pr-6 lg:py-8">
            <DashboardNav />
          </div>
        </aside>
      ) : null}
      <main className="flex w-full flex-col overflow-hidden">{children}</main>
    </div>
  )
}
