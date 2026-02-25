"use client"

import { Suspense, useEffect, useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import RealtimeTestDashboard from "@/components/testing/realtime-test-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, Users, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface RealtimeData {
  id: string
  value: number
  timestamp: string
}

function TestPageContent() {
  const [data, setData] = useState<RealtimeData[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to a channel
    const newChannel = supabase
      .channel("realtime_test_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "realtime_data" },
        (payload: any) => {
        console.log("Change received!", payload)
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          setData((prevData) => {
            const existingIndex = prevData.findIndex((item) => item.id === payload.new.id)
            if (existingIndex > -1) {
              // Update existing item
              const newData = [...prevData]
              newData[existingIndex] = payload.new as RealtimeData
              return newData
            } else {
              // Add new item
              return [...prevData, payload.new as RealtimeData]
            }
          })
        } else if (payload.eventType === "DELETE") {
          setData((prevData) => prevData.filter((item) => item.id !== payload.old.id))
        }
        },
      )
      .subscribe()

    setChannel(newChannel)

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, channel])

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Real-time Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Test and monitor live updates, queue tracking, and real-time functionality
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-semibold">Live Updates</div>
                  <div className="text-sm text-muted-foreground">Real-time stall status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-semibold">Queue Tracking</div>
                  <div className="text-sm text-muted-foreground">Live queue monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="font-semibold">Wait Times</div>
                  <div className="text-sm text-muted-foreground">Dynamic estimates</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="font-semibold">Test Scenarios</div>
                  <div className="text-sm text-muted-foreground">Automated testing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Real-time Connection Active</span>
          </div>
          <Badge variant="outline" className="bg-transparent">
            WebSocket Connected
          </Badge>
          <Badge variant="outline" className="bg-transparent">
            Supabase Realtime
          </Badge>
          <Badge variant="outline" className="bg-transparent">
            Test Mode
          </Badge>
        </div>

        {/* Test Dashboard */}
        <RealtimeTestDashboard />

        {/* Real-time Data Feed */}
        <div className="p-4 mt-8">
          <h1 className="text-2xl font-bold mb-4">Real-time Data Feed</h1>
          <div className="space-y-2">
            {data.length === 0 ? (
              <p className="text-muted-foreground">No real-time data yet. Trigger a simulation!</p>
            ) : (
              data.map((item) => (
                <div key={item.id} className="border p-2 rounded-md">
                  <p>
                    ID: {item.id}, Value: {item.value}, Timestamp: {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">How to Test:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Select a test scenario from the cards above</li>
                  <li>Click "Run Test" to start the simulation</li>
                  <li>Watch the Live Status Monitor for real-time updates</li>
                  <li>Check the Test Results Log for detailed feedback</li>
                  <li>Monitor the Real-time Statistics for overall metrics</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What's Being Tested:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Stall status changes (open/closed)</li>
                  <li>Queue length updates</li>
                  <li>Wait time calculations</li>
                  <li>Busy level indicators</li>
                  <li>Real-time data synchronization</li>
                  <li>UI responsiveness to data changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ClientPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading real-time test suite...</p>
          </div>
        </div>
      }
    >
      <TestPageContent />
    </Suspense>
  )
}
