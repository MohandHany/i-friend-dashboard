"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import type { RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"

interface RoleTableRowProps {
  role: RoleItemsData
  isSelected: boolean
  onToggleSelect: (checked: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function RoleTableRow({
  role,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete
}: RoleTableRowProps) {
  return (
    <TableRow className="border-b last:border-0">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
        />
      </TableCell>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {(role.dashboardRolePermissions || [])
            .map((rp) => rp.permission?.name)
            .filter((n): n is string => Boolean(n))
            .map((name) => (
              <Badge
                key={`${role.id}-${name}`}
                variant="secondary"
                className="bg-primary-blue/10 text-primary-blue font-normal hover:bg-primary-blue/10"
              >
                {name}
              </Badge>
            ))}
        </div>
      </TableCell>
      <TableCell className="text-right py-0">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            className="text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10"
            onClick={onEdit}
          >
            <EditIcon className="h-5! w-5!" /> Edit
          </Button>
          <Button
            variant="ghost"
            className="text-danger hover:text-danger hover:bg-danger/10"
            onClick={onDelete}
          >
            <DeleteIcon className="h-5! w-5!" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
