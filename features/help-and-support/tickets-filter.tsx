"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { CardHeader } from "@/components/ui/card"
import SearchIcon from "@/public/search-icon"

interface TicketsFilterProps {
  search: string
  onSearchChange: (value: string) => void
  totalCount: number
}

export function TicketsFilter({ search, onSearchChange, totalCount }: TicketsFilterProps) {
  return (
    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
      <div className="flex items-center gap-3 mb-0">
        <h2 className="text-lg font-medium">Customers</h2>
        {totalCount > 0 && (
          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-sm font-medium">
            {totalCount}
          </span>
        )}
      </div>

      <div className="relative w-full sm:w-72 m-0">
        <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search"
          className="pr-10 rounded-lg placeholder:text-natural-text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </CardHeader>
  )
}
