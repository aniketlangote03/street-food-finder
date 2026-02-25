// This file is likely deprecated or a duplicate of components/public/hero-section.tsx
// Keeping it for completeness based on previous context, but consider consolidating.
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { FloatingElements } from "@/components/ui/floating-elements"
import { ParallaxContainer } from "@/components/ui/parallax-container"

export function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background elements with parallax */}
      <div className="absolute inset-0 z-0">
        <ParallaxContainer speed={0.1}>
          <Image
            src="/placeholder.svg?height=1000&width=1500"
            alt="Cityscape background"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </ParallaxContainer>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Discover Your Next Favorite Street Food 🍟
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Find the best food trucks and stalls near you, with real-time updates on availability, queues, and more.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Link href="/map">Explore Stalls Now</Link>
        </Button>
      </div>

      {/* Floating elements */}
      <FloatingElements>
        <ParallaxContainer speed={0.05}>
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Burger emoji"
            width={80}
            height={80}
            className="absolute bottom-20 left-20 animate-float"
          />
        </ParallaxContainer>
        <ParallaxContainer speed={0.07}>
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt="Taco emoji"
            width={60}
            height={60}
            className="absolute top-40 right-40 animate-float-reverse"
          />
        </ParallaxContainer>
      </FloatingElements>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  )
}
