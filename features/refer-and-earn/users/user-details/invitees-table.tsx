"use client"

import * as React from "react"
import { InviteeItem } from "@/services/queries/refer-and-earn/get/get-parent-details"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchIcon from "@/public/search-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"

const ITEMS_PER_PAGE = 10

interface InviteesTableProps {
  invitees: InviteeItem[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function InviteesTable({
  invitees,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: InviteesTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  // Debounce
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Client-side search filter
  const filteredInvitees = React.useMemo(() => {
    if (!debouncedSearch.trim()) return invitees
    const q = debouncedSearch.toLowerCase()
    return invitees.filter(i => i.fullName.toLowerCase().includes(q))
  }, [invitees, debouncedSearch])

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "...")[] = [1]
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex flex-col">
      <Card className="overflow-hidden shadow-none">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
          <h2 className="text-lg font-medium mb-0 text-nowrap">All Invitees</h2>
          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 fill-natural-text" />
            <Input
              placeholder="Search"
              className="pr-10 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 rounded-b-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-light-natural text-nowrap">
              <TableRow>
                <TableHead className="font-bold text-center w-12">#</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Email <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Subscription State <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Points <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Status <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="h-[60px] animate-pulse">
                    <TableCell colSpan={6} className="text-center">
                      <div className="h-4 bg-gray-100 rounded w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredInvitees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-natural-text">
                    No invitees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvitees.map((invitee, idx) => (
                  <TableRow
                    key={invitee.inviteeId}
                    className="text-nowrap border-b border-natural last:border-0 hover:bg-light-natural/50 transition-colors h-[60px]"
                  >
                    <TableCell className="text-center font-medium">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </TableCell>
                    <TableCell>{invitee.fullName}</TableCell>
                    <TableCell>{invitee.email}</TableCell>
                    <TableCell
                      className={invitee.isSubscribed ? "text-success" : "text-danger"}
                    >
                      {invitee.isSubscribed ? "Subscribed" : "Not Subscribed"}
                    </TableCell>
                    <TableCell>{invitee.points}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${invitee.status === "CONFIRMED" ? "text-success bg-success/10" : "text-warning bg-warning/10"}`}>
                        {invitee.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group transition-all disabled:opacity-40"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>

          <div className="flex items-center gap-1 text-sm">
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-natural-text">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "outline" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${currentPage === page ? "bg-gray-50 font-semibold" : "text-natural-text"}`}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            className="gap-2 group transition-all disabled:opacity-40"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}
    </div>
  )
}
