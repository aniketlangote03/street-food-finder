"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Plane } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface SceneTransitionsProps {
  isTransitioning: boolean
  transitionType?: "wipe" | "fade" | "slide" | "zoom"
  duration?: number
  onTransitionComplete?: () => void
}

export function SceneTransitions({
  isTransitioning,
  transitionType = "wipe",
  duration = 1,
  onTransitionComplete,
}: SceneTransitionsProps) {
  const planeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (planeRef.current && isTransitioning) {
      switch (transitionType) {
        case "wipe":
          planeRef.current.position.x = Math.sin(state.clock.elapsedTime * 3) * 10
          break
        case "slide":
          planeRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 5
          break
        case "zoom":
          planeRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.5)
          break
      }
    }
  })

  if (!isTransitioning) return null

  return (
    <group>
      <Plane ref={planeRef} args={[20, 20]} position={[0, 0, 5]}>
        <meshStandardMaterial color="#0891b2" transparent opacity={transitionType === "fade" ? 0.8 : 0.95} />
      </Plane>

      {/* Transition completion handler */}
      <motion.hgroup
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration, delay: duration * 0.5 }}
        onAnimationComplete={onTransitionComplete}
      />
    </group>
  )
}
