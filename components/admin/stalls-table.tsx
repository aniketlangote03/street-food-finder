"use client"

import { useState } from "react"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export type Stall = {
  id: string
  name: string | null
  created_at: string
  is_approved: boolean
  owner_id?: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function StallsTable() {
  const { data, isLoading, mutate } = useSWR<Stall[]>("/api/admin/stalls", fetcher)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")
  const stalls = (data || []).filter((s) => {
    const q = query.toLowerCase()
    const name = (s.name || "").toLowerCase()
    const matches = name.includes(q) || s.id.toLowerCase().includes(q)
    const statusOk =
      filter === "all" || (filter === "approved" ? s.is_approved : !s.is_approved)
    return matches && statusOk
  })

  async function setApproval(id: string, approve: boolean) {
    const res = await fetch(`/api/admin/stalls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: approve }),
    })
    if (!res.ok) {
      console.error("Failed to update stall status")
    }
    mutate()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search stalls by name or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {(["all", "approved", "pending"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell>
                    <div className="h-4 w-40 bg-slate-100 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 bg-slate-100 rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-slate-100 rounded" />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
            {!isLoading &&
              stalls.map((stall, idx) => (
                <motion.tr
                  key={stall.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                >
                  <TableCell>
                    <div className="font-medium text-gray-900">{stall.name || "Untitled"}</div>
                    <div className="text-xs text-gray-500">{stall.id}</div>
                  </TableCell>
                  <TableCell>
                    {stall.is_approved ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Approved</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(stall.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {!stall.is_approved ? (
                      <Button size="sm" onClick={() => setApproval(stall.id, true)}>
                        Approve
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setApproval(stall.id, false)}>
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
