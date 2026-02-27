"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import type { DashboardUserData } from "@/services/queries/settings/user/get/get-all-users"

interface UserTableRowProps {
  user: DashboardUserData
  isSelected: boolean
  onToggleSelect: (checked: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function UserTableRow({
  user,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete
}: UserTableRowProps) {
  return (
    <TableRow className="border-b last:border-0">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>
              {(user.name || "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name}</span>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal">
          {user.dashboardUserRole?.name || "-"}
        </Badge>
      </TableCell>
      <TableCell className="text-right py-0">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-primary-blue hover:bg-primary-blue/10"
            onClick={onEdit}
          >
            <EditIcon className="h-5! w-5!" /> Edit
          </Button>
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-danger hover:bg-danger/10"
            onClick={onDelete}
          >
            <DeleteIcon className="h-5! w-5!" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
