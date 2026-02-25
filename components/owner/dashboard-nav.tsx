"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/owner/dashboard",
      icon: "home",
    },
    {
      title: "My Stalls",
      href: "/owner/stalls",
      icon: "utensilsCrossed",
    },
    {
      title: "Menu Management",
      href: "/owner/menu",
      icon: "menu",
    },
    {
      title: "Realtime Test", // Added Realtime Test link
      href: "/test/realtime",
      icon: "settings", // Using settings icon for now, can be changed
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
        const Icon = Icons[item.icon as keyof typeof Icons]
        return (
          item.href && (
            <Link key={index} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
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
