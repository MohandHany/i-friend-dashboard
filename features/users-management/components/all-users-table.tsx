"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import VisibleIcon from "@/public/visible-icon"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { users } from "../data/mock-users"

export function AllUsersTable() {
  const [kidsFilter, setKidsFilter] = useState("")
  const [subscriptionFilters, setSubscriptionFilters] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const pathname = usePathname()

  const filteredUsers = users.filter((user) => {
    const matchesKids = kidsFilter ? user.kids.toString() === kidsFilter : true
    const matchesSubscription =
      subscriptionFilters.length > 0 ? subscriptionFilters.includes(user.subscription) : true

    let matchesDate = true
    if (dateFilter) {
      // Mock date format: "23 March,2024"
      // We need to handle the comma carefully or rely on Date parsing
      const userDate = new Date(user.date.replace(",", ", "))
      const filterDate = new Date(dateFilter)
      // Compare by locale date string or similar to ignore time
      matchesDate = userDate.toDateString() === filterDate.toDateString()
    }

    return matchesKids && matchesSubscription && matchesDate
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div>
      <Card className="w-full bg-white rounded-xl border">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <CardTitle className="text-black text-lg font-semibold grow-1 m-0">All Users</CardTitle>
          <div className="relative w-72 m-0">
            <SearchIcon className="absolute fill-natural right-2 top-1/2 -translate-y-1/2" />
            <Input placeholder="Search" className="pr-10 rounded-lg placeholder:text-natural-text" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 rounded-lg p-5">
                <FilterIcon className="!w-5.5 !h-5.5 fill-white" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="kids">Kids Count</Label>
                  <Input
                    id="kids"
                    type="number"
                    placeholder=""
                    value={kidsFilter}
                    onChange={(e) => setKidsFilter(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Subscription Status</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="active"
                      checked={subscriptionFilters.includes("Active")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSubscriptionFilters([...subscriptionFilters, "Active"])
                        } else {
                          setSubscriptionFilters(subscriptionFilters.filter((s) => s !== "Active"))
                        }
                      }}
                    />
                    <Label htmlFor="active" className="font-normal">
                      Active
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
                    <Label htmlFor="not-subscribed" className="font-normal">
                      Not Subscribed
                    </Label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Registration Date</Label>
                  <Input
                    id="date"
                    type="date"
                    className="flex justify-between"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setKidsFilter("")
                    setSubscriptionFilters([])
                    setDateFilter("")
                    setCurrentPage(1)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-light-natural">
              <TableRow>
                <TableHead className="w-[50px] text-center font-bold text-lg">#</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Kids
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Subscription
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Registration date
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center font-medium">{user.id}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.kids}</TableCell>
                  <TableCell>{user.subscription}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell className="text-right py-0">
                    <div className="flex items-center justify-center">
                      <Button asChild variant="ghost" className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1">
                        <Link href={`${pathname}/user-details/${user.id}`}>
                          <VisibleIcon className="!h-5 !w-5" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>
          <div className="flex items-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? "bg-gray-50" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}
    </div>
  )
}
