"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Html } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface StallMarker {
  id: string
  name: string
  position: [number, number, number]
  status: "open" | "closed"
  queueTime: number
  cuisineType: string
}

interface MapGlobe3DProps {
  stalls: StallMarker[]
  onStallClick?: (stallId: string) => void
}

export function MapGlobe3D({ stalls, onStallClick }: MapGlobe3DProps) {
  const globeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const getStatusColor = (status: string) => {
    return status === "open" ? "#10b981" : "#ef4444"
  }

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[3, 64, 64]}>
        <meshStandardMaterial color="#0891b2" transparent opacity={0.3} wireframe />
      </Sphere>

      {/* Stall Markers */}
      {stalls.map((stall, index) => (
        <group key={stall.id} position={stall.position}>
          <Sphere args={[0.1, 16, 16]}>
            <meshStandardMaterial color={getStatusColor(stall.status)} />
          </Sphere>

          <Html transform occlude className="pointer-events-auto" style={{ transform: "translate3d(-50%, -50%, 0)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-morphism p-3 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform w-48"
              onClick={() => onStallClick?.(stall.id)}
            >
              <h4 className="font-heading font-semibold text-sm text-gray-900 mb-1">{stall.name}</h4>
              <p className="font-body text-xs text-gray-600 mb-2">{stall.cuisineType}</p>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    stall.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {stall.status}
                </span>
                <span className="text-xs font-medium text-cyan-600">{stall.queueTime}min</span>
              </div>
            </motion.div>
          </Html>
        </group>
      ))}
    </group>
  )
}
