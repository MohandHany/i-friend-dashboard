"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import SearchIcon from "@/public/search-icon"
import FilterIcon from "@/public/filter-icon"
import { getRevenuesFull, RevenueItem } from "@/services/queries/revenues/get/get-revenues-table-data"
import { cn } from "@/lib/utils"
import ArrowDownIcon from "@/public/arrow-down-icon"

const ITEMS_PER_PAGE = 5
const STATES_OPTIONS = ["ACTIVE", "CANCELED", "TRIALING"]

export function AllCustomersTable() {
  const [search, setSearch] = React.useState("")

  // Filters
  const [kidsCount, setKidsCount] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [selectedStates, setSelectedStates] = React.useState<string[]>([])

  const [page, setPage] = React.useState(1)
  const [revenues, setRevenues] = React.useState<RevenueItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getRevenuesFull()
        setRevenues(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = React.useMemo(() => {
    return revenues.filter((c) => {
      // Search
      if (search && !c.parentName.toLowerCase().includes(search.toLowerCase())) return false

      // Kids Count
      if (kidsCount !== "") {
        const count = Number(kidsCount)
        if (!isNaN(count) && c.totalChildrenAssigned !== count) return false
      }

      // States
      if (selectedStates.length > 0) {
        if (!selectedStates.includes(c.states)) return false
      }

      // Start Date
      if (startDate) {
        const filterD = new Date(startDate)
        const d = new Date(c.startDate)
        if (
          d.getFullYear() !== filterD.getFullYear() ||
          d.getMonth() !== filterD.getMonth() ||
          d.getDate() !== filterD.getDate()
        ) {
          return false
        }
      }

      // End Date
      if (endDate) {
        if (!c.endDate) return false // if filtering by end date but customer has none
        const filterD = new Date(endDate)
        const d = new Date(c.endDate)
        if (
          d.getFullYear() !== filterD.getFullYear() ||
          d.getMonth() !== filterD.getMonth() ||
          d.getDate() !== filterD.getDate()
        ) {
          return false
        }
      }

      return true
    })
  }, [revenues, search, kidsCount, selectedStates, startDate, endDate])

  React.useEffect(() => { setPage(1) }, [search, kidsCount, selectedStates, startDate, endDate])

  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const toggleState = (s: string) => {
    setSelectedStates(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const resetFilters = () => {
    setKidsCount("")
    setStartDate("")
    setEndDate("")
    setSelectedStates([])
    setPage(1)
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <h2 className="text-lg font-medium mb-0">All Customer</h2>
          <div className="flex gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by customer name"
                className="pr-10 rounded-lg placeholder:text-natural-text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover p-5 gap-2 shrink-0">
                  <FilterIcon className="w-5.5! h-5.5! fill-white" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="end">
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <Label>Kids Count</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 2"
                        value={kidsCount}
                        onChange={(e) => setKidsCount(e.target.value)}
                        min={0}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>States</Label>
                      <div className="flex flex-col gap-2 pt-1">
                        {STATES_OPTIONS.map((s) => (
                          <div key={s} className="flex items-center gap-2">
                            <Checkbox
                              id={`state-${s}`}
                              checked={selectedStates.includes(s)}
                              onCheckedChange={() => toggleState(s)}
                            />
                            <Label
                              htmlFor={`state-${s}`}
                              className={cn(
                                "cursor-pointer text-sm capitalize",
                                s === "ACTIVE" && "text-success",
                                s === "CANCELED" && "text-danger",
                                s === "TRIALING" && "text-primary-blue"
                              )}
                            >
                              {s.toLowerCase()}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full text-natural-text hover:text-foreground"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-light-natural border-none">
                <TableHead className="text-natural-text font-bold text-center">#</TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Customer Name <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Package <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Kids Count <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Start Date <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    End Date <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Amount <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Subscription State <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-natural-text">
                  <div className="flex items-center gap-1">
                    Period <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-natural-text">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-natural-text">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((customer, index) => (
                  <TableRow key={customer.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center">
                      {(page - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>{customer.parentName}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm capitalize text-natural-text bg-natural-text/10`}>
                        {customer.packageName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{customer.totalChildrenAssigned}</TableCell>
                    <TableCell>
                      {new Date(customer.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {customer.endDate ? new Date(customer.endDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      {customer.amount} EGP
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm capitalize",
                          customer.states === "ACTIVE" && "text-success bg-success/10",
                          customer.states === "CANCELED" && "text-danger bg-danger/10",
                          customer.states === "TRIALING" && "text-primary-blue bg-primary-blue/10"
                        )}
                      >
                        {customer.states.toLowerCase()}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {customer.period.toLowerCase().replace("_", " ")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

      </Card>

      {/* Pagination */}
      {
        pageCount > 1 && (
          <div className="flex items-center justify-between py-4">
            <Button
              variant="outline"
              className="gap-2 group"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
              Previous
            </Button>

            <div className="flex items-center gap-2 text-sm">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "outline" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${page === p ? "bg-gray-50" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              className="gap-2 group"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              Next
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Button>
          </div>
        )
      }
    </>
  )
}
