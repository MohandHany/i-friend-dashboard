"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import DeleteIcon from "@/public/delete-icon"

interface TableFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  roles: string[]
  selectedRoles: string[]
  onToggleRole: (role: string) => void
  selectedCount: number
  onBulkDelete: () => void
}

export function UsersTableFilters({
  searchValue,
  onSearchChange,
  roles,
  selectedRoles,
  onToggleRole,
  selectedCount,
  onBulkDelete
}: TableFiltersProps) {
  return (
    <div className="w-full flex items-center justify-between gap-4 mb-0">
      <div className="w-full flex items-center gap-4">
        <div className="relative w-full sm:w-72 m-0">
          <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
          <Input
            id="search-users"
            name="search-users"
            type="search"
            placeholder="Search"
            className="pr-10 rounded-lg placeholder:text-natural-text focus:outline-none"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 p-5 mb-0">
              <FilterIcon className="w-5.5! h-5.5! fill-white" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-4" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none">Roles</h4>
                <div className="grid gap-2">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={() => onToggleRole(role)}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm text-natural-text cursor-pointer">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {selectedCount > 1 && (
        <Button
          variant="default"
          className={`bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-5 mb-0 ml-auto`}
          onClick={onBulkDelete}
        >
          <DeleteIcon className="w-5! h-5!" /> Delete Selected
        </Button>
      )}
    </div>
  )
}
