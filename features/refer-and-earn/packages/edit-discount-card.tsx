"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertWindow } from "@/components/alert-window"
import { AlertDialogTitle } from "@/components/ui/alert-dialog"
import { putUpdateDiscountTier } from "@/services/queries/refer-and-earn/put/put-update-discount-tier"
import { toast } from "sonner"

interface EditPackageCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  pkg: {
    id: string
    discount: string
    coins: number
  } | null
}

export function EditDiscountCard({ open, onOpenChange, onSuccess, pkg }: EditPackageCardProps) {
  const [discountPercent, setDiscountPercent] = React.useState("")
  const [coinsCost, setCoinsCost] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (pkg) {
      setDiscountPercent(pkg.discount.replace("%", ""))
      setCoinsCost(pkg.coins.toString())
    }
  }, [pkg])

  const handleUpdate = async () => {
    if (!pkg) return
    if (!discountPercent || !coinsCost) {
      toast("Please fill all fields ❌")
      return
    }

    setLoading(true)
    try {
      const res = await putUpdateDiscountTier(pkg.id, {
        discountPercent: Number(discountPercent),
        coinsCost: Number(coinsCost),
      })

      if (res.success) {
        toast(res.message + " ✅")
        onSuccess()
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
      <AlertDialogTitle className="text-xl font-medium mb-2 w-full text-left">Edit Package</AlertDialogTitle>
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
      </div>

      <div className="flex gap-3 w-full">
        <Button
          className="flex-1 bg-primary-blue hover:bg-primary-blue-hover text-white h-14 rounded-xl transition-all text-base"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
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
