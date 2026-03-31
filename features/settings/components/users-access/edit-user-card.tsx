"use client";

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import ArrowDown2Icon from "@/public/arrow-down-2-icon"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAllRoles, RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import { DashboardUserData } from "@/services/queries/settings/user/get/get-all-users"
import { patchUpdateDashboardUser } from "@/services/queries/settings/user/patch/patch-update-user"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: DashboardUserData | null;
  onUpdated?: () => void;
}

export function EditUserCard({ open, onOpenChange, user, onUpdated }: EditUserDialogProps) {

  const [roles, setRoles] = React.useState<RoleItemsData[]>([])
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)
  const [rolePopoverOpen, setRolePopoverOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return;
    let mounted = true;
    const load = async () => {
      try {
        const res = await getAllRoles();
        if (mounted && res.success && res.data) setRoles(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [open]);

  React.useEffect(() => {
    if (open && user) {
      setSelectedRoleId(user.dashboardUserRoleId || "");
    }
  }, [open, user]);



  const handleClose = () => {
    onOpenChange(false);
  };

  const handleUpdate = async () => {
    if (!user || !selectedRoleId) return;
    try {
      setLoading(true);
      const res = await patchUpdateDashboardUser({
        userId: user.id,
        roleId: selectedRoleId,
      });
      if (res.success) {
        toast("User role updated successfully ✅")
        onUpdated?.()
        handleClose()
      } else {
        toast(res.message || "Failed to update user role ❌")
      }
    } catch (e) {
      console.error(e)
      toast("Failed to update user role ❌")
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleName =
    roles.find((r) => r.id === selectedRoleId)?.name || "Select role";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] sm:w-full max-w-md p-6 rounded-2xl">
        <AlertDialogTitle className="hidden">Edit {user?.name} Role</AlertDialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 transition-opacity hover:opacity-100"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold">Edit {user?.name} Role</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Role
              </Label>
              <Popover open={rolePopoverOpen} onOpenChange={setRolePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-natural border-gray-100 hover:bg-gray-100 font-normal",
                      !selectedRoleId && "text-natural-text/50"
                    )}
                  >
                    {selectedRoleName}
                    <ArrowDown2Icon className={`h-4 w-4 opacity-50 transition-all duration-300 ${rolePopoverOpen ? "rotate-180" : ""}`} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-2 z-[99999]"
                  align="start"
                >
                  <div className="max-h-64 overflow-auto space-y-1">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => { setSelectedRoleId(role.id); setRolePopoverOpen(false) }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between mt-2">
            <Button
              className="w-full p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleUpdate}
              disabled={loading || !selectedRoleId}
            >
              Update
            </Button>
            <Button
              variant="ghost"
              className="w-full p-6 text-natural-text hover:text-black hover:bg-natural"
              onClick={handleClose}
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
