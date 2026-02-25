"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Cylinder, Html, Cone } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface NavigationCompass3DProps {
  userLocation?: { lat: number; lng: number }
  targetLocation?: { lat: number; lng: number }
  onDirectionsClick?: () => void
}

export function NavigationCompass3D({ userLocation, targetLocation, onDirectionsClick }: NavigationCompass3DProps) {
  const compassRef = useRef<THREE.Group>(null)
  const needleRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (compassRef.current) {
      compassRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }

    if (needleRef.current && userLocation && targetLocation) {
      // Calculate direction angle (simplified)
      const angle = Math.atan2(targetLocation.lng - userLocation.lng, targetLocation.lat - userLocation.lat)
      needleRef.current.rotation.z = angle
    }
  })

  return (
    <group ref={compassRef}>
      {/* Compass Base */}
      <Cylinder args={[1.5, 1.5, 0.2, 32]}>
        <meshStandardMaterial color="#0891b2" transparent opacity={0.8} />
      </Cylinder>

      {/* Compass Needle */}
      <group ref={needleRef}>
        <Cone args={[0.1, 0.8, 8]} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI]}>
          <meshStandardMaterial color="#ef4444" />
        </Cone>
        <Cone args={[0.1, 0.8, 8]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#6b7280" />
        </Cone>
      </group>

      {/* Direction Info */}
      <Html
        transform
        occlude
        position={[0, 2, 0]}
        className="pointer-events-auto"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-morphism p-4 rounded-xl shadow-2xl text-center w-56"
        >
          <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Navigation</h3>
          {userLocation && targetLocation ? (
            <div className="space-y-2">
              <p className="font-body text-sm text-gray-600">Direction to selected stall</p>
              <button
                onClick={onDirectionsClick}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-heading font-semibold transition-all duration-200"
              >
                Get Directions
              </button>
            </div>
          ) : (
            <p className="font-body text-sm text-gray-600">Select a stall to navigate</p>
          )}
        </motion.div>
      </Html>
    </group>
  )
}
