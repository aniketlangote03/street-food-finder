"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Box } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"

interface HoverEffects3DProps {
  children: React.ReactNode
  effectType?: "float" | "glow" | "scale" | "rotate"
  intensity?: number
  className?: string
}

export function HoverEffects3D({ children, effectType = "float", intensity = 1, className = "" }: HoverEffects3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const basePosition = useRef<[number, number, number]>([0, 0, 0])

  useFrame((state) => {
    if (meshRef.current) {
      switch (effectType) {
        case "float":
          meshRef.current.position.y =
            basePosition.current[1] +
            (isHovered ? 0.3 * intensity : 0) +
            Math.sin(state.clock.elapsedTime * 2) * 0.1 * intensity
          break

        case "rotate":
          meshRef.current.rotation.y += isHovered ? 0.02 * intensity : 0.005 * intensity
          break

        case "glow":
          // Glow effect handled by material opacity
          break

        case "scale":
          const targetScale = isHovered ? 1.1 * intensity : 1
          meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
          break
      }
    }
  })

  return (
    <group>
      <Box
        ref={meshRef}
        args={[0.1, 0.1, 0.1]}
        position={basePosition.current}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <meshStandardMaterial color="#0891b2" transparent opacity={effectType === "glow" && isHovered ? 0.3 : 0} />
      </Box>

      <Html
        transform
        occlude
        className={`pointer-events-auto ${className}`}
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{
            scale: isHovered && effectType === "scale" ? 1.05 : 1,
            y: isHovered && effectType === "float" ? -5 : 0,
            rotateY: isHovered && effectType === "rotate" ? 5 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`transition-all duration-300 ${
            effectType === "glow" && isHovered ? "shadow-2xl shadow-cyan-500/25" : ""
          }`}
        >
          {children}
        </motion.div>
      </Html>
    </group>
  )
}
