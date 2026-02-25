"use client"

import { Button } from "@/components/ui/button"
import { Phone, Globe } from "lucide-react"

interface StallActionsProps {
  stallName: string
  phone?: string | null
  directionsUrl: string
}

export function StallActions({ stallName, phone, directionsUrl }: StallActionsProps) {
  const handleCall = () => {
    if (!phone) return
    try {
      window.location.href = `tel:${phone}`
    } catch (e) {
      console.error("Failed to open dialer", e)
    }
  }

  const handleDirections = () => {
    try {
      window.open(directionsUrl, "_blank", "noopener,noreferrer")
    } catch (e) {
      console.error("Failed to open directions", e)
    }
  }

  return (
    <div className="flex gap-3 mt-6">
      <Button
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
        onClick={handleCall}
        disabled={!phone}
      >
        <Phone className="h-4 w-4 mr-2" />
        Call Stall
      </Button>
      <Button
        variant="outline"
        className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 bg-transparent"
        onClick={handleDirections}
      >
        <Globe className="h-4 w-4 mr-2" />
        Get Directions
      </Button>
    </div>
  )
}
