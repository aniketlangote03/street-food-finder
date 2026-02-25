// This file is likely deprecated or a duplicate of components/public/stall-grid.tsx
// Keeping it for completeness based on previous context, but consider consolidating.
import type { Stall } from "@/types"
import { StallCard } from "@/components/stall-card" // Using the generic StallCard
import { EmptyState } from "@/components/shared/empty-state"

interface StallGridProps {
  stalls: Stall[]
}

export function StallGrid({ stalls }: StallGridProps) {
  if (!stalls || stalls.length === 0) {
    return (
      <EmptyState
        title="No Stalls Found"
        description="It looks like there are no street food stalls matching your criteria right now. Try adjusting your filters!"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stalls.map((stall) => (
        <StallCard key={stall.id} stall={stall} />
      ))}
    </div>
  )
}
