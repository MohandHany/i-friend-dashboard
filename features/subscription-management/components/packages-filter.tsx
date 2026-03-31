"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import SearchIcon from "@/public/search-icon"

interface PackagesFilterProps {
  search: string
  onSearchChange: (value: string) => void
}

export function PackagesFilter({ search, onSearchChange }: PackagesFilterProps) {
  return (
    <Card className="flex gap-4 bg-white p-4 border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
      <div className="relative w-full sm:w-80">
        <SearchIcon className="absolute fill-natural-text right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
        <Input
          placeholder="Search"
          className="pr-10 rounded-lg h-11 placeholder:text-natural-text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </Card>
  )
}
