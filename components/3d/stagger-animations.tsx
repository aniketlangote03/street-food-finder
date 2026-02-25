"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StaggerContainer3DProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer3D({ children, className = "", staggerDelay = 0.1 }: StaggerContainer3DProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  )
}

interface StaggerItem3DProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "scale"
}

export function StaggerItem3D({ children, className = "", direction = "up" }: StaggerItem3DProps) {
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return { y: 50, opacity: 0, rotateX: -15 }
      case "down":
        return { y: -50, opacity: 0, rotateX: 15 }
      case "left":
        return { x: -50, opacity: 0, rotateY: -15 }
      case "right":
        return { x: 50, opacity: 0, rotateY: 15 }
      case "scale":
        return { scale: 0.8, opacity: 0, rotateZ: -10 }
      default:
        return { y: 50, opacity: 0, rotateX: -15 }
    }
  }

  const itemVariants = {
    hidden: getInitialTransform(),
    visible: {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <motion.div
      variants={itemVariants as any}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}
