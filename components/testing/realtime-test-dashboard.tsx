"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Activity, Users, Clock, CheckCircle, XCircle, AlertCircle, Wifi } from "lucide-react"
import { QueueSimulation } from "./queue-simulation"
import RealtimeMetrics from "./realtime-metrics"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface TestScenario {
  id: string
  name: string
  description: string
  duration: number
  steps: string[]
}

interface TestResult {
  id: string
  scenario: string
  status: "running" | "passed" | "failed"
  startTime: Date
  endTime?: Date
  logs: string[]
}

interface StallStatus {
  id: string
  name: string
  isOpen: boolean
  queueLength: number
  estimatedWait: number
  busyLevel: "low" | "medium" | "high"
  lastUpdate: Date
}

const testScenarios: TestScenario[] = [
  {
    id: "rush-hour",
    name: "Rush Hour Simulation",
    description: "Simulate busy lunch period with increasing queues",
    duration: 30000, // 30 seconds
    steps: [
      "Initialize stalls with normal queue levels",
      "Gradually increase customer arrivals",
      "Update queue lengths and wait times",
      "Test busy level calculations",
      "Verify real-time updates",
    ],
  },
  {
    id: "closing-time",
    name: "Closing Time Scenario",
    description: "Test stall closures and queue clearing",
    duration: 20000, // 20 seconds
    steps: [
      "Start with open stalls and active queues",
      "Begin closing stalls one by one",
      "Clear remaining queues",
      "Update stall statuses",
      "Verify closure notifications",
    ],
  },
  {
    id: "new-stall",
    name: "New Stall Opening",
    description: "Test new stall activation and first customers",
    duration: 25000, // 25 seconds
    steps: [
      "Add new stall to system",
      "Set initial status as closed",
      "Open stall for business",
      "Simulate first customers arriving",
      "Track initial queue formation",
    ],
  },
]

