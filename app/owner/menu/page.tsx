"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddMenuItemDialog } from "@/components/owner/add-menu-item-dialog"
import { MenuItemCard } from "@/components/owner/menu-item-card"
import { Utensils, Plus, Store } from "lucide-react"
import { motion } from "framer-motion"

interface Stall {
  id: string
  name: string
  is_approved: boolean
}

interface MenuItem {
  id: string
  stall_id: string
  name: string
  description: string
  price: number
  image_url?: string
  available: boolean
  created_at: string
}

export default function OwnerMenuPage() {
  const [stalls, setStalls] = useState<Stall[]>([])
  const [selectedStallId, setSelectedStallId] = useState<string>("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchStalls()
  }, [])

  useEffect(() => {
    if (selectedStallId) {
      fetchMenuItems(selectedStallId)
    }
  }, [selectedStallId])

  const fetchStalls = async () => {
    try {
      const response = await fetch("/api/owner/stalls")
      if (response.ok) {
        const data = await response.json()
        setStalls(data.filter((stall: Stall) => stall.is_approved))
        if (data.length > 0) {
          setSelectedStallId(data[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch stalls:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItems = async (stallId: string) => {
    try {
      const response = await fetch(`/api/owner/stalls/${stallId}`)
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data.menu_items || [])
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error)
    }
  }

  const handleMenuUpdate = () => {
    if (selectedStallId) {
      fetchMenuItems(selectedStallId)
    }
  }

  const selectedStall = stalls.find((s) => s.id === selectedStallId)
  const availableItems = menuItems.filter((item) => item.available).length
  const totalItems = menuItems.length

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Menu Management</h2>
            <p className="text-gray-600 font-body">Manage your stall menus and menu items</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            disabled={!selectedStallId}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </motion.div>

      {/* Stall Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-morphism border-orange-200/30">
          <CardHeader>
            <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-orange-500" />
              Select Stall
            </CardTitle>
            <CardDescription className="font-body">Choose which stall's menu you want to manage</CardDescription>
          </CardHeader>
          <CardContent>
            {stalls.length === 0 ? (
              <div className="text-center py-8">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No approved stalls found. Please add and get approval for a stall first.
                </p>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Select value={selectedStallId} onValueChange={setSelectedStallId}>
                  <SelectTrigger className="glass-morphism border-orange-200 max-w-md">
                    <SelectValue placeholder="Select a stall" />
                  </SelectTrigger>
                  <SelectContent>
                    {stalls.map((stall) => (
                      <SelectItem key={stall.id} value={stall.id}>
                        {stall.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStall && (
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{totalItems} total items</span>
                    <span>{availableItems} available</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Menu Items */}
      {selectedStallId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-morphism border-orange-200/30">
            <CardHeader>
              <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-500" />
                Menu Items ({totalItems})
              </CardTitle>
              <CardDescription className="font-body">Manage items for {selectedStall?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="glass-morphism animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-t-lg" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items yet</h3>
                  <p className="text-gray-600 mb-6">Start building your menu by adding your first item</p>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Menu Item
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <MenuItemCard item={item} onUpdate={handleMenuUpdate} />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedStallId && (
        <AddMenuItemDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          stallId={selectedStallId}
          onSuccess={handleMenuUpdate}
        />
      )}
    </div>
  )
}
