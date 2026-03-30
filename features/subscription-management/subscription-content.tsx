"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AlertWindow } from "@/components/alert-window"
import { AddPeriodCard } from "./components/add-package-card"
import { EditPackageCard } from "./components/edit-package-card"
import DeleteIcon from "@/public/delete-icon"
import PlusIcon from "@/public/plus-icon"
import { PackagesFilter } from "./components/packages-filter"
import { PackageCard } from "./components/package-card"
import { getAllPackages, SubscriptionPackage } from "@/services/queries/subscription/get/get-all-packages"

export default function SubscriptionContent() {
  const [packages, setPackages] = React.useState<SubscriptionPackage[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editPkg, setEditPkg] = React.useState<SubscriptionPackage | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    const res = await getAllPackages()
    if (res.success) {
      setPackages(res.data)
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  // Filter packages by name
  const filtered = React.useMemo(
    () => packages.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [packages, search]
  )

  const handleDelete = async () => {
    // Add delete API call logic here if needed
    setDeleteId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">All Packages</h2>
        <Button
          className="bg-primary-blue hover:bg-primary-blue-hover gap-2 h-11 px-6 rounded-lg font-medium"
          onClick={() => setIsAddOpen(true)}
        >
          <PlusIcon className="w-5! h-5!" />
          Create Package
        </Button>
      </div>

      {/* Toolbar */}
      <PackagesFilter search={search} onSearchChange={setSearch} />

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-natural-text">Loading packages...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-natural-text">No packages found</div>
      ) : (
        <div className="flex flex-col gap-8">
          {filtered.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onDeletePlan={setDeleteId}
              onDelete={() => setDeleteId(pkg.id)}
              onEdit={() => setEditPkg(pkg)}
            />
          ))}
        </div>
      )}

      {/* Add Package dialog */}
      <AddPeriodCard
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdded={load}
      />

      {/* Edit Package dialog */}
      <EditPackageCard
        pkg={editPkg}
        open={editPkg !== null}
        onOpenChange={(open) => !open && setEditPkg(null)}
        onUpdated={load}
      />

      {/* Delete confirmation */}
      <AlertWindow
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Subscription Plan"
        description="Are you sure you would like to do this?"
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Close"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
