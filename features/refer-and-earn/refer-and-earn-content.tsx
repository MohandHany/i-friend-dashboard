"use client"

import * as React from "react"
import { AllDiscountsTable } from "./discounts/all-discounts-table"
import { AllUsersTable } from "./users/all-users-table"
import { AddDiscountCard } from "./discounts/add-discount-card"
import { EditDiscountCard } from "./discounts/edit-discount-card"
import { AlertWindow } from "@/components/alert-window"
import DeleteIcon from "@/public/delete-icon"
import { LoyaltySettingsCards } from "./loyality-settings/loyalty-settings-cards"

import { useRouter } from "next/navigation"
import { useUsersTable } from "./users/use-users-table"
import { getDiscountTiers, DiscountTier } from "@/services/queries/refer-and-earn/get/get-discount-tiers"
import { deleteDiscountTier } from "@/services/queries/refer-and-earn/delete/delete-discount-tier"
import { patchUpdateDiscountTierStatus } from "@/services/queries/refer-and-earn/patch/patch-update-discount-tier-status"
import ForbiddenOutlineIcon from "@/public/forbidden-outline-icon"
import { toast } from "sonner"

interface LocalPackage {
  id: string
  discount: string
  coins: number
  active: boolean
}

// Removed static initialUsers

export function ReferAndEarn() {
  const router = useRouter()
  const [packages, setPackages] = React.useState<LocalPackage[]>([])
  const [loadingPackages, setLoadingPackages] = React.useState(true)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [editPkg, setEditPkg] = React.useState<LocalPackage | null>(null)
  const [deletePkgIds, setDeletePkgIds] = React.useState<string[]>([])
  const [deleting, setDeleting] = React.useState(false)
  const [packagesSearchTerm, setPackagesSearchTerm] = React.useState("")
  const [cannotDeleteOpen, setCannotDeleteOpen] = React.useState(false)
  const [cannotDeleteMessage, setCannotDeleteMessage] = React.useState("")

  // Packages Pagination State
  const [packagesPage, setPackagesPage] = React.useState(1)
  const packagesPerPage = 5

  const pkgsToDelete = packages.filter(p => deletePkgIds.includes(p.id))

  // Users — fully managed by the hook
  const {
    users: currentUsers,
    loadingUsers,
    totalPages,
    currentPage,
    startIndex,
    onPageChange,
    searchTerm,
    inviteesCount,
    subscriptionStatuses,
    registrationDate,
    onSearchChange,
    onInviteesCountChange,
    onSubscriptionStatusesChange,
    onRegistrationDateChange,
    onResetFilters,
  } = useUsersTable()

  // Fetch Packages
  const fetchPackages = async () => {
    setLoadingPackages(true)
    try {
      const res = await getDiscountTiers()
      if (res.success && res.data) {
        setPackages(res.data.map((tier: DiscountTier) => ({
          id: tier.id,
          discount: tier.discountPercent + "%",
          coins: tier.coinsCost,
          active: tier.isActive
        })))
      } else {
        toast("Failed to fetch packages ❌")
      }
    } catch (error) {
      toast("Something went wrong ❌")
    } finally {
      setLoadingPackages(false)
    }
  }

  React.useEffect(() => {
    fetchPackages()
  }, [])

  const handleDelete = async () => {
    if (deletePkgIds.length === 0) return

    // Check for active packages
    const activePkgs = packages.filter(p => deletePkgIds.includes(p.id) && p.active)
    if (activePkgs.length > 0) {
      setCannotDeleteMessage(
        deletePkgIds.length > 1
          ? "Some selected discounts can't be deleted because they are active."
          : "This discount can't be deleted because it is active."
      )
      setCannotDeleteOpen(true)
      setDeletePkgIds([])
      return
    }

    setDeleting(true)
    try {
      // Execute deletions in parallel
      const results = await Promise.all(deletePkgIds.map(id => deleteDiscountTier(id)))
      const allSuccess = results.every(r => r.success)

      if (allSuccess) {
        toast(`${deletePkgIds.length > 1 ? "Discounts" : "Discount"} deleted successfully ✅`)
      } else {
        const successCount = results.filter(r => r.success).length
        toast(`Deleted ${successCount}/${deletePkgIds.length} discounts. Some failed ⚠️`)
      }

      await fetchPackages() // Refresh list
      setDeletePkgIds([])
    } catch (error) {
      toast("Failed to delete ❌")
    } finally {
      setDeleting(false)
    }
  }

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const res = await patchUpdateDiscountTierStatus(id, active)
      if (res.success) {
        toast(res.message + " ✅")
        setPackages(prev => prev.map(p => p.id === id ? { ...p, active } : p))
      } else {
        toast(res.message + " ❌")
      }
    } catch (error) {
      toast("Something went wrong ❌")
    }
  }

  // Packages Filter & Pagination Logic
  const filteredPackages = packages.filter(p =>
    p.discount.toLowerCase().includes(packagesSearchTerm.toLowerCase())
  )
  const totalPackagesPages = Math.max(1, Math.ceil(filteredPackages.length / packagesPerPage))
  const currentPackages = filteredPackages.slice((packagesPage - 1) * packagesPerPage, packagesPage * packagesPerPage)

  return (
    <div className="flex flex-col gap-15">
      <LoyaltySettingsCards />
      <AllDiscountsTable
        packages={currentPackages}
        onAdd={() => setIsAddOpen(true)}
        onDelete={(id) => setDeletePkgIds([id])}
        onBulkDelete={(ids) => setDeletePkgIds(ids)}
        onEdit={(pkg) => {
          setEditPkg(pkg)
          setIsEditOpen(true)
        }}
        onToggle={handleToggle}
        currentPage={packagesPage}
        totalPages={totalPackagesPages}
        onPageChange={(page) => setPackagesPage(page)}
        searchValue={packagesSearchTerm}
        onSearchChange={setPackagesSearchTerm}
      />

      <div className="relative">
        <AllUsersTable
          users={currentUsers}
          startIndex={startIndex}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          inviteesCount={inviteesCount}
          onInviteesCountChange={onInviteesCountChange}
          subscriptionStatuses={subscriptionStatuses}
          onSubscriptionStatusesChange={onSubscriptionStatusesChange}
          registrationDate={registrationDate}
          onRegistrationDateChange={onRegistrationDateChange}
          onResetFilters={onResetFilters}
          onView={(id) => router.push(`/refer-and-earn/${id}`)}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={loadingUsers}
          onPageChange={onPageChange}
        />

        <AddDiscountCard
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          onSuccess={fetchPackages}
        />

        <EditDiscountCard
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSuccess={fetchPackages}
          pkg={editPkg}
        />

        <AlertWindow
          open={deletePkgIds.length > 0}
          onOpenChange={(open) => !open && !deleting && setDeletePkgIds([])}
          title={deletePkgIds.length > 1 ? `Delete ${deletePkgIds.length} Discounts` : `Delete Discount ${pkgsToDelete[0]?.discount ?? ""}`}
          description={deletePkgIds.length > 1
            ? "Are you sure you want to delete these discounts? Only inactive ones will be removed."
            : "Are you sure you would like to do this?"}
          icon={<DeleteIcon className="h-10! w-10!" />}
          variant="destructive"
          confirmText={deleting ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeletePkgIds([])}
          disabled={deleting}
          closeOnOutsideClick={!deleting}
        />

        <AlertWindow
          open={cannotDeleteOpen}
          onOpenChange={setCannotDeleteOpen}
          title={`You can't delete ${deletePkgIds.length > 1 ? "these discounts" : "this discount"}`}
          description={cannotDeleteMessage || "because it's active"}
          icon={<ForbiddenOutlineIcon className="h-10! w-10!" />}
          variant="destructive"
          confirmText="OK"
          onConfirm={() => setCannotDeleteOpen(false)}
        />
      </div>
    </div>
  )
}
