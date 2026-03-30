"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import ArrowDownIcon from "@/public/arrow-down-icon"
import SendOutlineIcon from "@/public/send-outline-icon"
import EditIcon from "@/public/edit-icon"
import CancelIcon from "@/public/cancel-icon"
import RestoreIcon from "@/public/restore-icon"
import ClockIcon from "@/public/clock-icon"
import { Button } from "@/components/ui/button"
import { NotificationTemplate } from "@/services/queries/notifications/get/get-all-notifications"
import { sendNotification } from "@/services/queries/notifications/post/post-send-notifications"
import { TargetAudience, SubscriptionFilter } from "@/services/queries/notifications/post/post-create-template"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const formatLabel = (val: string) => val.replace(/_/g, " ").toLowerCase()

interface NotificationsTableProps {
  notifications: NotificationTemplate[]
  selectedIds: string[]
  onToggleSelect: (id: string, checked: boolean) => void
  onToggleSelectAll: (checked: boolean) => void
  allSelected: boolean
  someSelected: boolean
  onCancel: (id: string) => void
  onRestore: (id: string) => void
  onEdit: (id: string) => void
}

export function NotificationsTable({
  notifications,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  allSelected,
  someSelected,
  onCancel,
  onRestore,
  onEdit,
}: NotificationsTableProps) {
  const [sendingId, setSendingId] = React.useState<string | null>(null)

  const handleSendAction = async (notification: NotificationTemplate) => {
    setSendingId(notification.id)
    try {
      const payload = {
        title: notification.title,
        message: notification.message,
        targetAudience: notification.targetAudience as TargetAudience,
        subscriptionFilter: notification.subscriptionFilter as SubscriptionFilter,
      }
      const res = await sendNotification(payload)
      if (res.success) {
        toast(res.message || "Notification sent successfully ✅")
      } else {
        toast(res.message || "Failed to send notification ❌")
      }
    } catch (e) {
      toast("An error occurred while sending the notification ❌")
      console.error(e)
    } finally {
      setSendingId(null)
    }
  }

  return (
    <Table>
      <TableHeader className="bg-light-natural">
        <TableRow>
          <TableHead>
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={(checked) => onToggleSelectAll(Boolean(checked))}
            />
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Title
              <ArrowDownIcon className="w-4 h-4 fill-natural" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Message
              <ArrowDownIcon className="w-4 h-4 fill-natural" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Target
              <ArrowDownIcon className="w-4 h-4 fill-natural" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Repetition
              <ArrowDownIcon className="w-4 h-4 fill-natural" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Status
              <ArrowDownIcon className="w-4 h-4 fill-natural" />
            </div>
          </TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notifications.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-natural-text">
              No notifications found
            </TableCell>
          </TableRow>
        ) : (
          notifications.map((notification) => {
            const isCanceled = notification.status === "CANCELED" || notification.status === "CANCELLED"

            return (
              <TableRow
                key={notification.id}
                className={cn("hover:bg-gray-50/50 group transition-all duration-300", isCanceled && "bg-danger/5 hover:bg-danger/5")}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(notification.id)}
                    onCheckedChange={(checked) =>
                      onToggleSelect(notification.id, Boolean(checked))
                    }
                    disabled={notification.status !== "PENDING"}
                  />
                </TableCell>
                <TableCell className="max-w-[220px]">
                  <div className={cn(
                    "w-full overflow-hidden transition-all duration-500 ease-in-out max-h-6 group-hover:max-h-40 cursor-default",
                    isCanceled && "opacity-50 grayscale-[0.8]"
                  )}>
                    <p className="whitespace-normal leading-6">
                      {notification.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="max-w-md transition-all duration-300">
                  <div className={cn(
                    "w-full overflow-hidden transition-all duration-500 ease-in-out max-h-6 group-hover:max-h-40 cursor-default group-hover:overflow-y-auto",
                    isCanceled && "opacity-50 grayscale-[0.8]"
                  )}>
                    <p className="leading-6">
                      {notification.message}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary-blue/10 text-primary-blue capitalize`,
                    isCanceled && "opacity-50 grayscale-[0.8]"
                  )}>
                    {formatLabel(notification.targetAudience)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-natural text-natural-text text-sm border capitalize",
                    isCanceled && "opacity-50 grayscale-[0.8]"
                  )}>
                    <ClockIcon className="h-4! w-4! text-natural-text" />
                    {notification.recurrenceRule === "NONE" ? "manually" : formatLabel(notification.recurrenceRule)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center lowercase gap-1.5 px-3 py-1 rounded-full text-sm font-medium capitalize",
                    notification.status === "SENT" && "bg-success/10 text-success",
                    notification.status === "PENDING" && "bg-gray-100 text-gray-600",
                    (notification.status === "CANCELED" || notification.status === "CANCELLED") && "bg-danger/10 text-danger",
                    notification.status === "PROCESSING" && "bg-primary-blue/10 text-primary-blue",
                    notification.status === "FAILED" && "bg-danger/10 text-danger",
                    !["SENT", "PENDING", "CANCELED", "PROCESSING", "FAILED"].includes(notification.status) && "bg-natural text-natural-text border"
                  )}>
                    {formatLabel(notification.status)}
                  </div>
                </TableCell>
                <TableCell className="py-0">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      title={isCanceled ? "Cannot send cancelled notification" : "Send"}
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8 text-success hover:text-success hover:bg-success/10", isCanceled && "opacity-50 grayscale-[0.8]")}
                      onClick={() => !isCanceled && handleSendAction(notification)}
                      disabled={sendingId === notification.id || isCanceled}
                    >
                      {sendingId === notification.id ? (
                        <Loader2 className="h-5! w-5! animate-spin" />
                      ) : (
                        <SendOutlineIcon className="h-5! w-5!" />
                      )}
                    </Button>
                    <Button
                      title={isCanceled ? "Template is cancelled" : "Edit"}
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8 text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10", isCanceled && "opacity-50 grayscale-[0.8]")}
                      onClick={() => !isCanceled && onEdit(notification.id)}
                      disabled={isCanceled}
                    >
                      <EditIcon className="h-5! w-5!" />
                    </Button>
                    {isCanceled ? (
                      <Button
                        title="Restore"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                        onClick={() => onRestore(notification.id)}
                      >
                        <RestoreIcon className="h-5! w-5!" />
                      </Button>
                    ) : (
                      <Button
                        title="Cancel"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => onCancel(notification.id)}
                      >
                        <CancelIcon className="h-5! w-5!" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
