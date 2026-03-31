"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import ArrowDown2Icon from "@/public/arrow-down-2-icon"
import { X, Loader2 } from "lucide-react"
import { TargetAudience, SubscriptionFilter, RecurrenceRule } from "@/services/queries/notifications/post/post-create-template"
import { getNotificationTemplate } from "@/services/queries/notifications/get/get-one-notification"
import { updateNotificationTemplate } from "@/services/queries/notifications/patch/patch-update-template"
import { toast } from "sonner"

const TARGET_OPTIONS: string[] = ["PARENTS", "CHILDREN", "ALL"]
const SUBSCRIPTION_OPTIONS: string[] = ["SUBSCRIBED", "NOT_SUBSCRIBED", "ALL"]
const REPETITION_OPTIONS: string[] = ["DAILY", "WEEKLY", "MONTHLY", "NONE"]
const STATUS_OPTIONS: string[] = ["PENDING", "SENT", "CANCELED", "PROCESSING", "FAILED"]

const formatOption = (val: string) => val.replace(/_/g, " ").toLowerCase()

interface EditTemplateCardProps {
  open: boolean
  templateId: string | null
  onOpenChange: (open: boolean) => void
  onUpdated?: () => void
}

interface FormErrors {
  title?: string
  description?: string
  target?: string
  subscriptionState?: string
  repetition?: string
  scheduleAt?: string
  status?: string
}

