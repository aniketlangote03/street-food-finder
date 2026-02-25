"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

interface ParticleSystem3DProps {
  count?: number
  size?: number
  color?: string
  speed?: number
  spread?: number
  opacity?: number
}

export function ParticleSystem3D({
  count = 2000,
  size = 0.02,
  color = "#0891b2",
  speed = 0.5,
  spread = 20,
  opacity = 0.6,
}: ParticleSystem3DProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread

      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * speed
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed
    }

    return [positions, velocities]
  }, [count, speed, spread])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        // Update positions based on velocities
        positions[i * 3] += velocities[i * 3] * delta
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta

        // Wrap around boundaries
        if (Math.abs(positions[i * 3]) > spread / 2) {
          positions[i * 3] = -positions[i * 3]
        }
        if (Math.abs(positions[i * 3 + 1]) > spread / 2) {
          positions[i * 3 + 1] = -positions[i * 3 + 1]
        }
        if (Math.abs(positions[i * 3 + 2]) > spread / 2) {
          positions[i * 3 + 2] = -positions[i * 3 + 2]
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
