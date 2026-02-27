"use client"

import * as React from "react"
import { z } from "zod"
import ArrowDown2Icon from "@/public/arrow-down-2-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { getAllPermissions } from "@/services/queries/settings/role/get/get-all-permissions"
import { PermissionItemsData } from "@/services/queries/settings/role/get/get-all-permissions"
import { createRole } from "@/services/queries/settings/role/post/post-create-role"
import { getAllRoles, RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import { toast } from "sonner"
import { X } from "lucide-react"

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function CreateRoleCard({ open, onOpenChange, onCreated }: CreateRoleDialogProps) {
  const [selectedAccess, setSelectedAccess] = React.useState<string[]>([])
  const [isClosing, setIsClosing] = React.useState(false)
  const [permissions, setPermissions] = React.useState<PermissionItemsData[]>([])
  const [roleName, setRoleName] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [roles, setRoles] = React.useState<RoleItemsData[]>([])
  const [roleNameError, setRoleNameError] = React.useState("")
  const [accessError, setAccessError] = React.useState("")

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
      setRoleName("")
      setSelectedAccess([])
      setRoleNameError("")
      setAccessError("")
    }, 200)
  }

  const toggleAccess = (option: string) => {
    setSelectedAccess((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    )
  }

  useEffect(() => {
    if (open || isClosing) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open, isClosing])

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPermissions()
        if (res.success && res.data) {
          setPermissions(res.data ?? [])
        }
        const rolesRes = await getAllRoles()
        if (rolesRes.success && rolesRes.data) {
          setRoles(rolesRes.data)
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const existingRoleNames = React.useMemo(() => new Set(roles.map(r => (r.name || "").trim().toLowerCase())), [roles])

  const roleNameSchema = React.useMemo(() =>
    z.string()
      .trim()
      .min(3, "Role name must be at least 3 characters")
      .refine((val) => !existingRoleNames.has(val.trim().toLowerCase()), { message: "Role name already exists" })
    , [existingRoleNames])

  const accessSchema = z.array(z.string()).min(1, "Select at least one permission")

  const handleAdd = async () => {
    const nameResult = roleNameSchema.safeParse(roleName)
    const accessResult = accessSchema.safeParse(selectedAccess)
    setRoleNameError(nameResult.success ? "" : (nameResult.error.issues[0]?.message || "Invalid role name"))
    setAccessError(accessResult.success ? "" : (accessResult.error.issues[0]?.message || "Please select permissions"))
    if (!nameResult.success || !accessResult.success) return
    setSubmitting(true)
    try {
      const res = await createRole(roleName.trim(), selectedAccess)
      if (res.success) {
        onCreated?.()
        setRoleName("")
        setSelectedAccess([])
        handleClose()
        toast(`${res.message} ✅`)
      }
    } catch (e) {
      console.error(e)
      toast(`Failed to create role ❌`)
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
          <h2 className="text-xl font-medium">Create Role</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">
                Role Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="role-name"
                placeholder="Role Name"
                className="bg-natural focus-visible:ring-primary-blue placeholder:text-natural-text/50"
                value={roleName}
                onChange={(e) => { setRoleName(e.target.value); if (roleNameError) setRoleNameError("") }}
                onBlur={() => {
                  const res = roleNameSchema.safeParse(roleName)
                  setRoleNameError(res.success ? "" : (res.error.issues[0]?.message || "Invalid role name"))
                }}
              />
              {roleNameError ? (<p className="text-xs text-danger">{roleNameError}</p>) : null}
            </div>

            <div className="space-y-2">
              <Label>
                Access <span className="text-danger">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-natural hover:bg-gray-100 font-normal text-natural-text",
                      selectedAccess.length === 0 && "text-natural-text/50"
                    )}
                  >
                    {selectedAccess.length > 0
                      ? `${selectedAccess.length} selected`
                      : "Select permissions"}
                    <ArrowDown2Icon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-100 p-4 z-99999" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none mb-3">Select Access</h4>
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                      {permissions.map((permission, index) => (
                        <div key={index + 1} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${permission.name}`}
                            checked={selectedAccess.includes(permission.id)}
                            onCheckedChange={() => toggleAccess(permission.id)}
                          />
                          <Label
                            htmlFor={`${permission.name}`}
                            className="text-sm text-natural-text font-normal cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {accessError ? (<p className="text-xs text-danger">{accessError}</p>) : null}
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between mt-2">
            <Button
              className="w-full p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleAdd}
              disabled={submitting}
            >
              Add
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