export default function RealtimeTestDashboard() {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [stallStatuses, setStallStatuses] = useState<StallStatus[]>([])
  const [connectionStatus, setConnectionStatus] = useState({
    websocket: false,
    database: false,
    realtime: false,
  })
  const [simulationStatus, setSimulationStatus] = useState("Idle")
  const [log, setLog] = useState<string[]>([])
  const { toast } = useToast()

  // Initialize mock stall data
  useEffect(() => {
    const mockStalls: StallStatus[] = [
      {
        id: "1",
        name: "Spicy Noodle House",
        isOpen: true,
        queueLength: 5,
        estimatedWait: 15,
        busyLevel: "medium",
        lastUpdate: new Date(),
      },
      {
        id: "2",
        name: "BBQ Pit Stop",
        isOpen: false,
        queueLength: 0,
        estimatedWait: 0,
        busyLevel: "low",
        lastUpdate: new Date(),
      },
      {
        id: "3",
        name: "Vegan Delights",
        isOpen: true,
        queueLength: 8,
        estimatedWait: 25,
        busyLevel: "high",
        lastUpdate: new Date(),
      },
    ]
    setStallStatuses(mockStalls)

    // Simulate connection status
    setConnectionStatus({
      websocket: true,
      database: true,
      realtime: true,
    })
  }, [])

  const runTestScenario = useCallback(async (scenarioId: string) => {
    const scenario = testScenarios.find((s) => s.id === scenarioId)
    if (!scenario) return

    setActiveTest(scenarioId)

    const testResult: TestResult = {
      id: Date.now().toString(),
      scenario: scenario.name,
      status: "running",
      startTime: new Date(),
      logs: [`Starting ${scenario.name}...`],
    }

    setTestResults((prev) => [testResult, ...prev])

    try {
      // Simulate test execution
      for (let i = 0; i < scenario.steps.length; i++) {
        const step = scenario.steps[i]

        // Update test logs
        setTestResults((prev) =>
          prev.map((result) =>
            result.id === testResult.id ? { ...result, logs: [...result.logs, `Step ${i + 1}: ${step}`] } : result,
          ),
        )

        // Simulate step execution time
        await new Promise((resolve) => setTimeout(resolve, scenario.duration / scenario.steps.length))

        // Update stall statuses based on scenario
        if (scenarioId === "rush-hour") {
          setStallStatuses((prev) =>
            prev.map((stall) => ({
              ...stall,
              queueLength: Math.min(stall.queueLength + Math.floor(Math.random() * 3), 15),
              estimatedWait: Math.min(stall.estimatedWait + Math.floor(Math.random() * 5), 45),
              busyLevel: stall.queueLength > 8 ? "high" : stall.queueLength > 4 ? "medium" : "low",
              lastUpdate: new Date(),
            })),
          )
        } else if (scenarioId === "closing-time") {
          setStallStatuses((prev) =>
            prev.map((stall, index) => ({
              ...stall,
              isOpen: index > i ? false : stall.isOpen,
              queueLength: index > i ? 0 : Math.max(stall.queueLength - 2, 0),
              estimatedWait: index > i ? 0 : Math.max(stall.estimatedWait - 5, 0),
              busyLevel: "low",
              lastUpdate: new Date(),
            })),
          )
        }
      }

      // Mark test as passed
      setTestResults((prev) =>
        prev.map((result) =>
          result.id === testResult.id
            ? {
                ...result,
                status: "passed",
                endTime: new Date(),
                logs: [...result.logs, `✅ ${scenario.name} completed successfully`],
              }
            : result,
        ),
      )
    } catch (error) {
      // Mark test as failed
      setTestResults((prev) =>
        prev.map((result) =>
          result.id === testResult.id
            ? {
                ...result,
                status: "failed",
                endTime: new Date(),
                logs: [...result.logs, `❌ ${scenario.name} failed: ${error}`],
              }
            : result,
        ),
      )
    } finally {
      setActiveTest(null)
    }
  }, [])

  const resetTests = () => {
    setTestResults([])
    setActiveTest(null)
  }

  const runSimulation = async (type: string) => {
    setSimulationStatus(`Running ${type} simulation...`)
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Starting ${type} simulation.`])

    try {
      // Simulate API call to trigger backend simulation
      const response = await fetch("/api/test/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setSimulationStatus(`Simulation ${type} completed.`)
      setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${type} simulation finished: ${result.message}`])
      toast({
        title: "Simulation Complete",
        description: `${type} simulation ran successfully.`,
      })
    } catch (error: any) {
      setSimulationStatus(`Simulation ${type} failed.`)
      setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${type} simulation failed: ${error.message}`])
      toast({
        title: "Simulation Failed",
        description: `Error running ${type} simulation: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const getBusyLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Activity className="h-4 w-4 animate-spin" />
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus.websocket ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">WebSocket</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus.database ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">Database</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectionStatus.realtime ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">Realtime</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="simulation">Queue Simulation</TabsTrigger>
          <TabsTrigger value="metrics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Test Scenarios</h3>
            <Button onClick={resetTests} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Tests
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {testScenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader>
                  <CardTitle className="text-base">{scenario.name}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">Duration: {scenario.duration / 1000}s</div>
                    <Button
                      onClick={() => runTestScenario(scenario.id)}
                      disabled={activeTest === scenario.id}
                      className="w-full"
                    >
                      {activeTest === scenario.id ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium">{result.scenario}</span>
                        </div>
                        <Badge
                          variant={
                            result.status === "passed"
                              ? "default"
                              : result.status === "failed"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {result.logs.map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <h3 className="text-lg font-semibold">Live Stall Monitor</h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stallStatuses.map((stall) => (
              <Card key={stall.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{stall.name}</CardTitle>
                    <Badge variant={stall.isOpen ? "default" : "secondary"}>{stall.isOpen ? "Open" : "Closed"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Queue Length</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{stall.queueLength}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Wait Time</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{stall.estimatedWait}min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Busy Level</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getBusyLevelColor(stall.busyLevel)}`} />
                      <span className="font-medium capitalize">{stall.busyLevel}</span>
                    </div>
                  </div>

                  <Progress value={(stall.queueLength / 15) * 100} className="h-2" />

                  <div className="text-xs text-gray-500">Last update: {stall.lastUpdate.toLocaleTimeString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="simulation">
          <QueueSimulation />
        </TabsContent>

        <TabsContent value="metrics">
          <RealtimeMetrics />
        </TabsContent>
      </Tabs>

      {/* Simulation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Test Dashboard</CardTitle>
          <CardDescription>Simulate various scenarios to test real-time updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={() => runSimulation("rush_hour")}>Simulate Rush Hour</Button>
            <Button onClick={() => runSimulation("closing_time")}>Simulate Closing Time</Button>
            <Button onClick={() => runSimulation("new_stall")}>Simulate New Stall Opening</Button>
          </div>
          <div>
            <Label>Live Status:</Label>
            <Input readOnly value={simulationStatus} className="mt-1" />
          </div>
          <div>
            <Label>Test Results Log:</Label>
            <div className="mt-1 h-32 overflow-y-auto rounded-md border bg-muted p-2 text-sm">
              {log.length === 0 ? (
                <p className="text-muted-foreground">No logs yet.</p>
              ) : (
                log.map((entry, index) => <p key={index}>{entry}</p>)
              )}
            </div>
          </div>
          <div>
            <Label>Performance Stats:</Label>
            <div className="mt-1 rounded-md border bg-muted p-2 text-sm">
              <p>Latency: 50ms (simulated)</p>
              <p>Updates/sec: 10 (simulated)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
