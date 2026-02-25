"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere, Box } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface StallShowcase3DProps {
  stallName: string
  cuisineType: string
  rating: number
  queueTime: number
  position?: [number, number, number]
  delay?: number
}

export function StallShowcase3D({
  stallName,
  cuisineType,
  rating,
  queueTime,
  position = [0, 0, 0],
  delay = 0,
}: StallShowcase3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.2
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.1
    }
  })

  const getQueueColor = (time: number) => {
    if (time <= 10) return "#10b981" // green
    if (time <= 20) return "#f59e0b" // yellow
    return "#ef4444" // red
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Central showcase sphere */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial color="#0891b2" transparent opacity={0.2} />
      </Sphere>

      {/* Floating info cards */}
      <Html
        transform
        occlude
        position={[0, 2, 0]}
        className="pointer-events-auto"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
          className="glass-morphism p-4 rounded-xl shadow-2xl text-center w-48"
        >
          <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">{stallName}</h3>
          <p className="font-body text-sm text-gray-600">{cuisineType}</p>
        </motion.div>
      </Html>

      {/* Rating display */}
      <Html
        transform
        occlude
        position={[-2.5, 0, 0]}
        className="pointer-events-auto"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
          className="glass-morphism p-3 rounded-lg shadow-xl text-center w-24"
        >
          <div className="text-2xl font-heading font-bold text-yellow-500">{rating.toFixed(1)}</div>
          <div className="text-xs font-body text-gray-600">Rating</div>
        </motion.div>
      </Html>

      {/* Queue time display */}
      <Html
        transform
        occlude
        position={[2.5, 0, 0]}
        className="pointer-events-auto"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.4 }}
          className="glass-morphism p-3 rounded-lg shadow-xl text-center w-24"
        >
          <div className="text-2xl font-heading font-bold" style={{ color: getQueueColor(queueTime) }}>
            {queueTime}
          </div>
          <div className="text-xs font-body text-gray-600">Min Queue</div>
        </motion.div>
      </Html>

      {/* Decorative elements */}
      <Box args={[0.3, 0.3, 0.3]} position={[-1, -1.5, 1]}>
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.6} />
      </Box>
      <Box args={[0.2, 0.2, 0.2]} position={[1, -1.5, -1]}>
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} />
      </Box>
    </group>
  )
}
