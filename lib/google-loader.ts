// lib/google-loader.ts
let loaded = false;
let loadPromise: Promise<void> | null = null;

export function loadGoogleMaps(apiKey: string, libraries: string[] = ["places"]) {
  if (typeof window === "undefined") return Promise.reject(new Error("Window is undefined"));
  if (!apiKey) return Promise.reject(new Error("Google Maps API key is missing"));

  if (loaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-google-maps]`);
    if (existing) {
      existing.addEventListener("load", () => {
        loaded = true;
        resolve();
      });
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-google-maps", "true");
    const libs = libraries.length ? `&libraries=${libraries.join(",")}` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}${libs}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      loaded = true;
      resolve();
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return loadPromise;
}
