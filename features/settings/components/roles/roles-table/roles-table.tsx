"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import PlusIcon from "@/public/plus-icon"
import DeleteIcon from "@/public/delete-icon"
import ForbiddenOutlineIcon from "@/public/forbidden-outline-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import { CreateRoleCard } from "./../create-role-card"
import { EditRoleDialog } from "./../edit-role-card"
import { AlertWindow } from "@/components/alert-window"
import { RoleTableSearch } from "./roles-table-search"
import { RoleTableRow } from "./roles-table-row"
import { useRolesTable } from "./use-roles-table"
import type { RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"

export function RolesTable() {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleItemsData | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const {
    roles,
    searchValue,
    setSearchValue,
    paginatedRoles,
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
    cannotDeleteOpen,
    setCannotDeleteOpen,
    cannotDeleteMessage,
  } = useRolesTable()

  const handleEditClick = (role: RoleItemsData) => {
    setEditingRole(role)
    setIsEditOpen(true)
  }

  const handleDeleteClick = (roleId: string) => {
    setDeleteRoleId(roleId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteRoleId) return
    await handleDeleteSingle(deleteRoleId)
    setDeleteRoleId(null)
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return
    await handleBulkDelete(selectedIds)
    setIsBulkDeleteOpen(false)
  }

  const roleToDelete = roles.find((r) => r.id === deleteRoleId)

  return (
    <div className="space-y-4 h-[80vh]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button
          variant="default"
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
          onClick={() => setIsCreateRoleOpen(true)}
        >
          <PlusIcon className="h-6! w-6!" /> Create Role
        </Button>
      </div>

      <CreateRoleCard open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen} onCreated={reload} />
      <EditRoleDialog
        open={isEditOpen}
        onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditingRole(null) }}
        role={editingRole}
        onUpdated={reload}
      />

      <Card className="mb-0">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <RoleTableSearch
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedCount={selectedIds.length}
            onBulkDelete={() => setIsBulkDeleteOpen(true)}
          />
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-natural border-none">
                <TableHead>
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead className="min-w-[200px]">Role name</TableHead>
                <TableHead className="w-[500px]">Access</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.map((role) => (
                <RoleTableRow
                  key={role.id}
                  role={role}
                  isSelected={selectedIds.includes(role.id)}
                  onToggleSelect={(checked) => toggleSelect(role.id, Boolean(checked))}
                  onEdit={() => handleEditClick(role)}
                  onDelete={() => handleDeleteClick(role.id)}
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
        open={deleteRoleId !== null}
        onOpenChange={(open) => !open && setDeleteRoleId(null)}
        title={`Delete ${roleToDelete?.name ?? "role"}`}
        description="Are you sure you want to delete this role?"
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteRoleId(null)}
      />

      <AlertWindow
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title={`Delete ${selectedIds.length} selected role${selectedIds.length === 1 ? "" : "s"}`}
        description={(() => {
          const names = roles
            .filter((r) => selectedIds.includes(r.id))
            .map((r) => r.name)
            .filter(Boolean) as string[]
          const preview = names.slice(0, 3).join(", ")
          return names.length > 3 ? `${preview}, ...` : preview || "This action cannot be undone."
        })()}
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setIsBulkDeleteOpen(false)}
      />

      <AlertWindow
        open={cannotDeleteOpen}
        onOpenChange={setCannotDeleteOpen}
        title={`You can't delete ${selectedIds.length > 1 ? "these roles" : "this role"}`}
        description={cannotDeleteMessage || "because it's used by users"}
        icon={<ForbiddenOutlineIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText="OK"
        onConfirm={() => setCannotDeleteOpen(false)}
      />
    </div>
  )
}
