"use client"

import * as React from "react"
import { getAllParents, ParentItem } from "@/services/queries/refer-and-earn/get/get-all-parents"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 10
const FETCH_ALL_LIMIT = 1000 // fetch all records at once for client-side filtering

export function useUsersTable() {
  // Raw data from the API — never mutated after fetch
  const [allUsers, setAllUsers] = React.useState<ParentItem[]>([])
  const [loadingUsers, setLoadingUsers] = React.useState(true)

  // Filter state
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [inviteesCount, setInviteesCount] = React.useState("")
  const [subscriptionStatuses, setSubscriptionStatuses] = React.useState<string[]>([])
  const [registrationDate, setRegistrationDate] = React.useState("")

  // Client-side pagination
  const [currentPage, setCurrentPage] = React.useState(1)

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to page 1 when any filter changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [inviteesCount, subscriptionStatuses, registrationDate])

  // Fetch ALL users once on mount
  React.useEffect(() => {
    let cancelled = false

    const fetchUsers = async () => {
      setLoadingUsers(true)
      try {
        const res = await getAllParents({ page: 1, limit: FETCH_ALL_LIMIT })
        if (cancelled) return
        if (res.success) {
          setAllUsers(res.data)
        } else {
          toast("Failed to fetch users ❌")
        }
      } catch {
        if (!cancelled) toast("Something went wrong ❌")
      } finally {
        if (!cancelled) setLoadingUsers(false)
      }
    }

    fetchUsers()
    return () => { cancelled = true }
  }, [])

  // ─── Client-side filtering ────────────────────────────────────────────────

  const filteredUsers = React.useMemo(() => {
    let result = allUsers

    // 1. Search by name or email
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        u =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    }

    // 2. Invitees count (exact match)
    if (inviteesCount !== "") {
      const count = Number(inviteesCount)
      if (!isNaN(count)) {
        result = result.filter(u => u.inviteeCount === count)
      }
    }

    // 3. Subscription status
    if (subscriptionStatuses.length === 1) {
      const wantSubscribed = subscriptionStatuses[0] === "Subscribed"
      result = result.filter(u => u.isSubscribed === wantSubscribed)
    }

    // 4. Registration date (same calendar day)
    if (registrationDate) {
      const filterDate = new Date(registrationDate)
      result = result.filter(u => {
        const joined = new Date(u.joinedAt)
        return (
          joined.getFullYear() === filterDate.getFullYear() &&
          joined.getMonth() === filterDate.getMonth() &&
          joined.getDate() === filterDate.getDate()
        )
      })
    }

    return result
  }, [allUsers, debouncedSearch, inviteesCount, subscriptionStatuses, registrationDate])

  // ─── Client-side pagination ───────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))

  const pagedUsers = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  // ─── Map to display shape ─────────────────────────────────────────────────

  const mappedUsers = React.useMemo(
    () =>
      pagedUsers.map(u => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        invitees: u.inviteeCount,
        subscription: u.isSubscribed ? "Subscribed" : "Not Subscribed",
        registrationDate: new Date(u.joinedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      })),
    [pagedUsers]
  )

  // ─── Reset ────────────────────────────────────────────────────────────────

  const resetFilters = () => {
    setSearchTerm("")
    setDebouncedSearch("")
    setInviteesCount("")
    setSubscriptionStatuses([])
    setRegistrationDate("")
    setCurrentPage(1)
  }

  return {
    users: mappedUsers,
    loadingUsers,
    totalPages,
    currentPage,
    startIndex: (currentPage - 1) * ITEMS_PER_PAGE,

    onPageChange: (page: number) => setCurrentPage(page),

    searchTerm,
    inviteesCount,
    subscriptionStatuses,
    registrationDate,

    onSearchChange: setSearchTerm,
    onInviteesCountChange: setInviteesCount,
    onSubscriptionStatusesChange: setSubscriptionStatuses,
    onRegistrationDateChange: setRegistrationDate,
    onResetFilters: resetFilters,
  }
}
