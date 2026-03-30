"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EditIcon from "@/public/edit-icon"
import { SubscriptionPackage } from "@/services/queries/subscription/get/get-all-packages"
import { cn } from "@/lib/utils"

interface PackageCardProps {
  pkg: SubscriptionPackage
  onDeletePlan: (planId: string) => void
  onEdit?: () => void
  onDelete?: () => void
}

export function PackageCard({ pkg, onDeletePlan, onEdit, onDelete }: PackageCardProps) {
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden border-none shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between p-6">
        {/* Left: package name + max children — dimmed when inactive */}
        <div className={cn("flex items-center gap-4 transition-all duration-300", !pkg.isActive && "opacity-50 grayscale select-none")}>
          <h3 className="text-xl font-semibold rounded-full px-4 py-1 flex items-center gap-2 text-natural-text bg-natural-text/10 shrink-0">
            {pkg.name}
            {/* Status dot — dimmed when inactive */}
            <div
              className={cn("relative transition-all duration-300", !pkg.isActive && "opacity-50 grayscale select-none")}
              title={pkg.isActive ? "Active" : "Inactive"}
            >
              <div className={cn("w-3 h-3 rounded-full", pkg.isActive ? "bg-success/80" : "bg-natural-text/50")} />
              {pkg.isActive && <div className="w-3 h-3 rounded-full absolute top-0 right-0 bg-success/80 animate-ping" />}
            </div>
          </h3>
          <div className="text-sm text-natural-text flex items-center gap-2 border-l border-gray-100 pl-4 h-6">
            <span className="font-medium">Max Children:</span>
            <span className="text-black">{pkg.maxChildren}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Edit button — always full style regardless of package status */}
          <Button onClick={onEdit} variant="ghost" className="text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 transition-colors">
            <EditIcon className="w-5! h-5!" />
            Edit
          </Button>
        </div>
      </div>

      {/* Dimmed section: description + plans table — Edit button above is intentionally excluded */}
      <div className={cn("transition-all duration-300", !pkg.isActive && "opacity-50 grayscale select-none")}>

        {pkg.description && (
          <div className="px-6 pb-6 flex flex-col gap-1.5">
            <span className="font-medium text-natural-text">Description:</span>
            <p className="leading-relaxed whitespace-pre-wrap break-words">
              {pkg.description}
            </p>
          </div>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-light-natural text-natural-text">
                <TableHead className="text-center px-6">Billing Period</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Trial Days</TableHead>
                <TableHead className="text-center">AI Conversation Credits</TableHead>
                <TableHead className="text-center">AI Report Credits</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pkg.plans.map((plan) => (
                <TableRow key={plan.id} className="border-gray-50 hover:bg-gray-50/30">
                  <TableCell className="text-center px-6">
                    {plan.billingPeriod === "THREE_MONTHS"
                      ? "3 Months"
                      : plan.billingPeriod
                        .toLowerCase()
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </TableCell>
                  <TableCell className="text-center">
                    {Number(plan.price) > 0 ? (
                      <span className="inline-block text-sm">
                        {plan.price} {plan.currency}
                      </span>
                    ) : (
                      <span className="text-natural-text">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {plan.trialDays > 0 ? (
                      <span className="inline-block text-sm">
                        {plan.trialDays} days
                      </span>
                    ) : (
                      <span className="text-natural-text">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {plan.aiConversationCredits > 0 ? (
                      <span className="inline-block text-sm">
                        {plan.aiConversationCredits.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-natural-text">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {plan.aiReportCredits > 0 ? (
                      <span className="inline-block text-sm">
                        {plan.aiReportCredits.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-natural-text">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn("px-3 py-1 rounded-full", plan.isActive ? "text-success bg-success/10" : "text-danger bg-danger/10")}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
    </Card>
  )
}
