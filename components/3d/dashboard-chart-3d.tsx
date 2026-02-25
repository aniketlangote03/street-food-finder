"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import type * as THREE from "three"

interface DashboardChart3DProps {
  data: number[]
  position?: [number, number, number]
  scale?: number
}

export function DashboardChart3D({ data, position = [0, 0, 0], scale = 1 }: DashboardChart3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  const maxValue = Math.max(...data)

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {data.map((value, index) => {
        const height = (value / maxValue) * 2
        const x = (index - data.length / 2) * 0.3
        return (
          <Box key={index} args={[0.2, height, 0.2]} position={[x, height / 2, 0]}>
            <meshStandardMaterial
              color={`hsl(${186 + index * 10}, 100%, ${35 + (value / maxValue) * 20}%)`}
              transparent
              opacity={0.8}
            />
          </Box>
        )
      })}
    </group>
  )
}
