"use client"

import * as React from "react"
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

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const accessOptions = [
  "Dashboard",
  "Revenue",
  "Analysis",
  "Subscription Management",
  "Payment Methods",
  "Users Management",
  "Notification",
  "Feedback",
  "Users Role",
]

export function CreateRoleCard({ open, onOpenChange }: CreateRoleDialogProps) {
  const [selectedAccess, setSelectedAccess] = React.useState<string[]>([])
  const [isClosing, setIsClosing] = React.useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
    }, 200)
  }

  const toggleAccess = (option: string) => {
    setSelectedAccess((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    )
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
          <h2 className="text-xl font-semibold">Create Role</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name" className="text-sm font-medium text-gray-700">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role-name"
                placeholder="Role Name"
                className="bg-natural focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Access <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-natural hover:bg-gray-100 font-normal",
                      selectedAccess.length === 0 && "text-muted-foreground"
                    )}
                  >
                    {selectedAccess.length > 0
                      ? `${selectedAccess.length} selected`
                      : "Select an option"}
                    <ArrowDown2Icon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-100 p-4 z-[99999]" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none mb-3">Select Access</h4>
                    <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                      {accessOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`access-${option}`}
                            checked={selectedAccess.includes(option)}
                            onCheckedChange={() => toggleAccess(option)}
                          />
                          <Label
                            htmlFor={`access-${option}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
