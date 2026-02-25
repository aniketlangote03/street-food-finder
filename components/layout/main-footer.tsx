"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"

export function MainFooter() {
  const handleLinkClick = (href: string, label: string) => {
    console.log(`[v0] Footer link clicked: ${label} -> ${href}`)
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold text-lg">Street Food Finder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the best street food in your city with real-time updates and reviews.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Food Lovers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/stalls"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/stalls", "Browse Stalls")}
                >
                  Browse Stalls
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/map", "Map View")}
                >
                  Map View
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/reviews", "Reviews")}
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Stall Owners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/owner/login"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/owner/login", "Owner Login")}
                >
                  Owner Login
                </Link>
              </li>
              <li>
                <Link
                  href="/owner/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/owner/dashboard", "Dashboard")}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/owner/stalls"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/owner/stalls", "Manage Stalls")}
                >
                  Manage Stalls
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/help", "Help Center")}
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/contact", "Contact Us")}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleLinkClick("/privacy", "Privacy Policy")}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 Street Food Finder. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Icons.twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Icons.facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Icons.instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
