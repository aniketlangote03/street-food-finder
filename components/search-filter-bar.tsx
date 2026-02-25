// This file is likely deprecated or a duplicate of components/public/search-filter-bar.tsx
// Keeping it for completeness based on previous context, but consider consolidating.
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal, Search } from "lucide-react"

export function SearchFilterBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleSearch = () => {
    console.log("Searching for:", searchTerm, "Cuisine:", cuisineFilter, "Status:", statusFilter)
    // Implement actual search logic here (e.g., API call, state update for stall grid)
  }

  const cuisines = ["All", "Mexican", "Asian", "American", "Italian", "Dessert"]
  const statuses = ["All", "Open", "Closed"]

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for stalls or dishes..."
          className="w-full pl-10 pr-4 py-2 rounded-md border focus:ring-2 focus:ring-orange-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Cuisine Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={cuisineFilter} onValueChange={setCuisineFilter}>
            {cuisines.map((cuisine) => (
              <DropdownMenuRadioItem key={cuisine} value={cuisine.toLowerCase()}>
                {cuisine}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
            {statuses.map((status) => (
              <DropdownMenuRadioItem key={status} value={status.toLowerCase()}>
                {status}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={handleSearch}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
      >
        Apply Filters
      </Button>
    </div>
  )
}
