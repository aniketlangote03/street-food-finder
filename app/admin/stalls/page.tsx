"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StallsTable } from "@/components/admin/stalls-table"
import { motion } from "framer-motion"

export default function AdminStallsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Stalls Management</h2>
        <p className="text-gray-600 font-body">Review and approve new stalls, manage existing ones</p>
      </motion.div>

      <Card className="glass-morphism border-cyan-200/30">
        <CardHeader>
          <CardTitle className="font-heading text-gray-900">Stalls</CardTitle>
          <CardDescription className="font-body">Search, filter, and approve/revoke</CardDescription>
        </CardHeader>
        <CardContent>
          <StallsTable />
        </CardContent>
      </Card>
    </div>
  )
}
