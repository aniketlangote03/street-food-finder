"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

export function QueueSimulation() {
  const [arrivalRate, setArrivalRate] = useState(0.5) // customers per second
  const [serviceRate, setServiceRate] = useState(0.7) // customers per second
  const [queue, setQueue] = useState<string[]>([])
  const [servedCount, setServedCount] = useState(0)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const startSimulation = () => {
    if (simulationRunning) return

    setSimulationRunning(true)
    setQueue([])
    setServedCount(0)
    toast({
      title: "Queue Simulation Started",
      description: "Simulating customer arrivals and service.",
    })

    let customerId = 0
    intervalRef.current = setInterval(() => {
      // Simulate arrivals
      if (Math.random() < arrivalRate) {
        customerId++
        setQueue((prev) => [...prev, `Customer ${customerId}`])
      }

      // Simulate service
      if (queue.length > 0 && Math.random() < serviceRate) {
        setQueue((prev) => prev.slice(1))
        setServedCount((prev) => prev + 1)
      }
    }, 1000) // Run every second
  }

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSimulationRunning(false)
    toast({
      title: "Queue Simulation Stopped",
      description: "Simulation has ended.",
    })
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue Simulation</CardTitle>
        <CardDescription>Simulate customer queues at a food stall.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="arrival-rate">Arrival Rate (customers/sec)</Label>
          <Input
            id="arrival-rate"
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={arrivalRate}
            onChange={(e) => setArrivalRate(Number.parseFloat(e.target.value))}
            disabled={simulationRunning}
          />
        </div>
        <div>
          <Label htmlFor="service-rate">Service Rate (customers/sec)</Label>
          <Input
            id="service-rate"
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={serviceRate}
            onChange={(e) => setServiceRate(Number.parseFloat(e.target.value))}
            disabled={simulationRunning}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={startSimulation} disabled={simulationRunning} className="flex-1">
            Start Simulation
          </Button>
          <Button
            onClick={stopSimulation}
            disabled={!simulationRunning}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Stop Simulation
          </Button>
        </div>
        <div>
          <Label>Live Queue:</Label>
          <div className="mt-1 h-24 overflow-y-auto rounded-md border bg-muted p-2 text-sm">
            {queue.length === 0 ? (
              <p className="text-muted-foreground">Queue is empty.</p>
            ) : (
              queue.map((customer, index) => <p key={index}>{customer}</p>)
            )}
          </div>
        </div>
        <div>
          <Label>Customers Served:</Label>
          <Progress value={(servedCount / (servedCount + queue.length)) * 100 || 0} className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">{servedCount} customers served</p>
        </div>
        <div>
          <Label>Performance Metrics:</Label>
          <div className="mt-1 rounded-md border bg-muted p-2 text-sm">
            <p>Current Queue Length: {queue.length}</p>
            <p>Total Served: {servedCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
