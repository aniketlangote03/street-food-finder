"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const FloatingElements = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4", className)}
      {...props}
    />
  ),
)
FloatingElements.displayName = "FloatingElements"

export { FloatingElements }
