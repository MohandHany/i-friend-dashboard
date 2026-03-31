"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import VisibleIcon from "@/public/visible-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import { UsersFilter } from "./users-filter"

interface User {
  id: string
  name: string
  invitees: number
  email: string
  subscription: string
  registrationDate: string
}

interface AllUsersProps {
  users: User[]
  startIndex: number
  searchTerm: string
  onSearchChange: (v: string) => void
  inviteesCount: string
  onInviteesCountChange: (v: string) => void
  subscriptionStatuses: string[]
  onSubscriptionStatusesChange: (v: string[]) => void
  registrationDate: string
  onRegistrationDateChange: (v: string) => void
  onResetFilters: () => void
  onView: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function AllUsersTable({
  users,
  startIndex,
  searchTerm,
  onSearchChange,
  inviteesCount,
  onInviteesCountChange,
  subscriptionStatuses,
  onSubscriptionStatusesChange,
  registrationDate,
  onRegistrationDateChange,
  onResetFilters,
  onView,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: AllUsersProps) {

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | "...")[] = []
    pages.push(1)
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
          <h2 className="text-lg font-medium mb-0 text-nowrap">All Users</h2>
          <UsersFilter
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            inviteesCount={inviteesCount}
            onInviteesCountChange={onInviteesCountChange}
            subscriptionStatuses={subscriptionStatuses}
            onSubscriptionStatusesChange={onSubscriptionStatusesChange}
            registrationDate={registrationDate}
            onRegistrationDateChange={onRegistrationDateChange}
            onReset={onResetFilters}
          />
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
                    Invitees <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Subscription State<ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Registration date <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="p-4" />
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-natural-text">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, idx) => (
                  <TableRow
                    key={user.id}
                    className="text-nowrap border-b border-natural last:border-0 hover:bg-light-natural/50 transition-colors h-[60px]"
                  >
                    <TableCell className="text-center font-medium">{startIndex + idx + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.invitees}</TableCell>
                    <TableCell
                      className={user.subscription === "Subscribed" ? "text-success" : "text-danger"}
                    >
                      <span className={`px-3 py-1 rounded-full ${user.subscription === "Subscribed" ? "text-success bg-success/10" : "text-danger bg-danger/10"}`}>
                        {user.subscription}
                      </span>
                    </TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
                    <TableCell className="px-6 py-0 text-right">
                      <Button
                        variant="ghost"
                        className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1.5"
                        onClick={() => onView(user.id)}
                      >
                        <VisibleIcon className="w-5! h-5!" />
                        View
                      </Button>
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
