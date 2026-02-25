"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Box } from "@react-three/drei"
import type * as THREE from "three"

interface FoodModelProps {
  type: "burger" | "pizza" | "taco" | "noodles" | "generic"
  position?: [number, number, number]
  scale?: number
  color?: string
  animated?: boolean
}

export function FoodModel({
  type,
  position = [0, 0, 0],
  scale = 1,
  color = "#0891b2",
  animated = true,
}: FoodModelProps) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const renderFoodModel = () => {
    switch (type) {
      case "burger":
        return (
          <group>
            {/* Burger layers */}
            <Box args={[1, 0.2, 1]} position={[0, -0.3, 0]}>
              <meshStandardMaterial color="#8B4513" />
            </Box>
            <Box args={[0.9, 0.1, 0.9]} position={[0, -0.1, 0]}>
              <meshStandardMaterial color="#228B22" />
            </Box>
            <Box args={[0.8, 0.15, 0.8]} position={[0, 0.1, 0]}>
              <meshStandardMaterial color="#8B4513" />
            </Box>
            <Box args={[1, 0.2, 1]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#DAA520" />
            </Box>
          </group>
        )
      case "pizza":
        return (
          <group>
            <Sphere args={[0.8, 16, 8]} position={[0, 0, 0]} scale={[1, 0.1, 1]}>
              <meshStandardMaterial color="#FFD700" />
            </Sphere>
            <Sphere args={[0.1, 8, 8]} position={[0.3, 0.1, 0.2]}>
              <meshStandardMaterial color="#FF6347" />
            </Sphere>
            <Sphere args={[0.1, 8, 8]} position={[-0.2, 0.1, -0.3]}>
              <meshStandardMaterial color="#FF6347" />
            </Sphere>
          </group>
        )
      default:
        return (
          <Sphere args={[0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} />
          </Sphere>
        )
    }
  }

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {renderFoodModel()}
    </group>
  )
}
