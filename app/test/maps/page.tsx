"use client"

import { useEffect, useState } from "react"
import { mapsConfig, getMapsUrl, validateMapsConfig } from "@/lib/config/maps"

export default function MapsDiagnosticsPage() {
	const [status, setStatus] = useState<{
		apiKeyPresent: boolean
		mapScriptLoaded: boolean
		placesAvailable: boolean
		error?: string
	}>({ apiKeyPresent: !!mapsConfig.apiKey, mapScriptLoaded: false, placesAvailable: false })

	useEffect(() => {
		let mounted = true
		let timeoutId: any

		const run = async () => {
			try {
				validateMapsConfig()
			} catch (e: any) {
				if (mounted) setStatus((s) => ({ ...s, error: e?.message || String(e) }))
				return
			}

			if (window.google?.maps) {
				if (!mounted) return
				setStatus((s) => ({ ...s, mapScriptLoaded: true, placesAvailable: !!window.google?.maps?.places }))
				return
			}

			const script = document.createElement("script")
			script.src = getMapsUrl()
			script.async = true
			script.defer = true
			script.onload = () => {
				if (!mounted) return
				setStatus((s) => ({ ...s, mapScriptLoaded: true, placesAvailable: !!window.google?.maps?.places }))
			}
			script.onerror = () => {
				if (!mounted) return
				setStatus((s) => ({ ...s, error: "Failed to load Google Maps script" }))
			}
			document.head.appendChild(script)

			timeoutId = setTimeout(() => {
				if (!mounted) return
				if (!window.google?.maps) setStatus((s) => ({ ...s, error: "Script timeout: Maps not available" }))
			}, 6000)
		}

		run()
		return () => {
			mounted = false
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [])

	return (
		<div className="container mx-auto p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Google Maps Diagnostics</h1>
			<div className="rounded-md border p-4 space-y-2 text-sm">
				<div>API key present: {String(status.apiKeyPresent)}</div>
				<div>Script loaded: {String(status.mapScriptLoaded)}</div>
				<div>Places available: {String(status.placesAvailable)}</div>
				{status.error && <div className="text-red-600">Error: {status.error}</div>}
				<div className="text-xs text-gray-500 break-all">Script URL: {getMapsUrl()}</div>
			</div>
			<div className="h-96 border rounded-md overflow-hidden">
				{status.mapScriptLoaded ? (
					<div id="map" className="w-full h-full" />
				) : (
					<iframe
						title="Map fallback"
						className="w-full h-full"
						src={`https://www.google.com/maps?q=${encodeURIComponent("street food near me")}&output=embed`}
					/>
				)}
			</div>
			<p className="text-sm text-gray-600">Open DevTools → Console and copy any Google Maps error code you see.</p>
		</div>
	)
}


