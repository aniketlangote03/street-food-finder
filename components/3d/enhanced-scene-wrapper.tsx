"use client"

import type React from "react"
import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import { Environment, OrbitControls } from "@react-three/drei"
import { LoadingAnimation3D } from "./loading-animation-3d"
import { ParticleSystem3D } from "./particle-system-3d"
import { SceneTransitions } from "./scene-transitions"

interface EnhancedSceneWrapperProps {
  children: React.ReactNode
  className?: string
  enableControls?: boolean
  cameraPosition?: [number, number, number]
  environment?: "city" | "apartment" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse"
  showParticles?: boolean
  loadingMessage?: string
  transitionType?: "wipe" | "fade" | "slide" | "zoom"
}

export function EnhancedSceneWrapper({
  children,
  className = "w-full h-full",
  enableControls = false,
  cameraPosition = [0, 0, 5],
  environment = "city",
  showParticles = true,
  loadingMessage = "Loading 3D Scene...",
  transitionType = "fade",
}: EnhancedSceneWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSceneReady = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsTransitioning(false)
    }, 1000)
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onCreated={handleSceneReady}
      >
        <Suspense fallback={<LoadingAnimation3D message={loadingMessage} type="orbit" />}>
          <Environment preset={environment} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {showParticles && (
            <ParticleSystem3D count={1000} size={0.015} color="#0891b2" speed={0.3} spread={15} opacity={0.4} />
          )}

          {children}

          <SceneTransitions
            isTransitioning={isTransitioning}
            transitionType={transitionType}
            duration={0.8}
            onTransitionComplete={() => setIsTransitioning(false)}
          />

          {enableControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              autoRotate={false}
              maxPolarAngle={Math.PI / 2}
              minDistance={3}
              maxDistance={20}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
