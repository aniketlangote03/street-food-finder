"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
        <Icons.sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 px-0 relative overflow-hidden group hover:bg-primary/10 transition-all duration-200 hover:scale-105"
        >
          <Icons.sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0 text-amber-500 group-hover:text-amber-600" />

          <Icons.moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100 text-blue-400 group-hover:text-blue-500" />

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 p-2 bg-background/95 backdrop-blur-md border border-border/50 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Setting theme to light")
            setTheme("light")
          }}
          className={`${theme === "light" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100" : ""} rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 group`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icons.sun className="h-5 w-5 text-amber-500 group-hover:rotate-12 transition-transform duration-200" />
              {theme === "light" && <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Light</span>
              <span className="text-xs text-muted-foreground">Bright and clean</span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Setting theme to dark")
            setTheme("dark")
          }}
          className={`${theme === "dark" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" : ""} rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 group`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icons.moon className="h-5 w-5 text-blue-400 group-hover:-rotate-6 transition-transform duration-200" />
              {theme === "dark" && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full" />}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Dark</span>
              <span className="text-xs text-muted-foreground">Easy on the eyes</span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            console.log("[v0] Setting theme to system")
            setTheme("system")
          }}
          className={`${theme === "system" ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100" : ""} rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20 group`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icons.laptop className="h-5 w-5 text-green-500 group-hover:scale-105 transition-transform duration-200" />
              {theme === "system" && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">System</span>
              <span className="text-xs text-muted-foreground">Follows device setting</span>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
