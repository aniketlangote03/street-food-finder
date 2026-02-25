"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { Users, UserPlus, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface User {
  id: string
  email: string
  display_name: string
  role: "admin" | "stall_owner" | "user"
  created_at: string
  last_sign_in_at?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    owners: users.filter((u) => u.role === "stall_owner").length,
    customers: users.filter((u) => u.role === "user").length,
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">User Management</h2>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
        <p className="text-gray-600 font-body">Manage platform users, roles, and permissions</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-morphism border-orange-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{userStats.total}</div>
              <p className="text-xs text-gray-600">All registered users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-morphism border-blue-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userStats.admins}</div>
              <p className="text-xs text-gray-600">Platform administrators</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass-morphism border-purple-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stall Owners</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{userStats.owners}</div>
              <p className="text-xs text-gray-600">Food stall operators</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-morphism border-green-200/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userStats.customers}</div>
              <p className="text-xs text-gray-600">Regular users</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="glass-morphism border-orange-200/30">
          <CardHeader>
            <CardTitle className="font-heading text-gray-900">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-morphism border-orange-200"
                />
              </div>
              <div className="flex gap-2">
                {["all", "admin", "stall_owner", "user"].map((role) => (
                  <Button
                    key={role}
                    variant={roleFilter === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRoleFilter(role)}
                    className={
                      roleFilter === role ? "bg-orange-500 hover:bg-orange-600" : "glass-morphism border-orange-200"
                    }
                  >
                    {role === "all" ? "All" : role.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="glass-morphism border-orange-200/30">
          <CardHeader>
            <CardTitle className="font-heading text-gray-900">Users ({filteredUsers.length})</CardTitle>
            <CardDescription className="font-body">Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagementTable users={filteredUsers} loading={loading} onUserUpdate={fetchUsers} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
