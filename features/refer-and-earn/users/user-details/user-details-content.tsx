"use client"

import * as React from "react"
import Link from "next/link"
import { getParentDetails, InviteeItem } from "@/services/queries/refer-and-earn/get/get-parent-details"
import { Card, CardContent } from "@/components/ui/card"
import { InviteesTable } from "./invitees-table"
import { toast } from "sonner"
import LoadingSpinner from "@/components/ifriend-spinner"

const ITEMS_PER_PAGE = 10

interface UserDetailsContentProps {
  userId: string
}

export function UserDetailsContent({ userId }: UserDetailsContentProps) {
  const [parentName, setParentName] = React.useState("")
  const [totalCoins, setTotalCoins] = React.useState(0)
  const [totalInvitees, setTotalInvitees] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const [invitees, setInvitees] = React.useState<InviteeItem[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  React.useEffect(() => {
    let cancelled = false

    const fetchDetails = async () => {
      setLoading(true)
      try {
        const res = await getParentDetails(userId, { page: currentPage, limit: ITEMS_PER_PAGE })
        if (cancelled) return
        if (res.success) {
          const { parent, invitees: inv } = res.data
          setParentName(parent.fullName)
          setTotalCoins(parent.availablePoints)
          setTotalInvitees(inv.pagination.total)
          setInvitees(inv.data)
          setTotalPages(inv.pagination.totalPages)
        } else {
          toast("Failed to load user details ❌")
        }
      } catch {
        if (!cancelled) toast("Something went wrong ❌")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDetails()
    return () => { cancelled = true }
  }, [userId, currentPage])

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-natural-text">
            <Link href="/refer-and-earn" className="hover:text-foreground transition-colors">
              Refer &amp; Earn
            </Link>
            <span className="text-natural-text/60">›</span>
            <span className="text-foreground">User Details</span>
          </div>

          {/* Page Title */}
          <h1 className="text-[22px] font-semibold">
            View <span className="text-natural-text">{parentName}</span>
          </h1>

          {/* Stats Cards */}
          <Card className="shadow-none">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                <div className="p-6 flex flex-col gap-2">
                  <span className="text-lg text-natural-text">All Invitees</span>
                  <span className="text-3xl font-semibold">{totalInvitees}</span>
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <span className="text-lg text-natural-text">Total Coins</span>
                  <span className="text-3xl font-semibold">{totalCoins}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invitees Table */}
          <InviteesTable
            invitees={invitees}
            isLoading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}
