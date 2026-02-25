import { StallCard } from "./stall-card"
import type { Stall } from "@/types"

interface StallGridProps {
  stalls: Stall[]
}

export function StallGrid({ stalls }: StallGridProps) {
  if (stalls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No food stalls found</h3>
        <p className="text-gray-500">Try adjusting your search filters or check back later for new stalls.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stalls.map((stall) => (
        <StallCard key={stall.id} stall={stall} />
      ))}
    </div>
  )
}
