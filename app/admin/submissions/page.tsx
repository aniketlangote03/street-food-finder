"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminPendingSubmissions } from "@/components/admin/pending-submissions"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"

export default function AdminSubmissionsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Submissions Queue</h2>
        <p className="text-gray-600 font-body">Review and decide on new stall submissions</p>
      </motion.div>

      <Card className="glass-morphism border-cyan-200/30">
        <CardHeader>
          <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-500" /> Pending Submissions
          </CardTitle>
          <CardDescription className="font-body">
            Approve or reject newly submitted stalls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPendingSubmissions />
        </CardContent>
      </Card>
    </div>
  )
}
