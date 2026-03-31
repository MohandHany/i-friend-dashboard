"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import { Star } from "lucide-react"

import { RatingValue } from "@/services/queries/feedback/get/get-all-feedbacks"

interface FeedbackFilterProps {
  search: string
  onSearchChange: (value: string) => void
  ratingFilter: RatingValue | null
  onRatingFilterChange: (value: RatingValue | null) => void
  totalCount: number
}

const ratingOptions: { value: RatingValue, label: string, stars: number }[] = [
  { value: "EXCELLENT", label: "Excellent", stars: 5 },
  { value: "VERY_GOOD", label: "Very Good", stars: 4 },
  { value: "GOOD", label: "Good", stars: 3 },
  { value: "FAIR", label: "Fair", stars: 2 },
  { value: "BAD", label: "Bad", stars: 1 },
];

export function FeedbackFilter({
  search,
  onSearchChange,
  ratingFilter,
  onRatingFilterChange,
  totalCount,
}: FeedbackFilterProps) {
  return (
    <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white">
      <div className="flex items-center gap-3 mb-0">
        <h2 className="text-lg font-medium">All Feedback</h2>
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-sm font-medium">
          {totalCount}
        </span>
      </div>

      <div className="flex flex-row justify-end items-center gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search"
            className="pr-10 rounded-lg"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              className="bg-primary-blue hover:bg-primary-blue-hover p-5 gap-2"
            >
              <FilterIcon className="w-5.5! h-5.5! fill-white" />
              <span className="hidden sm:block">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-4" align="end">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium mb-2">Filter by Rating</Label>
                <div className="flex flex-col gap-2">
                  {ratingOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      className={`justify-between gap-2 h-9 px-2 ${ratingFilter === option.value ? "bg-primary-blue/10 text-primary-blue" : ""
                        }`}
                      onClick={() => onRatingFilterChange(ratingFilter === option.value ? null : option.value)}
                    >
                      <span className="text-sm font-normal text-natural-text">{option.label}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: option.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                        ))}
                      </div>
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="text-natural-text mt-2"
                    onClick={() => onRatingFilterChange(null)}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </CardHeader>
  )
}
