"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddStallDialog } from "@/components/owner/add-stall-dialog"
import { StallCard } from "@/components/owner/stall-card"
import { Store, Plus, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface Stall {
  id: string
  name: string
  description: string
  cuisine_type: string
  image_url?: string
  latitude: number
  longitude: number
  location_description: string
  opening_time: string
  closing_time: string
  status: "open" | "closed" | "maintenance"
  is_approved: boolean
  created_at: string
}

export default function OwnerStallsPage() {
  const [stalls, setStalls] = useState<Stall[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchStalls()
  }, [])

  const fetchStalls = async () => {
    try {
      const response = await fetch("/api/owner/stalls")
      if (response.ok) {
        const data = await response.json()
        setStalls(data)
      } else {
        // optional: log non-200 server responses
        console.error("Failed to fetch stalls, status:", response.status)
      }
    } catch (error) {
      console.error("Failed to fetch stalls:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStallUpdate = () => {
    // called after add / edit / delete — refresh
    setLoading(true)
    fetchStalls()
  }

  const stallStats = {
    total: stalls.length,
    approved: stalls.filter((s) => s.is_approved).length,
    open: stalls.filter((s) => s.status === "open").length,
    pending: stalls.filter((s) => !s.is_approved).length,
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">My Stalls</h2>
            <p className="text-gray-600 font-body">Manage your food stalls and their settings</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Stall
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Card className="glass-morphism border-orange-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stalls</CardTitle>
              <Store className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stallStats.total}</div>
              <p className="text-xs text-gray-600">All your stalls</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="glass-morphism border-green-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Store className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stallStats.approved}</div>
              <p className="text-xs text-gray-600">Ready for customers</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Card className="glass-morphism border-blue-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Open</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stallStats.open}</div>
              <p className="text-xs text-gray-600">Serving customers</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Card className="glass-morphism border-yellow-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stallStats.pending}</div>
              <p className="text-xs text-gray-600">Awaiting admin review</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stalls Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-morphism animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stalls.length === 0 ? (
          <Card className="glass-morphism border-orange-200/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Store className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stalls yet</h3>
              <p className="text-gray-600 text-center mb-6">
                Get started by adding your first food stall to the platform
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Stall
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stalls.map((stall, index) => (
              <motion.div
                key={stall.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <StallCard stall={stall} onUpdate={handleStallUpdate} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AddStallDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={handleStallUpdate} />
    </div>
  )
}
