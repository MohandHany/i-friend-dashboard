"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import { Checkbox } from "@/components/ui/checkbox"

interface UsersFilterProps {
  searchTerm: string
  onSearchChange: (v: string) => void
  inviteesCount: string
  onInviteesCountChange: (v: string) => void
  subscriptionStatuses: string[]
  onSubscriptionStatusesChange: (v: string[]) => void
  registrationDate: string
  onRegistrationDateChange: (v: string) => void
  onReset: () => void
}

export function UsersFilter({
  searchTerm,
  onSearchChange,
  inviteesCount,
  onInviteesCountChange,
  subscriptionStatuses,
  onSubscriptionStatusesChange,
  registrationDate,
  onRegistrationDateChange,
  onReset,
}: UsersFilterProps) {

  const selectStatus = (status: string) => {
    if (subscriptionStatuses.includes(status)) {
      onSubscriptionStatusesChange([])
    } else {
      onSubscriptionStatusesChange([status])
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-end items-center gap-3 w-full md:w-auto">
      <div className="relative w-full md:w-72">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 fill-natural-text" />
        <Input
          placeholder="Search"
          className="pr-10 rounded-lg"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-primary-blue hover:bg-primary-blue-hover px-5 gap-2 h-10 shrink-0">
            <FilterIcon className="w-5! h-5! fill-white" />
            Filter
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-4" align="end">
          <div className="grid gap-4">
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label>Invitees Count</Label>
                <Input
                  type="number"
                  placeholder="e.g. 3"
                  value={inviteesCount}
                  onChange={(e) => onInviteesCountChange(e.target.value)}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label>Subscription Status</Label>
                <div className="flex flex-col gap-2 pt-1">
                  {["Subscribed", "Not Subscribed"].map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={subscriptionStatuses.includes(status)}
                        onCheckedChange={() => selectStatus(status)}
                      />
                      <Label htmlFor={`status-${status}`} className={`cursor-pointer text-sm ${status === "Subscribed" ? "text-success" : "text-danger"}`}>
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Input
                  type="date"
                  value={registrationDate}
                  onChange={(e) => onRegistrationDateChange(e.target.value)}
                />
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full text-natural-text hover:text-foreground"
              onClick={onReset}
            >
              Reset Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
