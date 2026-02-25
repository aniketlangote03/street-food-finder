"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/google-loader";

// Provide a minimal global declaration for the Google Maps JS API to avoid TS errors
declare const google: any;

type Stall = {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
};

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function OwnerMap({
  initialZoom = 15,
  nearbyRadiusKm = 3,
}: {
  initialZoom?: number;
  nearbyRadiusKm?: number;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMap = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const userPosRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const directionsRendererRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);

  // Optional: local file path you uploaded (per your request).
  // They asked to send a local path as file URL — here's an example variable you can adapt.
  // Use this if you want a custom marker icon stored locally; transform path to a public URL if needed.
  const uploadedFileUrl = "file:///mnt/data/e6effd9b-d27a-443f-b7b3-cea2b0946e07.png";

  useEffect(() => {
    let watcherId: number | null = null;
    let mounted = true;

    async function init() {
      try {
        await loadGoogleMaps(GOOGLE_API_KEY, ["places"]);

        if (!mapRef.current) throw new Error("Map container missing");

        // initialize map with a world center until we get location
        googleMap.current = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: initialZoom,
          mapTypeControl: false,
          streetViewControl: false,
        });

        directionsServiceRef.current = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
        });
        directionsRendererRef.current.setMap(googleMap.current);

        // Request user location and watch changes
        if ("geolocation" in navigator) {
          watcherId = navigator.geolocation.watchPosition(
            async (pos) => {
              if (!mounted) return;
              const lat = pos.coords.latitude;
              const lng = pos.coords.longitude;
              const latLng = { lat, lng };
              userPosRef.current = latLng;

              // set map center the first time
              if (googleMap.current && googleMap.current.getCenter()?.lat() === 0) {
                googleMap.current.setCenter(latLng);
              }

              // update or create user marker
              if (!userMarker.current) {
                userMarker.current = new google.maps.Marker({
                  position: latLng,
                  map: googleMap.current!,
                  title: "You",
                  optimized: false,
                });
                // add blue circle / accuracy
                new google.maps.Circle({
                  strokeColor: "#4ea5ff",
                  strokeOpacity: 0.6,
                  strokeWeight: 1,
                  fillColor: "#4ea5ff",
                  fillOpacity: 0.12,
                  map: googleMap.current!,
                  center: latLng,
                  radius: pos.coords.accuracy || 10,
                });
              } else {
                userMarker.current.setPosition(latLng);
              }

              // re-fetch nearby stalls when user moves > ~50m to avoid spam
              const prev = (userMarker.current?.getPosition() && {
                lat: userMarker.current!.getPosition()!.lat(),
                lng: userMarker.current!.getPosition()!.lng(),
              }) || null;

              // We'll fetch every time here (simple). Optimize by distance if you like.
              await fetchNearbyAndRender(lat, lng, nearbyRadiusKm);
              // If a stall is selected, recompute route
              if (selectedStall) {
                computeAndRenderRoute(selectedStall);
              }
            },
            (err) => {
              console.error("Geolocation error:", err);
              setError("Unable to get your location. Make sure location permission is allowed.");
            },
            {
              enableHighAccuracy: true,
              maximumAge: 5_000,
              timeout: 10_000,
            }
          );
        } else {
          setError("Geolocation is not available in this browser.");
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Map init error", err);
        setError(err?.message || String(err));
        setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
      if (watcherId !== null) navigator.geolocation.clearWatch(watcherId);
      // Clear markers & directions
      if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
      Object.values(markersRef.current).forEach((m) => m.setMap(null));
      markersRef.current = {};
      userMarker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNearbyAndRender(lat: number, lng: number, radiusKm: number) {
    try {
      // change this URL if your API signature differs:
      const res = await fetch(
        `/api/stalls/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radiusKm=${encodeURIComponent(radiusKm)}`
      );

      if (!res.ok) {
        const errTxt = await res.text();
        console.error("Nearby fetch failed:", errTxt);
        setError("Failed to fetch nearby stalls");
        return;
      }

      const data: Stall[] = await res.json();
      setStalls(data || []);

      // Clear previous markers
      Object.values(markersRef.current).forEach((m) => m.setMap(null));
      markersRef.current = {};

      if (!googleMap.current) return;

      data.forEach((stall) => {
        const pos = { lat: stall.latitude, lng: stall.longitude };
        const marker = new google.maps.Marker({
          position: pos,
          map: googleMap.current!,
          title: stall.name,
          // If you want a custom icon from your uploaded file (local path), you need to serve it
          // from a public URL. For now keep default marker or set icon if you have a public url.
          // icon: { url: "/markers/stall.png", scaledSize: new google.maps.Size(32,32) }
        });

        marker.addListener("click", () => {
          setSelectedStall(stall);
          // pan map and draw route
          googleMap.current!.panTo(pos);
          computeAndRenderRoute(stall);
          // open an InfoWindow
          const infowindow = new google.maps.InfoWindow({
            content: `
              <div style="min-width:160px">
                <strong>${escapeHtml(stall.name)}</strong>
                <div style="font-size:12px;color:#444">${escapeHtml(stall.description || "")}</div>
                <div style="margin-top:6px"><a href="/stall/${stall.id}">View</a></div>
              </div>`,
          });
          infowindow.open({ anchor: marker, map: googleMap.current });
        });

        markersRef.current[stall.id] = marker;
      });
    } catch (err) {
      console.error("fetchNearbyAndRender error", err);
      setError("Failed to fetch stalls");
    }
  }

  function computeAndRenderRoute(stall: Stall) {
    if (!userPosRef.current || !directionsServiceRef.current || !directionsRendererRef.current) {
      return;
    }
    const origin = userPosRef.current;
    const dest = { lat: stall.latitude, lng: stall.longitude };
    const travelMode = google.maps.TravelMode.WALKING; // or DRIVING depending on needs

    directionsServiceRef.current.route(
      {
        origin,
        destination: dest,
        travelMode,
        provideRouteAlternatives: false,
      },
      (result: any, status: string) => {
        if (status === "OK" && result) {
          directionsRendererRef.current!.setDirections(result);
        } else {
          console.warn("Directions request failed:", status);
        }
      }
    );
  }

  function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m] || m)
    );
  }

  return (
    <div className="w-full h-[72vh] md:h-[80vh] relative">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
          Loading map...
        </div>
      )}
      {error && (
        <div className="absolute z-30 top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {/* optional UI overlay */}
      <div className="absolute right-4 bottom-4 z-40 bg-white/90 p-3 rounded shadow space-y-2 w-72">
        <div className="text-sm font-medium">Nearby stalls ({stalls.length})</div>
        <div className="max-h-40 overflow-auto text-xs">
          {stalls.map((s) => (
            <div key={s.id} className="py-1 border-b last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  {s.description && <div className="text-gray-600 text-xs">{s.description}</div>}
                </div>
                <div>
                  <button
                    className="text-blue-600 underline text-xs"
                    onClick={() => {
                      // pan & compute route
                      if (markersRef.current[s.id]) {
                        googleMap.current!.panTo(markersRef.current[s.id].getPosition()!.toJSON());
                      }
                      setSelectedStall(s);
                      computeAndRenderRoute(s);
                    }}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          ))}
          {stalls.length === 0 && <div className="text-gray-500">No stalls nearby</div>}
        </div>
      </div>
    </div>
  );
}
