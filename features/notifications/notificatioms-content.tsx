"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import PlusIcon from "@/public/plus-icon"
import CancelIcon from "@/public/cancel-icon"
import { AlertWindow } from "@/components/alert-window"
import { CreateTemplateCard } from "./components/create-template-card"
import { EditTemplateCard } from "./components/edit-template-card"
import { NotificationsFilterBar } from "./components/notifications-filter-bar"
import { toast } from "sonner"
import {
  getNotificationTemplatesFull,
  NotificationTemplate
} from "@/services/queries/notifications/get/get-all-notifications"
import { NotificationsTable } from "./components/notifications-table"
import { cancelNotificationTemplate } from "@/services/queries/notifications/delete/delete-template"
import { updateNotificationTemplate } from "@/services/queries/notifications/patch/patch-update-template"
import LoadingSpinner from "@/components/ifriend-spinner"

export default function NotificationsContent() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [cancelId, setCancelId] = React.useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isBulkCancelOpen, setIsBulkCancelOpen] = React.useState(false)
  const [editId, setEditId] = React.useState<string | null>(null)

  // Data state
  const [notifications, setNotifications] = React.useState<NotificationTemplate[]>([])
  const [loading, setLoading] = React.useState(true)

  // Filter state
  const [search, setSearch] = React.useState("")
  const [statusFilters, setStatusFilters] = React.useState<string[]>([])
  const [targetFilters, setTargetFilters] = React.useState<string[]>([])

  // Fetch data
  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await getNotificationTemplatesFull()
      setNotifications(data)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { loadData() }, [loadData])

  // Reset page when filters change
  React.useEffect(() => { setCurrentPage(1) }, [search, statusFilters, targetFilters])

  // Apply filters before pagination
  const filtered = React.useMemo(() => {
    return notifications.filter((n) => {
      const matchesTitle = n.title.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilters.length === 0 ||
        statusFilters.some(f => f.toUpperCase() === n.status.toUpperCase())

      const matchesTarget =
        targetFilters.length === 0 ||
        targetFilters.some(f => f.toUpperCase() === n.targetAudience.toUpperCase())

      return matchesTitle && matchesStatus && matchesTarget
    })
  }, [notifications, search, statusFilters, targetFilters])

  const itemsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentNotifications = filtered.slice(startIndex, startIndex + itemsPerPage)

  // selection logic
  const pendingFiltered = filtered.filter(n => n.status === "PENDING")
  const allSelected = pendingFiltered.length > 0 && pendingFiltered.every(n => selectedIds.includes(n.id))
  const someSelected = selectedIds.length > 0 && !allSelected

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(pendingFiltered.map((n) => n.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id]
      return prev.filter((x) => x !== id)
    })
  }

  // cancel handlers
  const handleCancelSingle = async () => {
    if (cancelId === null) return
    const res = await cancelNotificationTemplate(cancelId)
    if (res.success) {
      toast("Notification template canceled successfully ✅")
      loadData()
      setSelectedIds(prev => prev.filter(id => id !== cancelId))
    } else {
      toast(res.message || "Failed to cancel notification template ❌")
    }
    setCancelId(null)
  }

  const handleRestore = async (id: string) => {
    const res = await updateNotificationTemplate(id, { status: "PENDING" })
    if (res.success) {
      toast("Notification template restored successfully ✅")
      loadData()
    } else {
      toast(res.message || "Failed to restore notification template ❌")
    }
  }

  const handleBulkCancel = async () => {
    if (selectedIds.length === 0) return
    try {
      // API currently only supports single cancel, so we call it in parallel
      const results = await Promise.all(selectedIds.map(id => cancelNotificationTemplate(id)))
      const allSuccess = results.every(r => r.success)

      if (allSuccess) {
        toast(`${selectedIds.length} notification templates canceled successfully ✅`)
      } else {
        toast("Some templates may not have been canceled correctly ❌")
      }

      loadData()
    } catch (e) {
      toast("An error occurred while cancelling templates ❌")
      console.error(e)
    } finally {
      setSelectedIds([])
      setIsBulkCancelOpen(false)
    }
  }

  const notificationToCancel = notifications.find((n) => n.id === cancelId)

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-end mb-4">
            <Button
              className="bg-primary-blue hover:bg-primary-blue-hover text-white gap-2 rounded-lg px-4 py-5"
              onClick={() => setIsCreateOpen(true)}
            >
              <PlusIcon className="w-6! h-6!" />
              Create Template
            </Button>
          </div>

          <CreateTemplateCard
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onCreated={loadData}
          />

          <EditTemplateCard
            open={editId !== null}
            templateId={editId}
            onOpenChange={(open) => !open && setEditId(null)}
            onUpdated={loadData}
          />

          <Card className="mb-0 overflow-hidden">
            <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
              <div className="w-full flex items-center justify-between gap-4">
                <NotificationsFilterBar
                  search={search}
                  onSearchChange={setSearch}
                  statusFilters={statusFilters}
                  onStatusFiltersChange={setStatusFilters}
                  targetFilters={targetFilters}
                  onTargetFiltersChange={setTargetFilters}
                />

                {/* Bulk cancel button — only shows when more than 1 row selected */}
                {selectedIds.length > 0 && (
                  <Button
                    variant="default"
                    className="bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-5"
                    onClick={() => setIsBulkCancelOpen(true)}
                  >
                    <CancelIcon className="h-5! w-5!" /> Cancel Selected ({selectedIds.length})
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <NotificationsTable
                notifications={currentNotifications}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                allSelected={allSelected}
                someSelected={someSelected}
                onCancel={setCancelId}
                onRestore={handleRestore}
                onEdit={setEditId}
              />
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

              <div className="flex items-center gap-2 text-sm">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "outline" : "ghost"}
                    size="icon"
                    className={`h-8 w-8 ${currentPage === page ? "bg-gray-50" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
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

          {/* Single cancel confirmation */}
          <AlertWindow
            open={cancelId !== null}
            onOpenChange={(open) => !open && setCancelId(null)}
            title={`Cancel "${notificationToCancel?.title ?? "notification"}"`}
            description="Are you sure you want to cancel this notification?"
            icon={<CancelIcon className="h-10! w-10!" />}
            variant="destructive"
            confirmText="Cancel"
            cancelText="Close"
            onConfirm={handleCancelSingle}
            onCancel={() => setCancelId(null)}
          />

          {/* Bulk cancel confirmation */}
          <AlertWindow
            open={isBulkCancelOpen}
            onOpenChange={setIsBulkCancelOpen}
            title={`Cancel ${selectedIds.length} selected notification${selectedIds.length === 1 ? "" : "s"}`}
            description={(() => {
              const titles = notifications
                .filter((n) => selectedIds.includes(n.id))
                .map((n) => n.title)
              const preview = titles.slice(0, 3).join(", ")
              return titles.length > 3 ? `${preview}, ...` : preview || "This action cannot be undone."
            })()}
            icon={<CancelIcon className="h-10! w-10!" />}
            variant="destructive"
            confirmText="Cancel"
            cancelText="Close"
            onConfirm={handleBulkCancel}
            onCancel={() => setIsBulkCancelOpen(false)}
          />
        </>
      )}
    </div>
  )
}
