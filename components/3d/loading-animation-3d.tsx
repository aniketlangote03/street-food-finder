"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Torus, Html } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface LoadingAnimation3DProps {
  message?: string
  type?: "spinner" | "pulse" | "orbit" | "wave"
}

export function LoadingAnimation3D({ message = "Loading...", type = "orbit" }: LoadingAnimation3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }

    if (type === "wave" && sphereRefs.current.length > 0) {
      sphereRefs.current.forEach((sphere, index) => {
        if (sphere) {
          sphere.position.y = Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.5
        }
      })
    }
  })

  const renderLoadingType = () => {
    switch (type) {
      case "spinner":
        return (
          <Torus args={[1, 0.3, 16, 100]}>
            <meshStandardMaterial color="#0891b2" transparent opacity={0.8} />
          </Torus>
        )

      case "pulse":
        return (
          <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial color="#0891b2" transparent opacity={0.6} />
          </Sphere>
        )

      case "orbit":
        return (
          <group>
            <Sphere args={[0.5, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#0891b2" />
            </Sphere>
            <Sphere args={[0.2, 16, 16]} position={[2, 0, 0]}>
              <meshStandardMaterial color="#06b6d4" />
            </Sphere>
            <Sphere args={[0.15, 16, 16]} position={[-1.5, 0, 1.5]}>
              <meshStandardMaterial color="#0ea5e9" />
            </Sphere>
            <Sphere args={[0.1, 16, 16]} position={[1, 0, -2]}>
              <meshStandardMaterial color="#0284c7" />
            </Sphere>
          </group>
        )

      case "wave":
        return (
          <group>
            {Array.from({ length: 5 }).map((_, index) => (
              <Sphere
                key={index}
                ref={(el) => {
                  if (el) sphereRefs.current[index] = el
                }}
                args={[0.2, 16, 16]}
                position={[(index - 2) * 0.5, 0, 0]}
              >
                <meshStandardMaterial color={`hsl(${186 + index * 10}, 100%, ${35 + index * 5}%)`} />
              </Sphere>
            ))}
          </group>
        )

      default:
        return (
          <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial color="#0891b2" transparent opacity={0.6} />
          </Sphere>
        )
    }
  }

  return (
    <group ref={groupRef}>
      {renderLoadingType()}

      <Html transform occlude position={[0, -2, 0]} className="pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="glass-morphism p-4 rounded-xl shadow-2xl">
            <p className="font-heading font-semibold text-lg text-gray-900 mb-2">{message}</p>
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </Html>
    </group>
  )
}
