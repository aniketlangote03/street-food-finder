"use client"

import { useEffect } from "react"
import { getMapsUrl, validateMapsConfig } from "@/lib/config/maps"

/**
 * Loads the Google Maps JavaScript API (with Places library) once per app.
 * Renders nothing.
 */
export function GoogleMapsLoader() {
  useEffect(() => {
    let mounted = true

    const ensureScript = async () => {
      try {
        validateMapsConfig()
      } catch (e) {
        // In development, don't crash the app – just skip loading
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Maps] Skipping load – missing API key")
        }
        return
      }

      if ((window as any).google?.maps) return

      const existing = document.querySelector(
        'script[data-gmaps="true"]'
      ) as HTMLScriptElement | null

      const script = existing ?? document.createElement("script")
      if (!existing) {
        script.src = getMapsUrl()
        script.async = true
        script.defer = true
        script.setAttribute("data-gmaps", "true")
        document.head.appendChild(script)
      }

      try {
        await new Promise<void>((resolve, reject) => {
          script.addEventListener("load", () => resolve(), { once: true })
          script.addEventListener(
            "error",
            () => reject(new Error("Failed to load Google Maps script")),
            { once: true }
          )
        })
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Maps] Google Maps script failed to load. Check API key and referrer restrictions.", err)
        } else {
          console.error("[Maps] Google Maps script failed to load.", err)
        }
        return
      }

      if (!mounted) return
    }

    ensureScript()

    return () => {
      mounted = false
    }
  }, [])

  return null
}
