"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { HoverLift3D } from "@/components/3d/micro-interactions"

const cuisineTypes = [
  { value: "all", label: "All Cuisines" },
  { value: "Mexican", label: "Mexican" },
  { value: "American", label: "American" },
  { value: "Asian", label: "Asian" },
  { value: "Italian", label: "Italian" },
  { value: "Indian", label: "Indian" },
  { value: "Mediterranean", label: "Mediterranean" },
  { value: "Thai", label: "Thai" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
]

const locations = [
  { value: "all", label: "All Locations" },
  { value: "Downtown", label: "Downtown" },
  { value: "University District", label: "University District" },
  { value: "Business District", label: "Business District" },
  { value: "Food Court", label: "Food Court" },
  { value: "Main Street", label: "Main Street" },
  { value: "Central Park", label: "Central Park" },
]

export function SearchFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [cuisine, setCuisine] = useState(searchParams.get("cuisine") || "all")
  const [location, setLocation] = useState(searchParams.get("location") || "all")

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (cuisine !== "all") params.set("cuisine", cuisine)
    if (location !== "all") params.set("location", location)

    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setCuisine("all")
    setLocation("all")
    router.push("/")
  }

  const hasActiveFilters = search || cuisine !== "all" || location !== "all"

  return (
    <HoverLift3D intensity={0.5}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-morphism bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-100/50"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <Input
              placeholder="Search for food stalls, cuisines, or dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-cyan-200/50 focus:border-cyan-400 focus:ring-cyan-400 glass-morphism bg-white/50 backdrop-blur-sm rounded-xl shadow-lg font-body"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 glass-morphism border-cyan-200/50 hover:border-cyan-400 hover:bg-cyan-50/50 text-cyan-700 hover:text-cyan-800 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                >
                  !
                </motion.span>
              )}
            </Button>

            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-8 pt-8 border-t border-cyan-200/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-heading font-semibold text-gray-700 mb-3">Cuisine Type</label>
                  <Select value={cuisine} onValueChange={setCuisine}>
                    <SelectTrigger className="glass-morphism border-cyan-200/50 focus:border-cyan-400 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg py-3">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism bg-white/95 backdrop-blur-xl border-cyan-200/50 rounded-xl shadow-2xl">
                      {cuisineTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="hover:bg-cyan-50/50">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-heading font-semibold text-gray-700 mb-3">Location</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="glass-morphism border-cyan-200/50 focus:border-cyan-400 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg py-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism bg-white/95 backdrop-blur-xl border-cyan-200/50 rounded-xl shadow-2xl">
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value} className="hover:bg-cyan-50/50">
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  className="flex items-end"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full glass-morphism border-red-200/50 hover:border-red-400 hover:bg-red-50/50 text-red-600 hover:text-red-700 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              {search && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-2 glass-morphism bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="hover:text-cyan-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {cuisine !== "all" && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-2 glass-morphism bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  {cuisineTypes.find((c) => c.value === cuisine)?.label}
                  <button onClick={() => setCuisine("all")} className="hover:text-blue-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {location !== "all" && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="inline-flex items-center gap-2 glass-morphism bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  {locations.find((l) => l.value === location)?.label}
                  <button onClick={() => setLocation("all")} className="hover:text-green-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </HoverLift3D>
  )
}
