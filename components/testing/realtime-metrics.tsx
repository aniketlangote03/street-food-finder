"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Activity, Wifi, Database, Zap, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ConnectionMetrics {
  websocket: {
    status: "connected" | "disconnected" | "connecting"
    latency: number
    uptime: number
    reconnects: number
  }
  database: {
    status: "connected" | "disconnected" | "error"
    queryTime: number
    activeConnections: number
    errorRate: number
  }
  realtime: {
    status: "active" | "inactive" | "error"
    subscriptions: number
    messagesPerSecond: number
    lastUpdate: Date
  }
}

interface PerformanceMetrics {
  updateFrequency: number
  dataAccuracy: number
  systemLoad: number
  memoryUsage: number
}

export default function RealtimeMetrics() {
  const [connectionMetrics, setConnectionMetrics] = useState<ConnectionMetrics>({
    websocket: {
      status: "connected",
      latency: 45,
      uptime: 98.5,
      reconnects: 2,
    },
    database: {
      status: "connected",
      queryTime: 120,
      activeConnections: 15,
      errorRate: 0.1,
    },
    realtime: {
      status: "active",
      subscriptions: 8,
      messagesPerSecond: 12,
      lastUpdate: new Date(),
    },
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    updateFrequency: 95,
    dataAccuracy: 99.2,
    systemLoad: 65,
    memoryUsage: 42,
  })

  const [connectionStatus, setConnectionStatus] = useState("Connected")
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsageState, setMemoryUsageState] = useState(0)
  const [networkLatency, setNetworkLatency] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionMetrics((prev) => ({
        websocket: {
          ...prev.websocket,
          latency: Math.max(20, prev.websocket.latency + (Math.random() - 0.5) * 10),
          uptime: Math.min(100, prev.websocket.uptime + (Math.random() - 0.3) * 0.1),
        },
        database: {
          ...prev.database,
          queryTime: Math.max(50, prev.database.queryTime + (Math.random() - 0.5) * 20),
          activeConnections: Math.max(5, prev.database.activeConnections + Math.floor((Math.random() - 0.5) * 3)),
          errorRate: Math.max(0, prev.database.errorRate + (Math.random() - 0.7) * 0.05),
        },
        realtime: {
          ...prev.realtime,
          messagesPerSecond: Math.max(0, prev.realtime.messagesPerSecond + Math.floor((Math.random() - 0.5) * 5)),
          subscriptions: Math.max(1, prev.realtime.subscriptions + Math.floor((Math.random() - 0.5) * 2)),
          lastUpdate: new Date(),
        },
      }))

      setPerformanceMetrics((prev) => ({
        updateFrequency: Math.max(80, Math.min(100, prev.updateFrequency + (Math.random() - 0.5) * 2)),
        dataAccuracy: Math.max(95, Math.min(100, prev.dataAccuracy + (Math.random() - 0.5) * 0.5)),
        systemLoad: Math.max(30, Math.min(90, prev.systemLoad + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 3)),
      }))

      setCpuUsage(Math.floor(Math.random() * 100))
      setMemoryUsageState(Math.floor(Math.random() * 100))
      setNetworkLatency(Math.floor(Math.random() * 100) + 20) // 20-120ms

      if (Math.random() < 0.02) {
        // Simulate occasional connection drop
        setConnectionStatus("Disconnected")
        toast({
          title: "Connection Lost",
          description: "Simulated network disconnection.",
          variant: "destructive",
        })
        setTimeout(() => {
          setConnectionStatus("Reconnecting...")
          setTimeout(() => {
            setConnectionStatus("Connected")
            toast({
              title: "Connection Restored",
              description: "Simulated network reconnected.",
            })
          }, 2000)
        }, 3000)
      }
    }, 1500)

    return () => {
      clearInterval(interval)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "connecting":
      case "error":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return "default"
      case "disconnected":
      case "inactive":
      case "error":
        return "destructive"
      case "connecting":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPerformanceColor = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return "text-green-600"
    if (value >= threshold.warning) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Real-time Performance Metrics</h3>

      {/* Connection Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              WebSocket Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionMetrics.websocket.status)}
                <Badge variant={getStatusColor(connectionMetrics.websocket.status) as any}>
                  {connectionMetrics.websocket.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Latency</span>
              <span className="font-medium">{Math.round(connectionMetrics.websocket.latency)}ms</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="font-medium">{connectionMetrics.websocket.uptime.toFixed(1)}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Reconnects</span>
              <span className="font-medium">{connectionMetrics.websocket.reconnects}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionMetrics.database.status)}
                <Badge variant={getStatusColor(connectionMetrics.database.status) as any}>
                  {connectionMetrics.database.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Query Time</span>
              <span className="font-medium">{Math.round(connectionMetrics.database.queryTime)}ms</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Active Connections</span>
              <span className="font-medium">{connectionMetrics.database.activeConnections}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="font-medium">{connectionMetrics.database.errorRate.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Realtime Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(connectionMetrics.realtime.status)}
                <Badge variant={getStatusColor(connectionMetrics.realtime.status) as any}>
                  {connectionMetrics.realtime.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Messages/sec</span>
              <span className="font-medium">{connectionMetrics.realtime.messagesPerSecond}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Subscriptions</span>
              <span className="font-medium">{connectionMetrics.realtime.subscriptions}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <span className="font-medium text-xs">{connectionMetrics.realtime.lastUpdate.toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Performance
          </CardTitle>
          <CardDescription>Real-time system health and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Update Frequency</span>
                <span
                  className={`font-bold ${getPerformanceColor(performanceMetrics.updateFrequency, { good: 90, warning: 80 })}`}
                >
                  {performanceMetrics.updateFrequency.toFixed(1)}%
                </span>
              </div>
              <Progress value={performanceMetrics.updateFrequency} className="h-2" />
              <p className="text-xs text-gray-600">Real-time update reliability</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Accuracy</span>
                <span
                  className={`font-bold ${getPerformanceColor(performanceMetrics.dataAccuracy, { good: 98, warning: 95 })}`}
                >
                  {performanceMetrics.dataAccuracy.toFixed(1)}%
                </span>
              </div>
              <Progress value={performanceMetrics.dataAccuracy} className="h-2" />
              <p className="text-xs text-gray-600">Data synchronization accuracy</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Load</span>
                <span
                  className={`font-bold ${performanceMetrics.systemLoad > 80 ? "text-red-600" : performanceMetrics.systemLoad > 60 ? "text-yellow-600" : "text-green-600"}`}
                >
                  {performanceMetrics.systemLoad.toFixed(0)}%
                </span>
              </div>
              <Progress value={performanceMetrics.systemLoad} className="h-2" />
              <p className="text-xs text-gray-600">Current system utilization</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span
                  className={`font-bold ${memoryUsageState > 70 ? "text-red-600" : memoryUsageState > 50 ? "text-yellow-600" : "text-green-600"}`}
                >
                  {memoryUsageState.toFixed(0)}%
                </span>
              </div>
              <Progress value={memoryUsageState} className="h-2" />
              <p className="text-xs text-gray-600">Memory consumption</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connection Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">WebSocket</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{Math.round(connectionMetrics.websocket.latency)}ms</div>
                  <div className="text-xs text-gray-600">latency</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{Math.round(connectionMetrics.database.queryTime)}ms</div>
                  <div className="text-xs text-gray-600">query time</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium">Realtime</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{connectionMetrics.realtime.messagesPerSecond}/s</div>
                  <div className="text-xs text-gray-600">messages</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Health</span>
                <Badge variant="default" className="bg-green-500">
                  Excellent
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Active Monitoring</span>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Live</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Last Health Check</span>
                <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">{connectionMetrics.websocket.uptime.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Metrics</CardTitle>
          <CardDescription>Monitor system health and performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Connection Status:</Label>
            <p className={`mt-1 font-medium ${connectionStatus === "Connected" ? "text-green-500" : "text-red-500"}`}>
              {connectionStatus}
            </p>
          </div>
          <div>
            <Label>CPU Usage:</Label>
            <Progress value={cpuUsage} className="mt-1" />
            <p className="text-sm text-muted-foreground mt-1">{cpuUsage}%</p>
          </div>
          <div>
            <Label>Memory Usage:</Label>
            <Progress value={memoryUsageState} className="mt-1" />
            <p className="text-sm text-muted-foreground mt-1">{memoryUsageState}%</p>
          </div>
          <div>
            <Label>Network Latency:</Label>
            <Progress value={networkLatency > 100 ? 100 : networkLatency} className="mt-1" />
            <p className="text-sm text-muted-foreground mt-1">{networkLatency}ms</p>
          </div>
          <div>
            <Label>Live Diagnostics:</Label>
            <div className="mt-1 h-24 overflow-y-auto rounded-md border bg-muted p-2 text-sm">
              <p>[{new Date().toLocaleTimeString()}] System running normally.</p>
              {connectionStatus !== "Connected" && (
                <p className="text-red-500">[{new Date().toLocaleTimeString()}] Network issue detected!</p>
              )}
              <p>[{new Date().toLocaleTimeString()}] Data stream active.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
