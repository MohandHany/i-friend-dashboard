"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createPackage, PlanCreatePayload } from "@/services/queries/subscription/post/post-create-package"
import { toast } from "sonner"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface AddPackageCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded?: () => void
}

const BILLING_PERIODS = ["MONTHLY", "THREE_MONTHS", "YEARLY"] as const
type BillingPeriod = typeof BILLING_PERIODS[number]

const formatPeriod = (period: string) =>
  period === "THREE_MONTHS"
    ? "3 Months"
    : period.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())

interface PlanError {
  price?: string
  trialDays?: string
  aiConversationCredits?: string
  aiReportCredits?: string
}

interface FormErrors {
  name?: string
  maxChildren?: string
  plans?: string
  planErrors?: PlanError[]
}

export function AddPeriodCard({ open, onOpenChange, onAdded }: AddPackageCardProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [maxChildren, setMaxChildren] = React.useState(1)
  const [isActive, setIsActive] = React.useState(true)
  const [plans, setPlans] = React.useState<PlanCreatePayload[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [submitted, setSubmitted] = React.useState(false)

  const handleClose = () => {
    onOpenChange(false)
    setName("")
    setDescription("")
    setMaxChildren(1)
    setIsActive(true)
    setPlans([])
    setErrors({})
    setSubmitted(false)
  }

  const usedPeriods = plans.map((p) => p.billingPeriod)
  const availablePeriods = BILLING_PERIODS.filter((p) => !usedPeriods.includes(p))

  const addPlan = () => {
    if (availablePeriods.length === 0) return
    setPlans((prev) => [
      ...prev,
      {
        billingPeriod: availablePeriods[0],
        price: 0,
        currency: "EGP",
        trialDays: 0,
        aiConversationCredits: 0,
        aiReportCredits: 0,
        isActive: true,
      },
    ])
  }

  const removePlan = (index: number) => {
    setPlans((prev) => prev.filter((_, i) => i !== index))
  }

  const updatePlan = (index: number, updates: Partial<PlanCreatePayload>) => {
    setPlans((prev) => prev.map((p, i) => (i === index ? { ...p, ...updates } : p)))
  }

  const validate = (
    currentName: string,
    currentMaxChildren: number,
    currentPlans: PlanCreatePayload[]
  ): FormErrors => {
    const newErrors: FormErrors = {}

    if (!currentName.trim()) {
      newErrors.name = "Package name is required"
    } else if (currentName.trim().length < 2) {
      newErrors.name = "Package name must be at least 2 characters"
    }

    if (!currentMaxChildren || currentMaxChildren < 1 || !Number.isInteger(currentMaxChildren)) {
      newErrors.maxChildren = "Must be a whole number ≥ 1"
    }

    if (isActive && currentPlans.length === 0) {
      newErrors.plans = "Please add at least one plan"
    } else if (isActive && currentPlans.filter((p) => p.isActive).length === 0) {
      newErrors.plans = "At least one plan must be active"
    }

    const planErrors: PlanError[] = currentPlans.map((plan) => {
      const planErr: PlanError = {}
      if (plan.isActive) {
        if (plan.price < 0) planErr.price = "Price cannot be negative"
        else if (plan.price === 0) planErr.price = "Price must be greater than 0"
      }
      if (plan.trialDays < 0) planErr.trialDays = "Cannot be negative"
      if (plan.aiConversationCredits < 0) planErr.aiConversationCredits = "Cannot be negative"
      if (plan.aiReportCredits < 0) planErr.aiReportCredits = "Cannot be negative"
      return planErr
    })

    if (planErrors.some((pe) => Object.values(pe).some(Boolean))) {
      newErrors.planErrors = planErrors
    }

    return newErrors
  }

  // Re-validate live once the user has tried to submit
  React.useEffect(() => {
    if (submitted) setErrors(validate(name, maxChildren, plans))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, maxChildren, plans, isActive, submitted])

  const handleAdd = async () => {
    setSubmitted(true)
    const validationErrors = validate(name, maxChildren, plans)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const res = await createPackage({
      name,
      description: description.trim() || null,
      maxChildren,
      isActive,
      plans,
    })

    if (res.success) {
      toast(res.message + " ✅")
      onAdded?.()
      handleClose()
    } else {
      toast(res.message + " ❌")
    }
    setSubmitting(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl w-[95vw] sm:w-full p-5 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <AlertDialogTitle className="text-2xl font-bold mb-4 sm:mb-8">Add New Package</AlertDialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 w-6 h-6 rounded-full"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="grid grid-cols-1 gap-5 mb-5">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <h3 className="text-lg font-semibold text-primary-blue">General Information</h3>
            <div className="flex items-center gap-3">
              <Label htmlFor="package-active" className="cursor-pointer">Active Package</Label>
              <Switch
                id="package-active"
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-primary-blue"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                placeholder="Write Package Name"
                className={cn("bg-natural h-11 rounded-lg", errors.name && "focus-visible:ring-danger")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="maxChildren">Max Children</Label>
              <Input
                id="maxChildren"
                type="number"
                className={cn("bg-natural h-11 rounded-lg", errors.maxChildren && "focus-visible:ring-danger")}
                value={maxChildren}
                min={0}
                onChange={(e) => setMaxChildren(Number(e.target.value))}
              />
              {errors.maxChildren && <p className="text-xs text-danger">{errors.maxChildren}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description <span className="text-natural-text">(Optional)</span></Label>
            <Textarea
              id="description"
              placeholder="Write Package Description"
              className="bg-natural rounded-lg min-h-[100px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-blue">Plans Configuration</h3>
              {errors.plans && <p className="text-xs text-danger mt-0.5">{errors.plans}</p>}
            </div>
            <Button
              type="button"
              onClick={addPlan}
              disabled={availablePeriods.length === 0}
              className="flex items-center gap-1.5 bg-primary-blue hover:bg-primary-blue-hover text-white hover:text-white"
            >
              <Plus className="w-6! h-6!" />
              Add Plan
            </Button>
          </div>

          {plans.length === 0 ? (
            <div
              className={cn(
                "text-center py-10 text-natural-text/50 border border-dashed rounded-xl text-sm",
                errors.plans ? "border-red-300 bg-red-50/50" : "border-gray-200"
              )}
            >
              No plans added yet. Click &quot;Add Plan&quot; to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const planErr = errors.planErrors?.[index] ?? {}
                return (
                  <div
                    key={index}
                    className={cn(
                      "p-5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-4 transition-all duration-300",
                      !plan.isActive && "bg-gray-100/30 border-dashed"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <select
                        value={plan.billingPeriod}
                        onChange={(e) =>
                          updatePlan(index, { billingPeriod: e.target.value as BillingPeriod })
                        }
                        className="font-bold text-gray-900 bg-transparent border-none outline-none cursor-pointer text-sm"
                      >
                        {BILLING_PERIODS.map((period) => (
                          <option
                            key={period}
                            value={period}
                            disabled={usedPeriods.includes(period) && period !== plan.billingPeriod}
                          >
                            {formatPeriod(period)}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <Switch
                            checked={plan.isActive}
                            onCheckedChange={(v) => updatePlan(index, { isActive: v })}
                            className="data-[state=checked]:bg-primary-blue h-5 w-9 [&>span]:w-4 [&>span]:h-4"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removePlan(index)}
                          className="text-natural-text/40 hover:text-danger transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex flex-col gap-4 transition-all duration-300",
                        !plan.isActive && "opacity-20 grayscale pointer-events-none select-none blur-[1px]"
                      )}
                    >
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-natural-text">Price (EGP)</Label>
                        <Input
                          type="number"
                          className={cn("h-9 bg-white", planErr.price && "border-red-400")}
                          value={plan.price}
                          onChange={(e) => updatePlan(index, { price: Number(e.target.value) })}
                        />
                        {planErr.price && <p className="text-xs text-red-500">{planErr.price}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-natural-text">Trial Days</Label>
                        <Input
                          type="number"
                          className={cn("h-9 bg-white", planErr.trialDays && "border-red-400")}
                          value={plan.trialDays}
                          onChange={(e) => updatePlan(index, { trialDays: Number(e.target.value) })}
                        />
                        {planErr.trialDays && <p className="text-xs text-red-500">{planErr.trialDays}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-natural-text">Conversation Credits</Label>
                        <Input
                          type="number"
                          className={cn("h-9 bg-white", planErr.aiConversationCredits && "border-red-400")}
                          value={plan.aiConversationCredits}
                          onChange={(e) =>
                            updatePlan(index, { aiConversationCredits: Number(e.target.value) })
                          }
                        />
                        {planErr.aiConversationCredits && (
                          <p className="text-xs text-red-500">{planErr.aiConversationCredits}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-natural-text">Report Credits</Label>
                        <Input
                          type="number"
                          className={cn("h-9 bg-white", planErr.aiReportCredits && "border-red-400")}
                          value={plan.aiReportCredits}
                          onChange={(e) =>
                            updatePlan(index, { aiReportCredits: Number(e.target.value) })
                          }
                        />
                        {planErr.aiReportCredits && (
                          <p className="text-xs text-red-500">{planErr.aiReportCredits}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 mt-5">
          <Button
            className="w-full px-10 h-12 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg font-semibold min-w-[140px]"
            onClick={handleAdd}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="ghost"
            className="w-full px-8 h-12 text-natural-text hover:text-black hover:bg-natural rounded-lg"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
