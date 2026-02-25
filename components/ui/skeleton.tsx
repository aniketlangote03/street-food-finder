"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const MotionDiv = motion.div as unknown as React.FC<React.HTMLAttributes<HTMLDivElement>>
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.95 } as any}
      animate={{ opacity: 1, scale: 1 } as any}
      transition={{ duration: 0.4 } as any}
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-cyan-100/50 to-blue-100/50 glass-morphism shadow-lg",
        className,
      )}
      {...(props as any)}
    />
  )
}

export { Skeleton }
