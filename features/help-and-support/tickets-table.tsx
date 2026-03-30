"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { AlertWindow } from "@/components/alert-window"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import DeleteIcon from "@/public/delete-icon"
import ImageIcon from "@/public/image-icon"
import VisibleIcon from "@/public/visible-icon"
import { Ticket } from "@/services/queries/help-and-support/get/get-all-tickets"
import { deleteTicket } from "@/services/queries/help-and-support/delete/delete-ticket"
import { updateTicketStatus } from "@/services/queries/help-and-support/patch/patch-update-ticket-status"
import MoreIcon from "@/public/more-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

interface TicketsTableProps {
  tickets: Ticket[]
  header?: React.ReactNode
  onDeleteSuccess?: () => void
}

export function TicketsTable({ tickets, header, onDeleteSuccess }: TicketsTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Reset page when tickets change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [tickets])

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateTicketStatus(id, { status: newStatus })
    if (res.success) {
      toast(res.message || "Ticket status updated successfully ✅")
      onDeleteSuccess?.()
    } else {
      toast(res.message || "Failed to update ticket status ❌")
    }
  }

  const totalPages = Math.max(1, Math.ceil(tickets.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const ticketToDelete = tickets.find((t) => t.id === deleteId)

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteTicket(deleteId)
    if (res.success) {
      toast(res.message || "Ticket deleted successfully ✅")
      onDeleteSuccess?.()
    } else {
      toast(res.message || "Failed to delete ticket ❌")
    }
    setIsDeleting(false)
    setDeleteId(null)
  }

  // Build page numbers to display (with ellipsis)
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
      <Card className="mb-0">
        {header}
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-light-natural">
              <TableRow>
                <TableHead className="w-16">
                  <div className="text-center font-bold">#</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Title
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Description
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Attachment
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-natural-text">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                currentTickets.map((ticket) => {
                  const attachmentsCount = ticket.attachmentUrls?.length || 0;
                  return (
                    <TableRow
                      key={ticket.id}
                      className={cn(
                        "hover:bg-light-natural/50 transition-colors",
                        ticket.status === "OPEN" && "bg-primary-blue/5 hover:bg-primary-blue/5"
                      )}
                    >
                      <TableCell className="text-center">
                        #{ticket.ticketNumber}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {ticket.parent.firstName} {ticket.parent.lastName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {ticket.title}
                      </TableCell>
                      <TableCell className="max-w-xs" title={ticket.description}>
                        <p className="line-clamp-2 leading-5">
                          {ticket.description}
                        </p>
                      </TableCell>
                      <TableCell className="p-2">
                        {attachmentsCount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: Math.min(attachmentsCount, 3) }).map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-center w-12 h-12 rounded-md bg-natural text-natural-text"
                              >
                                <ImageIcon className="w-6 h-6 opacity-50 text-natural-text" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-natural-text">No attachments</p>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-medium capitalize ${ticket.status === "OPEN" ? "bg-primary-blue/10 text-primary-blue" :
                          ticket.status === "RESOLVED" ? "bg-success/10 text-success" :
                            "bg-natural text-natural-text"
                          }`}>
                          {ticket.status.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            asChild
                            title="View"
                            variant="ghost"
                            className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1 px-2 py-2"
                          >
                            <Link href={`/help-and-support/ticket-details/${ticket.id}`}>
                              <VisibleIcon className="h-5! w-5!" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            title="Delete"
                            className="h-auto gap-1 text-danger hover:text-danger hover:bg-danger/10 px-2 py-2"
                            onClick={() => setDeleteId(ticket.id)}
                          >
                            <DeleteIcon className="h-5! w-5!" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" title="Status" className="h-auto gap-1 text-natural-text hover:bg-natural px-2 py-2">
                                <MoreIcon className="h-5! w-5!" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="justify-between" onClick={() => handleStatusChange(ticket.id, "OPEN")}>
                                Open {ticket.status === "OPEN" && <Check className="w-4 h-4 ml-2" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="justify-between" onClick={() => handleStatusChange(ticket.id, "RESOLVED")}>
                                Resolved {ticket.status === "RESOLVED" && <Check className="w-4 h-4 ml-2" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="justify-between" onClick={() => handleStatusChange(ticket.id, "CLOSED")}>
                                Closed {ticket.status === "CLOSED" && <Check className="w-4 h-4 ml-2" />}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
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
            className="gap-2 group"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>

          <div className="flex items-center gap-1 text-sm">
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-natural-text">
                  …
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "outline" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${currentPage === page ? "bg-gray-50 font-semibold" : ""}`}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertWindow
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`Delete #${ticketToDelete?.ticketNumber ?? ""}`}
        description="Are you sure you would like to delete this ticket?"
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Close"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
