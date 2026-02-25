"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Box } from "@react-three/drei"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
}

interface MenuCarousel3DProps {
  menuItems: MenuItem[]
  position?: [number, number, number]
}

export function MenuCarousel3D({ menuItems, position = [0, 0, 0] }: MenuCarousel3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const radius = 3
  const itemCount = Math.min(menuItems.length, 8) // Limit to 8 items for better visualization

  return (
    <group ref={groupRef} position={position}>
      {menuItems.slice(0, itemCount).map((item, index) => {
        const angle = (index / itemCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <group key={item.id} position={[x, 0, z]}>
            <Box args={[0.5, 0.8, 0.1]}>
              <meshStandardMaterial color="#0891b2" transparent opacity={0.3} />
            </Box>
            <Html transform occlude className="pointer-events-auto" style={{ transform: "translate3d(-50%, -50%, 0)" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-morphism p-3 rounded-lg shadow-xl w-40 text-center"
              >
                <h4 className="font-heading font-semibold text-sm text-gray-900 mb-1">{item.name}</h4>
                <p className="font-body text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="font-heading font-bold text-cyan-600">Rs {item.price.toFixed(2)}</div>
              </motion.div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
