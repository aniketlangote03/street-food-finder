"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { type ReactNode, useRef } from "react"

interface HoverLift3DProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function HoverLift3D({ children, className = "", intensity = 1 }: HoverLift3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15 * intensity, -15 * intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15 * intensity, 15 * intensity])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY: rotateY,
        rotateX: rotateX,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05, z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface PulseGlow3DProps {
  children: ReactNode
  className?: string
  color?: string
}

export function PulseGlow3D({ children, className = "", color = "cyan" }: PulseGlow3DProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 20px rgba(8, 145, 178, 0.3)`,
          `0 0 40px rgba(8, 145, 178, 0.6)`,
          `0 0 20px rgba(8, 145, 178, 0.3)`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

interface FloatAnimation3DProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FloatAnimation3D({ children, className = "", delay = 0 }: FloatAnimation3DProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotateY: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
