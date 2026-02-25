import Link from "next/link"
import { getProfile } from "@/lib/auth"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function UserHeaderActions() {
  const profile = await getProfile().catch(() => null)

  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="ghost" className="hidden md:inline-flex" asChild>
          <Link href="/owner/login">Owner</Link>
        </Button>
        <Button variant="ghost" className="hidden md:inline-flex" asChild>
          <Link href="/admin/login">Admin</Link>
        </Button>
      </div>
    )
  }

  const isAdmin = profile.role === "admin"
  const isOwner = profile.role === "stall_owner"

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 px-2">
            <Icons.user className="h-5 w-5" />
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate">{profile.display_name || profile.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          {isOwner && (
            <DropdownMenuItem asChild>
              <Link href="/owner/dashboard">Owner Dashboard</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout" className="text-red-600">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
