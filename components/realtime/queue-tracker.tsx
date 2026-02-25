"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Users, Clock, UtensilsCrossed } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react" // Import Loader2

interface StallQueueData {
  stall_id: string
  stall_name: string
  current_queue_length: number
  estimated_wait: number
  busy_level: string
  last_updated: string
}

export function QueueTracker() {
  const [queueData, setQueueData] = useState<StallQueueData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const channelRef = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from("stalls")
        .select("id, name, current_queue_length, estimated_wait, busy_level, updated_at")
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching initial queue data:", error)
        setError("Failed to load queue data.")
      } else {
        setQueueData(
          data.map((s: any) => ({
            stall_id: s.id,
            stall_name: s.name,
            current_queue_length: s.current_queue_length || 0,
            estimated_wait: s.estimated_wait || 0,
            busy_level: s.busy_level || "low",
            last_updated: s.updated_at || new Date().toISOString(),
          })),
        )
      }
      setLoading(false)
    }

    fetchInitialData()

    // Subscribe to real-time changes on the 'stalls' table for queue updates
    const channel = supabase
      .channel("queue_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "stalls",
        },
        (payload: any) => {
          console.log("Queue update received:", payload)
          const updatedStall = payload.new as any
          setQueueData((prev) =>
            prev.map((stall) =>
              stall.stall_id === updatedStall.id
                ? {
                    ...stall,
                    current_queue_length: updatedStall.current_queue_length,
                    estimated_wait: updatedStall.estimated_wait,
                    busy_level: updatedStall.busy_level,
                    last_updated: updatedStall.updated_at || new Date().toISOString(),
                  }
                : stall,
            ),
          )
        },
      )
      .subscribe()

    channelRef[0] = channel // Store channel in ref

    return () => {
      if (channelRef[0]) {
        supabase.removeChannel(channelRef[0])
      }
    }
  }, [supabase, channelRef])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Queue Tracker</CardTitle>
          <CardDescription>Real-time queue lengths and wait times.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading queue data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Queue Tracker</CardTitle>
          <CardDescription>Real-time queue lengths and wait times.</CardDescription>
        </CardHeader>
        <CardContent className="text-red-500">{error}</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Queue Tracker</CardTitle>
        <CardDescription>Real-time queue lengths and wait times for active stalls.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {queueData.length === 0 ? (
          <p className="text-muted-foreground">No active stalls with queue data.</p>
        ) : (
          queueData.map((stall) => (
            <div key={stall.stall_id} className="border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                  {stall.stall_name}
                </h4>
                <span
                  className={`text-sm font-medium capitalize ${
                    stall.busy_level === "high"
                      ? "text-red-500"
                      : stall.busy_level === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {stall.busy_level}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <Label>Current Queue:</Label>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{stall.current_queue_length} people</span>
                  </div>
                </div>
                <Progress value={(stall.current_queue_length / 10) * 100} className="h-2" />{" "}
                {/* Max queue 10 for progress */}
                <div className="flex items-center justify-between text-sm">
                  <Label>Estimated Wait:</Label>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{stall.estimated_wait} min</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                Last updated: {new Date(stall.last_updated).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
