"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchIcon from "@/public/search-icon"
import DeleteIcon from "@/public/delete-icon"

interface RoleTableSearchProps {
  searchValue: string
  onSearchChange: (value: string) => void
  selectedCount: number
  onBulkDelete: () => void
}

export function RoleTableSearch({
  searchValue,
  onSearchChange,
  selectedCount,
  onBulkDelete
}: RoleTableSearchProps) {
  return (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="relative w-full sm:w-72 m-0">
        <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search"
          className="pr-10 rounded-lg placeholder:text-natural-text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {selectedCount > 1 && (
        <Button
          variant="default"
          className={`bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-5`}
          onClick={onBulkDelete}
        >
          <DeleteIcon className="h-5! w-5!" />
          <span className="hidden sm:inline">Delete Selected</span>
        </Button>
      )}
    </div>
  )
}
