"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import type * as THREE from "three"

export function InteractiveBackground() {
  const pointsRef = useRef<THREE.Points>(null)

  // Generate random points for the background
  const particlesPosition = new Float32Array(1000 * 3)
  for (let i = 0; i < 1000; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * 20
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 20
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <Points ref={pointsRef} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#0891b2" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  )
}
