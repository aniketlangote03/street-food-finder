"use client"

import type React from "react"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Box } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface DashboardStatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  position?: [number, number, number]
  color?: string
  delay?: number
}

export function DashboardStatsCard({
  title,
  value,
  description,
  icon,
  position = [0, 0, 0],
  color = "#0891b2",
  delay = 0,
}: DashboardStatsCardProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <Box args={[2, 1.2, 0.1]}>
        <meshStandardMaterial color={color} transparent opacity={0.1} />
      </Box>
      <Html
        transform
        occlude
        className="pointer-events-auto"
        style={{
          transform: "translate3d(-50%, -50%, 0)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
          className="glass-morphism p-6 rounded-xl shadow-2xl w-64 h-32"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-heading font-medium text-gray-700">{title}</h3>
            <div className="text-cyan-500">{icon}</div>
          </div>
          <div className="text-3xl font-heading font-bold text-gray-900 mb-1">{value}</div>
          <p className="text-xs font-body text-gray-600">{description}</p>
        </motion.div>
      </Html>
    </mesh>
  )
}
