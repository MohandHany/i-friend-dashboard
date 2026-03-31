"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import SearchIcon from "@/public/search-icon"
import FilterIcon from "@/public/filter-icon"
import ArrowDown2Icon from "@/public/arrow-down-2-icon"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const STATUS_OPTIONS = ["pending", "sent", "canceled", "failed", "processing"] as const

const TARGET_OPTIONS = ["parents", "children", "all"] as const

interface NotificationsFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilters: string[]
  onStatusFiltersChange: (value: string[]) => void
  targetFilters: string[]
  onTargetFiltersChange: (value: string[]) => void
}

export function NotificationsFilterBar({
  search,
  onSearchChange,
  statusFilters,
  onStatusFiltersChange,
  targetFilters,
  onTargetFiltersChange,
}: NotificationsFilterBarProps) {
  const [open, setOpen] = React.useState(false)

  const hasActiveFilters = targetFilters.length > 0 || statusFilters.length > 0

  const toggleTarget = (option: string) => {
    if (targetFilters.includes(option)) {
      onTargetFiltersChange(targetFilters.filter((f) => f !== option))
    } else {
      onTargetFiltersChange([...targetFilters, option])
    }
  }

  const toggleStatus = (option: string) => {
    const status = option.toUpperCase()
    if (statusFilters.includes(status)) {
      onStatusFiltersChange(statusFilters.filter((f) => f !== status))
    } else {
      onStatusFiltersChange([...statusFilters, status])
    }
  }

  return (
    <div className="flex gap-4 w-full">
      {/* Search by title */}
      <div className="relative w-full sm:w-72">
        <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search"
          className="pr-10 rounded-lg placeholder:text-natural-text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-primary-blue hover:bg-primary-blue-hover p-5 gap-2"
          >
            <FilterIcon className="w-5.5! h-5.5! fill-white" />
            <span className="hidden sm:block">Filter</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary-blue">
                {targetFilters.length + statusFilters.length}
              </span>
            )}
            <ArrowDown2Icon
              className={`h-4 w-4 transition-all duration-300 ${open ? "rotate-180" : ""}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 z-99999" align="start">
          <div className="flex flex-col gap-6">
            {/* Target Section */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">Target</span>
              <div className="flex flex-col gap-2">
                {TARGET_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`target-${option}`}
                      checked={targetFilters.includes(option)}
                      onCheckedChange={() => toggleTarget(option)}
                    />
                    <Label
                      htmlFor={`target-${option}`}
                      className="text-sm font-normal text-natural-text capitalize cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Section */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">Status</span>
              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <Checkbox
                      id={`stat-${option}`}
                      checked={statusFilters.includes(option.toUpperCase())}
                      onCheckedChange={() => toggleStatus(option)}
                    />
                    <Label
                      htmlFor={`stat-${option}`}
                      className="text-sm font-normal text-natural-text capitalize cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer / Reset */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="w-full text-natural-text"
                onClick={() => {
                  onTargetFiltersChange([])
                  onStatusFiltersChange([])
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
