"use client"

import * as React from "react"
import { TicketsFilter } from "./tickets-filter"
import { TicketsTable } from "./tickets-table"
import { getAllTickets, Ticket } from "@/services/queries/help-and-support/get/get-all-tickets"

export default function HelpAndSupportContent() {
  const [search, setSearch] = React.useState("")
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchTickets = React.useCallback(async () => {
    setLoading(true)
    // Fetching enough limit to allow local pagination per existing pattern
    const res = await getAllTickets({ limit: 1000 })
    if (res.success && res.data?.tickets) {
      setTickets(res.data.tickets)
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Filter tickets by name ONLY, as requested
  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return tickets.filter((t) => {
      const fullName = `${t.parent.firstName} ${t.parent.lastName}`.toLowerCase()
      return fullName.includes(q)
    })
  }, [search, tickets])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-natural-text">
        Loading tickets...
      </div>
    )
  }

  return (
    <TicketsTable
      tickets={filtered}
      onDeleteSuccess={fetchTickets}
      header={
        <TicketsFilter
          search={search}
          onSearchChange={setSearch}
          totalCount={filtered.length}
        />
      }
    />
  )
}