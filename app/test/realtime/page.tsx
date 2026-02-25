import RealtimeTestDashboard from "@/components/testing/realtime-test-dashboard"
import { QueueSimulation } from "@/components/testing/queue-simulation"
import RealtimeMetrics from "@/components/testing/realtime-metrics"
import { Separator } from "@/components/ui/separator"
import { getProfile } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RealtimeTestPage() {
  const profile = await getProfile()

  // Restrict access to admin or stall_owner roles
  if (!profile || (profile.role !== "admin" && profile.role !== "stall_owner")) {
    redirect("/login?message=You are not authorized to view this page.")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Real-time Test Dashboard</h2>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RealtimeTestDashboard />
        <QueueSimulation />
        <RealtimeMetrics />
      </div>
    </div>
  )
}
