"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import PlusIcon from "@/public/plus-icon"
import DeleteIcon from "@/public/delete-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import { AddUserCard } from "../create-user/create-user-card"
import { EditUserCard } from "../edit-user-card"
import { AlertWindow } from "@/components/alert-window"
import { TableFilters } from "./table-filters"
import { UserTableRow } from "./users-table-row"
import { useUserTable } from "./use-users-table"
import type { DashboardUserData } from "@/services/queries/settings/user/get/get-all-users"

export function UserAccessTable() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<DashboardUserData | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const {
    users,
    roles,
    selectedRoles,
    toggleRole,
    searchValue,
    setSearchValue,
    paginatedUsers,
    page,
    setPage,
    pageCount,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    allSelected,
    someSelected,
    reload,
    handleDeleteSingle,
    handleBulkDelete,
  } = useUserTable()

  const handleEditClick = (user: DashboardUserData) => {
    setEditingUser(user)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (userId: string) => {
    setDeleteUserId(userId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return
    await handleDeleteSingle(deleteUserId)
    setDeleteUserId(null)
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length <= 1) return
    await handleBulkDelete(selectedIds)
    setIsBulkDeleteOpen(false)
  }

  return (
    <div className="space-y-4 mt-6 h-[80vh]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Access</h2>
        <Button
          variant="default"
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
          onClick={() => setIsAddUserOpen(true)}
        >
          <PlusIcon className="h-6! w-6!" /> Add User
        </Button>
      </div>

      <AddUserCard open={isAddUserOpen} onOpenChange={setIsAddUserOpen} onCreated={reload} />
      <EditUserCard
        open={isEditOpen}
        onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditingUser(null) }}
        user={editingUser}
        onUpdated={reload}
      />

      <Card className="mb-0">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <TableFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            roles={roles}
            selectedRoles={selectedRoles}
            onToggleRole={toggleRole}
            selectedCount={selectedIds.length}
            onBulkDelete={() => setIsBulkDeleteOpen(true)}
          />
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-natural border-none">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedIds.includes(user.id)}
                  onToggleSelect={(checked) => toggleSelect(user.id, Boolean(checked))}
                  onEdit={() => handleEditClick(user)}
                  onDelete={() => handleDeleteClick(user.id)}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pageCount > 1 && (
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
      )}

      <AlertWindow
        open={deleteUserId !== null}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title={`Delete ${users.find((u) => u.id === deleteUserId)?.name}`}
        description="Are you sure you want to delete this user?"
        icon={<DeleteIcon className="h-10 w-10" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteUserId(null)}
      />

      <AlertWindow
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title={`Delete ${selectedIds.length} selected user${selectedIds.length === 1 ? "" : "s"}`}
        description={(() => {
          const names = users
            .filter((u) => selectedIds.includes(u.id))
            .map((u) => u.name)
            .filter(Boolean) as string[]
          const preview = names.slice(0, 3).join(", ")
          return names.length > 3 ? `${preview}, ...` : preview || "This action cannot be undone."
        })()}
        icon={<DeleteIcon className="h-10 w-10" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setIsBulkDeleteOpen(false)}
      />
    </div>
  )
}
