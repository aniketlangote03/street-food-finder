"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Line } from "@react-three/drei"
import type * as THREE from "three"

interface NetworkNode {
  id: string
  position: [number, number, number]
  color: string
  size: number
}

interface AdminNetworkVisualizationProps {
  nodes: NetworkNode[]
  connections: [number, number][]
}

export function AdminNetworkVisualization({ nodes, connections }: AdminNetworkVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render connections */}
      {connections.map(([startIdx, endIdx], index) => {
        const start = nodes[startIdx]?.position
        const end = nodes[endIdx]?.position
        if (!start || !end) return null

        return <Line key={index} points={[start, end]} color="#0891b2" lineWidth={2} transparent opacity={0.4} />
      })}

      {/* Render nodes */}
      {nodes.map((node, index) => (
        <Sphere key={node.id} args={[node.size, 16, 16]} position={node.position}>
          <meshStandardMaterial color={node.color} transparent opacity={0.8} />
        </Sphere>
      ))}
    </group>
  )
}
