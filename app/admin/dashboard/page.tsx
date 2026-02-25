"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Users, Store, FileText, TrendingUp, AlertTriangle } from "lucide-react"
import useSWR from "swr"
import { KpiCard } from "@/components/admin/kpi-card"
import Link from "next/link"
import { AdminPendingSubmissions } from "@/components/admin/pending-submissions"

type DashboardStats = {
  totalStalls: number
  pendingSubmissions: number
  totalUsers: number
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminDashboardPage() {
  const { data, error, isLoading } = useSWR<DashboardStats>("/api/admin/dashboard", fetcher);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between space-y-2"
        >
          <h2 className="text-4xl font-heading font-bold tracking-tight text-gray-900">
            Street Food Ecosystem Overview
          </h2>
        </motion.div>

        <Separator className="my-6 bg-cyan-200/50" />

        {/* KPI Cards */}
        {isLoading || !data ? <KpiSkeleton /> : <KpiRow stats={data} />}

        {/* Submissions Moderation & Recent Activity */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-morphism border-cyan-200/30 md:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-500" />
                Pending Submissions
              </CardTitle>
              <CardDescription className="font-body">Approve or reject newly submitted stalls</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPendingSubmissions />
            </CardContent>
          </Card>
          <Card className="glass-morphism border-cyan-200/30">
            <CardHeader>
              <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-500" />
                Recent Activity
              </CardTitle>
              <CardDescription className="font-body">Latest approvals, submissions and users</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>

        {/* Network Visualization and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="col-span-2"
          >
            <Card className="glass-morphism border-cyan-200/30">
              <CardHeader>
                <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
                  Platform Health
                </CardTitle>
                <CardDescription className="font-body">
                  Key reliability indicators and system metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center glass-morphism p-4 rounded-lg">
                    <div className="text-2xl font-heading font-bold text-emerald-600 mb-1">99.9%</div>
                    <div className="text-sm font-body text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center glass-morphism p-4 rounded-lg">
                    <div className="text-2xl font-heading font-bold text-cyan-600 mb-1">1.2s</div>
                    <div className="text-sm font-body text-gray-600">Avg Response</div>
                  </div>
                  <div className="text-center glass-morphism p-4 rounded-lg">
                    <div className="text-2xl font-heading font-bold text-sky-600 mb-1">847</div>
                    <div className="text-sm font-body text-gray-600">Active Sessions</div>
                  </div>
                  <div className="text-center glass-morphism p-4 rounded-lg">
                    <div className="text-2xl font-heading font-bold text-teal-600 mb-1">0</div>
                    <div className="text-sm font-body text-gray-600">Critical Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="col-span-1"
          >
            <Card className="glass-morphism border-cyan-200/30">
              <CardHeader>
                <CardTitle className="font-heading text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-cyan-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="font-body">Administrative controls and monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 2 }}
                    className="glass-morphism p-4 rounded-lg hover:bg-cyan-50/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-sm font-heading font-medium">Urgent: 5 stalls need approval</p>
                        <p className="text-xs font-body text-gray-600">Review pending submissions</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 2.2 }}
                    className="glass-morphism p-4 rounded-lg hover:bg-cyan-50/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-heading font-medium">12 user reports to review</p>
                        <p className="text-xs font-body text-gray-600">Content moderation needed</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 2.4 }}
                    className="glass-morphism p-4 rounded-lg hover:bg-cyan-50/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-heading font-medium">System backup completed</p>
                        <p className="text-xs font-body text-gray-600">All data secured successfully</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 2.6 }}
                    className="glass-morphism p-4 rounded-lg hover:bg-cyan-50/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-heading font-medium">Weekly analytics ready</p>
                        <p className="text-xs font-body text-gray-600">Performance insights available</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Platform Performance Metrics removed to avoid duplication with Health */}
    </div>
  )
}

function KpiRow({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Users"
        value={stats.totalUsers}
        change={{ value: "+3.2%", trend: "up", label: "vs last week" }}
        icon={<Users className="h-5 w-5 text-cyan-600" />}
        accent="cyan"
      />
      <KpiCard
        title="Food Stalls"
        value={stats.totalStalls}
        change={{ value: "+1.1%", trend: "up", label: "vs last week" }}
        icon={<Store className="h-5 w-5 text-sky-600" />}
        accent="sky"
      />
      <KpiCard
        title="Pending Approvals"
        value={stats.pendingSubmissions}
        change={{ value: "-12%", trend: "down", label: "clearance rate" }}
        icon={<FileText className="h-5 w-5 text-teal-600" />}
        accent="teal"
      />
      <KpiCard
        title="Conversion"
        value={"32%"}
        change={{ value: "+0.8%", trend: "up", label: "owner signups" }}
        icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
        accent="emerald"
      />
    </div>
  )
}

function RecentActivity() {
  const { data, error, isLoading } = useSWR<{ items: { id: string; title: string; time: string }[] }>(
    "/api/admin/activity",
    fetcher,
  )
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }
  if (error || !data) return <div className="text-sm text-slate-500">Failed to load activity.</div>
  const items = data.items
  return (
    <ul className="space-y-3 text-sm">
      {items.map((it) => (
        <li key={it.id} className="flex items-center justify-between rounded-md border p-3">
          <span className="text-slate-700">{it.title}</span>
          <span className="text-slate-500">{new Date(it.time).toLocaleString()}</span>
        </li>
      ))}
      <div className="text-right text-xs text-slate-500">
        <Link href="/admin/submissions" className="underline">View all</Link>
      </div>
    </ul>
  )
}

function KpiSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-morphism ring-1 ring-slate-200/60 rounded-lg p-4">
          <div className="h-5 w-24 bg-slate-100 rounded mb-3 animate-pulse" />
          <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}
