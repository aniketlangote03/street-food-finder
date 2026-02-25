"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Environment, OrbitControls } from "@react-three/drei"

interface SceneWrapperProps {
  children: React.ReactNode
  className?: string
  enableControls?: boolean
  cameraPosition?: [number, number, number]
  environment?: "city" | "apartment" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse"
}

export function SceneWrapper({
  children,
  className = "w-full h-full",
  enableControls = false,
  cameraPosition = [0, 0, 5],
  environment = "city",
}: SceneWrapperProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: cameraPosition, fov: 75 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Environment preset={environment} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {children}
          {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
        </Suspense>
      </Canvas>
    </div>
  )
}
