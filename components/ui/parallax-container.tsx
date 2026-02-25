"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: number // Parallax speed, e.g., 0.5 for half speed
}

const ParallaxContainer = React.forwardRef<HTMLDivElement, ParallaxContainerProps>(
  ({ children, speed = 0.5, className, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], ["-" + speed * 100 + "%", speed * 100 + "%"])

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", className)} {...props}>
        <motion.div style={{ y }} className="will-change-transform">
          {children}
        </motion.div>
      </div>
    )
  },
)
ParallaxContainer.displayName = "ParallaxContainer"

export { ParallaxContainer }
