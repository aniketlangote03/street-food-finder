"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: "home",
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: "user",
    },
    {
      title: "Stall Approvals",
      href: "/admin/stalls",
      icon: "utensilsCrossed",
    },
    {
      title: "Submissions",
      href: "/admin/submissions",
      icon: "post",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: "settings",
    },
    {
      title: "Logout",
      href: "/logout",
      icon: "logOut",
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const Icon = Icons[item.icon as keyof typeof Icons] || Icons["home"]
        return (
          item.href && (
            <Link key={index} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  (item as any).disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
