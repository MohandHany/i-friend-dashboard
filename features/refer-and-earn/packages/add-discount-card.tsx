"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertWindow } from "@/components/alert-window"
import { AlertDialogTitle } from "@/components/ui/alert-dialog"
import { createDiscountTier } from "@/services/queries/refer-and-earn/post/post-create-discount-tier"
import { toast } from "sonner"

interface AddPackageCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddDiscountCard({ open, onOpenChange, onSuccess }: AddPackageCardProps) {
  const [discountPercent, setDiscountPercent] = React.useState("")
  const [coinsCost, setCoinsCost] = React.useState("")
  const [isActive, setIsActive] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  const handleAdd = async () => {
    if (!discountPercent || !coinsCost) {
      toast("Please fill all fields ❌")
      return
    }

    setLoading(true)
    try {
      const res = await createDiscountTier({
        discountPercent: Number(discountPercent),
        coinsCost: Number(coinsCost),
        isActive: isActive
      })

      if (res.success) {
        toast(res.message + " ✅")
        onSuccess()
        setDiscountPercent("")
        setCoinsCost("")
        setIsActive(true)
        onOpenChange(false)
      } else {
        toast(res.message + " ❌")
      }
    } catch (error) {
      toast("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertWindow
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-[440px] p-6 gap-6 flex flex-col items-center !text-center"
      hideButtons
    >
      <AlertDialogTitle className="text-xl font-medium mb-2 w-full text-left">Create Discount</AlertDialogTitle>
      <div className="flex flex-col gap-6 w-full text-left">
        <div className="space-y-3">
          <Label>
            Discount Type <span className="text-danger">*</span>
          </Label>
          <Input
            placeholder="0 - 100%"
            type="number"
            className="h-12 rounded-xl"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-3">
          <Label>
            Number Coins <span className="text-danger">*</span>
          </Label>
          <div className="relative">
            <Input
              placeholder="0"
              type="number"
              className="h-12 rounded-xl pr-16"
              value={coinsCost}
              onChange={(e) => setCoinsCost(e.target.value)}
              disabled={loading}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
              Coins
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-base">Active Status</Label>
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            disabled={loading}
            className="data-[state=checked]:bg-primary-blue"
          />
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Button
          className="flex-1 bg-primary-blue hover:bg-primary-blue-hover text-white h-14 rounded-xl transition-all text-base"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-natural-text hover:text-black h-14 rounded-xl transition-all text-base"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </AlertWindow>
  )
}
