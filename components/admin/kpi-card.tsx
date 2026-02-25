"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type KpiCardProps = {
  title: string
  value: string | number
  change?: { value: string; trend: "up" | "down" | "flat"; label?: string }
  icon?: ReactNode
  accent?: string
}

export function KpiCard({ title, value, change, icon, accent = "cyan" }: KpiCardProps) {
  const ring = `ring-1 ring-${accent}-200/60`
  const text = `text-${accent}-700`
  const badgeBg = change?.trend === "up" ? "bg-emerald-100 text-emerald-700" : change?.trend === "down" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
  return (
    <Card className={`glass-morphism ${ring}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-3xl font-bold ${text}`}>{value}</div>
        {change && (
          <div className={`mt-2 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs ${badgeBg}`}>
            <span>{change.value}</span>
            {change.label && <span className="text-slate-500">{change.label}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
