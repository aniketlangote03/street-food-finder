"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Submission = {
	id: string
	name: string
	description: string
	cuisine_type: string
	is_approved: boolean
	created_at: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminPendingSubmissions() {
	const { data, isLoading, mutate } = useSWR<Submission[]>("/api/admin/stalls", fetcher)
	const submissions = (data || []).filter((s) => !s.is_approved)

	const act = async (id: string, action: "approve" | "reject") => {
		await fetch(`/api/admin/stalls/${id}/${action}`, { method: "POST" })
		mutate()
	}

	if (isLoading) return <div className="text-sm text-gray-600">Loading...</div>
	if (!submissions.length) return <div className="text-sm text-gray-600">No pending submissions.</div>

	return (
		<div className="space-y-3">
			{submissions.map((s) => (
				<div key={s.id} className="flex items-center justify-between border rounded-md p-3">
					<div>
						<div className="font-medium">{s.name}</div>
						<div className="text-xs text-gray-600">{s.cuisine_type}</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary">Submitted {new Date(s.created_at).toLocaleDateString()}</Badge>
						<Button size="sm" onClick={() => act(s.id, "approve")}>Approve</Button>
						<Button size="sm" variant="outline" onClick={() => act(s.id, "reject")}>Reject</Button>
					</div>
				</div>
			))}
		</div>
	)
}

export function AdminQuickStats() {
	const { data } = useSWR<Submission[]>("/api/admin/stalls", fetcher)
	const pending = (data || []).filter((s) => !s.is_approved).length
	const total = (data || []).length
	return (
		<div className="grid grid-cols-2 gap-4 text-sm">
			<div className="p-3 rounded-md bg-cyan-50">Total stalls: {total}</div>
			<div className="p-3 rounded-md bg-amber-50">Pending approvals: {pending}</div>
		</div>
	)
}