export function EditTemplateCard({ open, templateId, onOpenChange, onUpdated }: EditTemplateCardProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [target, setTarget] = React.useState<TargetAudience | "">("")
  const [subscriptionState, setSubscriptionState] = React.useState<SubscriptionFilter | "">("")
  const [repetition, setRepetition] = React.useState<RecurrenceRule | "">("")
  const [scheduleAt, setScheduleAt] = React.useState("")
  const [status, setStatus] = React.useState<string>("")

  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [isClosing, setIsClosing] = React.useState(false)

  const [targetOpen, setTargetOpen] = React.useState(false)
  const [subscriptionOpen, setSubscriptionOpen] = React.useState(false)
  const [repetitionOpen, setRepetitionOpen] = React.useState(false)
  const [statusOpen, setStatusOpen] = React.useState(false)

  // Fetch data
  React.useEffect(() => {
    if (open && templateId) {
      const fetchData = async () => {
        setLoading(true)
        try {
          const res = await getNotificationTemplate(templateId)
          if (res.success && res.data) {
            const n = res.data
            setTitle(n.title)
            setDescription(n.message)
            setTarget(n.targetAudience as TargetAudience)
            setSubscriptionState(n.subscriptionFilter as SubscriptionFilter)
            setRepetition(n.recurrenceRule as RecurrenceRule)
            // format date for input
            if (n.scheduledAt) {
              setScheduleAt(new Date(n.scheduledAt).toISOString().split('T')[0])
            }
            setStatus(n.status)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [open, templateId])

  // Lock body scroll while open
  React.useEffect(() => {
    if (open || isClosing) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [open, isClosing])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
      setTitle("")
      setDescription("")
      setTarget("")
      setSubscriptionState("")
      setRepetition("")
      setScheduleAt("")
      setStatus("")
      setErrors({})
    }, 200)
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!target) newErrors.target = "Target is required"
    if (!subscriptionState) newErrors.subscriptionState = "Subscription State is required"
    if (!repetition) newErrors.repetition = "Repetition is required"
    if (!scheduleAt) newErrors.scheduleAt = "Schedule At is required"
    if (!status) newErrors.status = "Status is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdate = async () => {
    if (!validate() || !templateId) return
    setSubmitting(true)
    try {
      const payload = {
        title,
        message: description,
        targetAudience: target as TargetAudience,
        subscriptionFilter: subscriptionState as SubscriptionFilter,
        scheduledAt: scheduleAt ? new Date(scheduleAt).toISOString() : new Date().toISOString(),
        recurrenceRule: repetition as RecurrenceRule,
        status: status,
      }
      const res = await updateNotificationTemplate(templateId, payload)
      if (res.success) {
        toast("Notification template updated successfully ✅")
        onUpdated?.()
        handleClose()
      } else {
        toast(res.message || "Failed to update template ❌")
        console.error(res.message)
      }
    } catch (e) {
      toast("Something went wrong. Please try again. ❌")
      console.error(e)
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
          "relative w-[95vw] sm:w-full max-w-md bg-white rounded-2xl shadow-lg p-6 duration-200",
          isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50"
        )}
      >
        <div className="flex flex-col space-y-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 transition-opacity hover:opacity-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <h2 className="text-xl font-medium">Edit Template</h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="edit-template-title">
                  Title <span className="text-danger">*</span>
                </Label>
                <Input
                  id="edit-template-title"
                  placeholder="Title"
                  className="bg-natural placeholder:text-natural-text/50"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((prev) => ({ ...prev, title: undefined })) }}
                />
                {errors.title && <p className="text-xs text-danger">{errors.title}</p>}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="edit-template-description" >
                  Message <span className="text-danger">*</span>
                </Label>
                <textarea
                  id="edit-template-description"
                  placeholder="Message"
                  rows={4}
                  className={cn(
                    "w-full rounded-md border border-input bg-natural px-3 py-2 text-sm resize-none",
                    "placeholder:text-natural-text/50 outline-none focus:ring-2",
                    "focus:ring-primary-blue focus:ring-offset-1 transition-all"
                  )}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((prev) => ({ ...prev, description: undefined })) }}
                />
                {errors.description && <p className="text-xs text-danger">{errors.description}</p>}
              </div>

              {/* Target & Subscription side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target <span className="text-danger">*</span></Label>
                  <Popover open={targetOpen} onOpenChange={setTargetOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-between bg-natural hover:bg-gray-100 font-normal", !target ? "text-natural-text/50" : "text-natural-text capitalize")}
                      >
                        {target ? formatOption(target) : "Select Target"}
                        <ArrowDown2Icon className={`h-4 w-4 opacity-50 transition-all duration-300 ${targetOpen ? "rotate-180" : ""}`} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 p-2 z-99999" align="start">
                      <div className="flex flex-col gap-1">
                        {TARGET_OPTIONS.map((option) => (
                          <button
                            key={option}
                            onClick={() => { setTarget(option as TargetAudience); setTargetOpen(false); if (errors.target) setErrors(p => ({ ...p, target: undefined })) }}
                            className={cn("w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural", target === option && "bg-natural font-medium")}
                          >
                            {formatOption(option)}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.target && <p className="text-xs text-danger">{errors.target}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Subscription <span className="text-danger">*</span></Label>
                  <Popover open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-between bg-natural hover:bg-gray-100 font-normal", !subscriptionState ? "text-natural-text/50" : "text-natural-text capitalize")}
                      >
                        {subscriptionState ? formatOption(subscriptionState) : "Select State"}
                        <ArrowDown2Icon className={`h-4 w-4 opacity-50 transition-all duration-300 ${subscriptionOpen ? "rotate-180" : ""}`} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 p-2 z-99999" align="start">
                      <div className="flex flex-col gap-1">
                        {SUBSCRIPTION_OPTIONS.map((option) => (
                          <button
                            key={option}
                            onClick={() => { setSubscriptionState(option as SubscriptionFilter); setSubscriptionOpen(false); if (errors.subscriptionState) setErrors(p => ({ ...p, subscriptionState: undefined })) }}
                            className={cn("w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural", subscriptionState === option && "bg-natural font-medium")}
                          >
                            {formatOption(option)}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.subscriptionState && <p className="text-xs text-danger">{errors.subscriptionState}</p>}
                </div>
              </div>

              {/* Repetition */}
              <div className="space-y-2">
                <Label>Repetition <span className="text-danger">*</span></Label>
                <Popover open={repetitionOpen} onOpenChange={setRepetitionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-between bg-natural hover:bg-gray-100 font-normal", !repetition ? "text-natural-text/50" : "text-natural-text capitalize")}
                    >
                      {repetition === "NONE" ? "Manually" : (repetition ? formatOption(repetition) : "Select Repetition")}
                      <ArrowDown2Icon className={`h-4 w-4 opacity-50 transition-all duration-300 ${repetitionOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-2 z-99999" align="start">
                    <div className="flex flex-col gap-1">
                      {REPETITION_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setRepetition(option as RecurrenceRule); setRepetitionOpen(false); if (errors.repetition) setErrors(p => ({ ...p, repetition: undefined })) }}
                          className={cn("w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural", repetition === option && "bg-natural font-medium")}
                        >
                          {option === "NONE" ? "manually" : formatOption(option)}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.repetition && <p className="text-xs text-danger">{errors.repetition}</p>}
              </div>

              {/* Schedule At */}
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-at">Schedule At <span className="text-danger">*</span></Label>
                <Input
                  id="edit-schedule-at"
                  type="date"
                  className="bg-natural placeholder:text-natural-text/50"
                  value={scheduleAt}
                  onChange={(e) => { setScheduleAt(e.target.value); if (errors.scheduleAt) setErrors(p => ({ ...p, scheduleAt: undefined })) }}
                />
                {errors.scheduleAt && <p className="text-xs text-danger">{errors.scheduleAt}</p>}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>
                  Status <span className="text-danger">*</span>
                </Label>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-natural hover:bg-gray-100 font-normal",
                        !status ? "text-natural-text/50" : "text-natural-text capitalize"
                      )}
                    >
                      {status ? formatOption(status) : "Select Status"}
                      <ArrowDown2Icon className={`h-4 w-4 opacity-50 transition-all duration-300 ${statusOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-2 z-99999" align="start">
                    <div className="flex flex-col gap-1">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setStatus(option)
                            setStatusOpen(false)
                            if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }))
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural",
                            status === option && "bg-natural font-medium"
                          )}
                        >
                          {formatOption(option)}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.status && <p className="text-xs text-danger">{errors.status}</p>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button
              className="flex-1 p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleUpdate}
              disabled={submitting || loading}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="ghost"
              className="flex-1 p-6 text-natural-text hover:text-black hover:bg-natural"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
