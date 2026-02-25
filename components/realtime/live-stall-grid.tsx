"use client"

import { Button } from "@/components/ui/button"

import { CardFooter } from "@/components/ui/card"

import { CardContent } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useRef } from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { LiveStallCard } from "@/components/realtime/live-stall-card"
import { EmptyState } from "@/components/shared/empty-state"
import type { Stall as LiveStall } from "@/types"

export function LiveStallGrid() {
  const [stalls, setStalls] = useState<LiveStall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const fetchInitialStalls = async () => {
      const { data, error } = await supabase
        .from("stalls")
        .select(
          `
          id,
          name,
          description,
          location_description,
          latitude,
          longitude,
          opening_time,
          closing_time,
          cuisine_type,
          image_url,
          status,
          average_rating,
          review_count,
          current_queue_length
        `,
        )
        .eq("is_approved", true)
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching initial stalls:", error)
        setError("Failed to load stalls.")
      } else {
        setStalls(data as LiveStall[])
      }
      setLoading(false)
    }

    fetchInitialStalls()

    // Set up real-time subscription
    const channel = supabase
      .channel("live_stalls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "stalls",
        },
        (payload: any) => {
          console.log("Realtime change received:", payload)
          if (payload.eventType === "INSERT") {
            setStalls((prev) => [...prev, payload.new as LiveStall])
          } else if (payload.eventType === "UPDATE") {
            setStalls((prev) => prev.map((stall) => (stall.id === payload.new.id ? (payload.new as LiveStall) : stall)))
          } else if (payload.eventType === "DELETE") {
            setStalls((prev) => prev.filter((stall) => stall.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-full flex flex-col animate-pulse">
            <div className="w-full h-48 bg-muted rounded-t-lg" />
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-3/4 mb-1" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent className="flex-1 text-sm text-muted-foreground">
              <div className="h-4 bg-muted rounded mb-1" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-sm">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-6 bg-muted rounded w-1/5" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Stalls"
        description={error}
        action={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    )
  }

  if (stalls.length === 0) {
    return (
      <EmptyState
        title="No Live Stalls Found"
        description="It looks like there are no street food stalls currently active. Check back later!"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stalls.map((stall) => (
        <LiveStallCard key={stall.id} stall={stall} />
      ))}
    </div>
  )
}
