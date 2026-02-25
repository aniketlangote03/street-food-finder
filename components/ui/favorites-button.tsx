"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface FavoritesButtonProps {
  stallId: string
  className?: string
}

export function FavoritesButton({ stallId, className = "" }: FavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.includes(stallId))
  }, [stallId])

  const toggleFavorite = async () => {
    setIsLoading(true)

    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      let newFavorites

      if (isFavorite) {
        newFavorites = favorites.filter((id: string) => id !== stallId)
      } else {
        newFavorites = [...favorites, stallId]
      }

      localStorage.setItem("favorites", JSON.stringify(newFavorites))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 hover:bg-red-50 transition-colors ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <motion.div
        animate={{ scale: isFavorite ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
          }`}
        />
      </motion.div>
    </Button>
  )
}
