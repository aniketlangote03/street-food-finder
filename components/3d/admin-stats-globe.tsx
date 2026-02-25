"use client"

import type React from "react"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Html } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface AdminStatsGlobeProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  position?: [number, number, number]
  color?: string
  delay?: number
}

export function AdminStatsGlobe({
  title,
  value,
  description,
  icon,
  position = [0, 0, 0],
  color = "#0891b2",
  delay = 0,
}: AdminStatsGlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.2
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.5 + delay
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Sphere ref={sphereRef} args={[1.2, 32, 32]}>
        <meshStandardMaterial color={color} transparent opacity={0.15} wireframe />
      </Sphere>
      <Html
        transform
        occlude
        className="pointer-events-auto"
        style={{
          transform: "translate3d(-50%, -50%, 0)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay }}
          className="glass-morphism p-6 rounded-2xl shadow-2xl w-72 text-center"
        >
          <div className="flex justify-center mb-3">
            <div className="text-cyan-500 p-3 bg-cyan-100/20 rounded-full">{icon}</div>
          </div>
          <h3 className="text-sm font-heading font-medium text-gray-700 mb-2">{title}</h3>
          <div className="text-4xl font-heading font-bold text-gray-900 mb-2">{value}</div>
          <p className="text-xs font-body text-gray-600">{description}</p>
        </motion.div>
      </Html>
    </group>
  )
}
