"use client"

import * as React from "react"
import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { getAllPermissions, PermissionItemsData } from "@/services/queries/settings/role/get/get-all-permissions"
import { updateRole } from "@/services/queries/settings/role/patch/patch-update-role"
import { RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import { toast } from "sonner"
import ArrowDown2Icon from "@/public/arrow-down-2-icon"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: RoleItemsData | null
  onUpdated?: () => void
}

export function EditRoleDialog({ open, onOpenChange, role, onUpdated }: EditRoleDialogProps) {
  const [isClosing, setIsClosing] = React.useState(false)
  const [permissions, setPermissions] = React.useState<PermissionItemsData[]>([])
  const [selectedAccess, setSelectedAccess] = React.useState<string[]>([])
  const [submitting, setSubmitting] = React.useState(false)

  const roleName = role?.name ?? ""

  const existingPermissionIds = useMemo(() => {
    const ids = (role?.dashboardRolePermissions || [])
      .map((rp) => rp.permissionsId)
      .filter((id): id is string => typeof id === "string" && id.length > 0)
    return Array.from(new Set(ids))
  }, [role])

  useEffect(() => {
    if (open || isClosing) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [open, isClosing])

  useEffect(() => {
    // Initialize selected with role's current permissions when role changes or dialog opens
    if (role) {
      setSelectedAccess(existingPermissionIds)
    } else {
      setSelectedAccess([])
    }
  }, [role, open, existingPermissionIds])

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPermissions()
        if (res.success && res.data) {
          setPermissions(res.data)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
    }, 200)
  }

  const toggleAccess = (id: string) => {
    setSelectedAccess((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSave = async () => {
    if (!role) return

    // Validate: at least one permission must be selected
    if (selectedAccess.length === 0) {
      toast("Please select at least one permission ⚠️")
      return
    }

    setSubmitting(true)
    try {
      const permissionIds = Array.from(new Set(
        selectedAccess.filter((id): id is string => typeof id === "string" && id.length > 0)
      ))
      const res = await updateRole(role.id, { permissionIds })
      if (res.success) {
        toast(`Role permissions updated successfully ✅`)
        onUpdated?.()
        handleClose()
      } else {
        toast(`Failed to update role permissions ❌`)
      }
    } catch (e) {
      console.error(e)
      toast("Failed to update role permissions ❌")
    } finally {
      setSubmitting(false)
    }
  }

  if (!open && !isClosing) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm m-0 duration-200",
        isClosing ? "animate-out fade-out-0" : "animate-in fade-in-0"
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6 duration-200",
          isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-medium">Edit {roleName} Permissions</h2>

          <div className="space-y-2">
            <Label>Access</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between bg-natural hover:bg-gray-100 font-normal text-natural-text",
                    selectedAccess.length === 0 && "text-natural-text/50"
                  )}
                >
                  {selectedAccess.length > 0 ? `${selectedAccess.length} selected` : "Select permissions"}
                  <ArrowDown2Icon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-100 p-4 z-99999" align="start">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none mb-3">Select Access</h4>
                  <div className={`grid gap-2 ${permissions.length > 9 && "overflow-y-auto"}`}>
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`perm-${permission.id}`}
                          checked={selectedAccess.includes(permission.id)}
                          onCheckedChange={() => toggleAccess(permission.id)}
                        />
                        <Label htmlFor={`perm-${permission.id}`} className="text-natural-text font-normal cursor-pointer">
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {selectedAccess.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                At least one permission is required
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 justify-between mt-2">
            <Button
              className="w-full p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleSave}
              disabled={submitting}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              className="w-full p-6 text-natural-text hover:text-black hover:bg-natural"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
