import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
