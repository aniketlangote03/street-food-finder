"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeDebug() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-background/90 backdrop-blur-md border border-border rounded-lg shadow-xl text-sm max-w-xs">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Theme Debug</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Theme:</span>
            <span className="font-mono text-primary font-medium">{theme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Resolved:</span>
            <span className="font-mono text-primary font-medium">{resolvedTheme}</span>
          </div>
        </div>
        <div className="flex gap-2 items-center pt-2 border-t border-border">
          <div className="w-6 h-6 bg-background border-2 border-border rounded-md shadow-sm"></div>
          <div className="w-6 h-6 bg-foreground rounded-md shadow-sm"></div>
          <div className="w-6 h-6 bg-primary rounded-md shadow-sm"></div>
          <div className="w-6 h-6 bg-accent rounded-md shadow-sm"></div>
        </div>
        <p className="text-xs text-muted-foreground">Colors should change with theme</p>
      </div>
    </div>
  )
}
