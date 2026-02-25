"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, Store, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface AdminUser {
  id: string
  email: string
  display_name: string
  role: "admin" | "stall_owner" | "user"
  created_at: string
  last_sign_in_at?: string
}

interface UserManagementTableProps {
  users: AdminUser[]
  loading: boolean
  onUserUpdate: () => void
}

export function UserManagementTable({ users, loading, onUserUpdate }: UserManagementTableProps) {
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingUser(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        onUserUpdate()
      }
    } catch (error) {
      console.error("Failed to update user role:", error)
    } finally {
      setUpdatingUser(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "stall_owner":
        return <Store className="w-4 h-4 text-purple-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-blue-100 text-blue-800 border-blue-200",
      stall_owner: "bg-purple-100 text-purple-800 border-purple-200",
      user: "bg-green-100 text-green-800 border-green-200",
    }

    return (
      <Badge className={`${colors[role as keyof typeof colors]} font-medium`}>
        {getRoleIcon(role)}
        <span className="ml-1">{role.replace("_", " ")}</span>
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 glass-morphism rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border border-orange-200/30">
      <Table>
        <TableHeader>
          <TableRow className="border-orange-200/30">
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Joined</TableHead>
            <TableHead className="font-semibold">Last Active</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-orange-200/30 hover:bg-orange-50/20"
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                      {user.display_name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{user.display_name || "No name"}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-sm text-gray-600">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-orange-100"
                      disabled={updatingUser === user.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-morphism border-orange-200">
                    <DropdownMenuItem onClick={() => updateUserRole(user.id, "admin")}>
                      <Shield className="w-4 h-4 mr-2 text-blue-500" />
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateUserRole(user.id, "stall_owner")}>
                      <Store className="w-4 h-4 mr-2 text-purple-500" />
                      Make Stall Owner
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateUserRole(user.id, "user")}>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Make User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
