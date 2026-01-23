"use client"

import * as React from "react"
import CameraIcon from "@/public/camera-icon"
import ArrowDown2Icon from "@/public/arrow-down-2-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const roleOptions = ["Administrator", "Admin", "Markiting"]

export function AddUserCard({ open, onOpenChange }: AddUserDialogProps) {
  const [selectedRole, setSelectedRole] = React.useState<string>("")
  const [isClosing, setIsClosing] = React.useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
    }, 200)
  }

  React.useEffect(() => {
    if (open || isClosing) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open, isClosing])

  if (!open && !isClosing) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm m-0 duration-200",
        isClosing ? "animate-out fade-out-0" : "animate-in fade-in-0"
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6 duration-200",
          isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50"
        )}
      >
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl font-semibold">Add User</h2>

          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-natural flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <CameraIcon className="w-8 h-8 text-natural-text" />
              </div>
              <span className="text-sm text-natural-text">Add a personal photo</span>
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
                      !selectedRole && "text-muted-foreground"
                    )}
                  >
                    {selectedRole || "Select an option"}
                    <ArrowDown2Icon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 z-[99999]" align="start">
                  <div className="space-y-1">
                    {roleOptions.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {role}
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
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="user-password" className="text-sm font-medium text-gray-700">
                Password Account <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-password"
                type="password"
                placeholder="Password"
                className="bg-natural focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between mt-2">
            <Button
              className="w-full p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleClose}
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
