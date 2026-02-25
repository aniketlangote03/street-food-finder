"use client"

import type React from "react"
import { motion } from "framer-motion"

interface PageTransition3DProps {
  children: React.ReactNode
  transitionType?: "slide" | "fade" | "rotate" | "scale"
  duration?: number
}

export function PageTransition3D({ children, transitionType = "fade", duration = 0.6 }: PageTransition3DProps) {
  const getTransitionVariants = () => {
    switch (transitionType) {
      case "slide":
        return {
          initial: { x: 50, opacity: 0, rotateY: -15 },
          animate: { x: 0, opacity: 1, rotateY: 0 },
          exit: { x: -50, opacity: 0, rotateY: 15 },
        }
      case "fade":
        return {
          initial: { opacity: 0, scale: 0.95, rotateX: -5 },
          animate: { opacity: 1, scale: 1, rotateX: 0 },
          exit: { opacity: 0, scale: 1.05, rotateX: 5 },
        }
      case "rotate":
        return {
          initial: { rotateY: 45, opacity: 0, scale: 0.9 },
          animate: { rotateY: 0, opacity: 1, scale: 1 },
          exit: { rotateY: -45, opacity: 0, scale: 0.9 },
        }
      case "scale":
        return {
          initial: { scale: 0.8, opacity: 0, rotateZ: -5 },
          animate: { scale: 1, opacity: 1, rotateZ: 0 },
          exit: { scale: 1.1, opacity: 0, rotateZ: 5 },
        }
      default:
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
        }
    }
  }

  return (
    <motion.div
      variants={getTransitionVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween",
      }}
      className="w-full min-h-screen"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {children}
    </motion.div>
  )
}
