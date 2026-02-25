"use client"

import type React from "react"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface FloatingCardProps {
  children: React.ReactNode
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  floatIntensity?: number
  className?: string
}

export function FloatingCard({
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  floatIntensity = 0.5,
  className = "",
}: FloatingCardProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * floatIntensity
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <Html
        transform
        occlude
        className={`pointer-events-auto ${className}`}
        style={{
          transform: "translate3d(-50%, -50%, 0)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl"
        >
          {children}
        </motion.div>
      </Html>
    </mesh>
  )
}
