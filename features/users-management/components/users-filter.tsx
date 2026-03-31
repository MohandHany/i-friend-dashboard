"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"

type UsersFilterProps = {
  kidsFilter: string
  setKidsFilter: (value: string) => void
  subscriptionFilters: string[]
  setSubscriptionFilters: (value: string[]) => void
  dateFilter: string
  setDateFilter: (value: string) => void
  search: string
  setSearch: (value: string) => void
  onReset?: () => void
}

export function UsersFilter({
  kidsFilter,
  setKidsFilter,
  subscriptionFilters,
  setSubscriptionFilters,
  dateFilter,
  setDateFilter,
  search,
  setSearch,
  onReset,
}: UsersFilterProps) {
  return (
    <div className="flex justify-end items-center gap-2 w-full sm:w-fit">
      <div className="relative w-full sm:w-72 m-0">
        <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search"
          className="pr-10 rounded-lg placeholder:text-natural-text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 rounded-lg p-5">
            <FilterIcon className="w-5.5! h-5.5! fill-white" />
            <span className="hidden sm:block">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="kids" className="text-sm">Kids Count</Label>
              <Input
                id="kids"
                type="number"
                min={0}
                placeholder=""
                value={kidsFilter}
                onChange={(e) => setKidsFilter(e.target.value)}
              />
            </div>
            <div className="grid gap-2">  
              <Label className="text-sm">Subscription Status</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="subscribed"
                  checked={subscriptionFilters.includes("Subscribed")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSubscriptionFilters([...subscriptionFilters, "Subscribed"])
                    } else {
                      setSubscriptionFilters(subscriptionFilters.filter((s) => s !== "Subscribed"))
                    }
                  }}
                />
                <Label htmlFor="subscribed" className="text-success text-sm cursor-pointer">
                  Subscribed
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="not-subscribed"
                  checked={subscriptionFilters.includes("Not Subscribed")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSubscriptionFilters([...subscriptionFilters, "Not Subscribed"])
                    } else {
                      setSubscriptionFilters(subscriptionFilters.filter((s) => s !== "Not Subscribed"))
                    }
                  }}
                />
                <Label htmlFor="not-subscribed" className="text-danger text-sm cursor-pointer">
                  Not Subscribed
                </Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-sm">Registration Date</Label>
              <Input
                id="date"
                type="date"
                className="flex justify-between"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              className="text-natural-text"
              onClick={() => {
                if (onReset) {
                  onReset()
                } else {
                  setKidsFilter("")
                  setSubscriptionFilters([])
                  setDateFilter("")
                }
              }}
            >
              Reset Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

