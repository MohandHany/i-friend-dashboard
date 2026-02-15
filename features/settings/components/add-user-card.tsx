"use client";

import * as React from "react";
import CameraIcon from "@/public/camera-icon";
import ArrowDown2Icon from "@/public/arrow-down-2-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getAllRoles,
  RoleItemsData,
} from "@/services/queries/settings/role/GET/get-all-roles";
import {
  postCreateDashboardUser,
  Request as CreateUserRequest,
} from "@/services/queries/settings/user/POST/post-create-user";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const roleOptionsFallback = ["Administrator", "Admin", "Marketing"];

export function AddUserCard({
  open,
  onOpenChange,
  onCreated,
}: AddUserDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");
  const [roles, setRoles] = React.useState<RoleItemsData[]>([]);
  const [isClosing, setIsClosing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | undefined>(
    undefined,
  );
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsClosing(false);
    }, 200);
  };

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
    if (open || isClosing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, isClosing]);

  if (!open && !isClosing) return null;

  const handleSubmit = async () => {
    if (!name || !email || !password || !selectedRoleId) {
      toast("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const body: CreateUserRequest = {
        name,
        email,
        password,
        roleId: selectedRoleId,
        avatarUrl: avatarFile,
      };
      const res = await postCreateDashboardUser(body);
      if (res.success) {
        toast("User created successfully ✅");
        onCreated?.();
        // reset
        setName("");
        setEmail("");
        setPassword("");
        setSelectedRoleId("");
        setAvatarFile(undefined);
        handleClose();
      } else {
        toast(res.message || "Failed to create user ❌");
      }
    } catch (e) {
      console.error(e);
      toast("Failed to create user ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm m-0 duration-200",
        isClosing ? "animate-out fade-out-0" : "animate-in fade-in-0",
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6 duration-200",
          isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50",
        )}
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold">Add User</h2>

          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <input
                id="user-avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatarFile(e.target.files?.[0])}
              />
              <label
                htmlFor="user-avatar"
                className="w-20 h-20 rounded-full bg-natural flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <CameraIcon className="w-8 h-8 text-natural-text" />
              </label>
              <span className="text-sm text-natural-text">
                {avatarFile ? avatarFile.name : "Add a personal photo"}
              </span>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="user-name" className="text-sm">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-name"
                placeholder="Name"
                className="bg-natural focus-visible:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <Label className="text-sm">
                Role <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-natural border-gray-100 hover:bg-gray-100 font-normal",
                      !selectedRoleId && "text-muted-foreground",
                    )}
                  >
                    {roles.find((r) => r.id === selectedRoleId)?.name ||
                      roleOptionsFallback[0] ||
                      "Select role"}
                    <ArrowDown2Icon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-2 z-[99999]"
                  align="start"
                >
                  <div className="space-y-1">
                    {(roles.length
                      ? roles.map((r) => ({ id: r.id, name: r.name }))
                      : roleOptionsFallback.map((name, idx) => ({
                          id: String(idx),
                          name,
                        }))
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedRoleId(item.id)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="user-email" className="text-sm">
                Email Account <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                placeholder="example@gmail.com"
                className="bg-natural focus-visible:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="user-password"
                className="text-sm font-medium text-gray-700"
              >
                Password Account <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Password"
                className="bg-natural focus-visible:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between mt-2">
            <Button
              className="w-full p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
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
  );
}
