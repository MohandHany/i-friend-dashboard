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
import { X } from "lucide-react"
import { createNotificationTemplate, TargetAudience, SubscriptionFilter, RecurrenceRule } from "@/services/queries/notifications/post/post-create-template"
import { toast } from "sonner"

const TARGET_OPTIONS: string[] = ["PARENTS", "CHILDREN", "ALL"]
const SUBSCRIPTION_OPTIONS: string[] = ["SUBSCRIBED", "NOT_SUBSCRIBED", "ALL"]
const REPETITION_OPTIONS: string[] = ["DAILY", "WEEKLY", "MONTHLY", "NONE"]

const formatOption = (val: string) => val.replace(/_/g, " ").toLowerCase()

interface CreateTemplateCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

interface FormErrors {
  title?: string
  description?: string
  target?: string
  subscriptionState?: string
  repetition?: string
  scheduleAt?: string
}

export function CreateTemplateCard({ open, onOpenChange, onCreated }: CreateTemplateCardProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [target, setTarget] = React.useState<TargetAudience | "">("")
  const [subscriptionState, setSubscriptionState] = React.useState<SubscriptionFilter | "">("")
  const [repetition, setRepetition] = React.useState<RecurrenceRule | "">("")
  const [scheduleAt, setScheduleAt] = React.useState("")
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const [targetOpen, setTargetOpen] = React.useState(false)
  const [subscriptionOpen, setSubscriptionOpen] = React.useState(false)
  const [repetitionOpen, setRepetitionOpen] = React.useState(false)

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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreate = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        title,
        message: description,
        targetAudience: target as TargetAudience,
        subscriptionFilter: subscriptionState as SubscriptionFilter,
        scheduledAt: scheduleAt ? new Date(scheduleAt).toISOString() : new Date().toISOString(),
        recurrenceRule: repetition as RecurrenceRule,
      }
      const res = await createNotificationTemplate(payload)
      if (res.success) {
        toast("Notification template created successfully ✅")
        onCreated?.()
        handleClose()
      } else {
        toast(res.message || "Failed to create template ❌")
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
          {/* X close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 transition-opacity hover:opacity-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <h2 className="text-xl font-medium">Create Template</h2>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="template-title">
                Title <span className="text-danger">*</span>
              </Label>
              <Input
                id="template-title"
                placeholder="Title"
                className="bg-natural placeholder:text-natural-text/50"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((prev) => ({ ...prev, title: undefined })) }}
              />
              {errors.title && <p className="text-xs text-danger">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="template-description" >
                Message <span className="text-danger">*</span>
              </Label>
              <textarea
                id="template-description"
                placeholder="Message"
                rows={5}
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

            {/* Target & Subscription State — side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Target dropdown */}
              <div className="space-y-2">
                <Label>
                  Target <span className="text-danger">*</span>
                </Label>
                <Popover open={targetOpen} onOpenChange={setTargetOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-natural hover:bg-gray-100 font-normal",
                        !target ? "text-natural-text/50" : "text-natural-text capitalize"
                      )}
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
                          onClick={() => {
                            setTarget(option)
                            setTargetOpen(false)
                            if (errors.target) setErrors((prev) => ({ ...prev, target: undefined }))
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural",
                            target === option && "bg-natural font-medium"
                          )}
                        >
                          {formatOption(option)}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.target && <p className="text-xs text-danger">{errors.target}</p>}
              </div>

              {/* Subscription State dropdown */}
              <div className="space-y-2">
                <Label>
                  Subscription State <span className="text-danger">*</span>
                </Label>
                <Popover open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-natural hover:bg-gray-100 font-normal",
                        !subscriptionState ? "text-natural-text/50" : "text-natural-text capitalize"
                      )}
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
                          onClick={() => {
                            setSubscriptionState(option)
                            setSubscriptionOpen(false)
                            if (errors.subscriptionState) setErrors((prev) => ({ ...prev, subscriptionState: undefined }))
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural",
                            subscriptionState === option && "bg-natural font-medium"
                          )}
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

            {/* Repetition dropdown */}
            <div className="space-y-2">
              <Label>
                Repetition <span className="text-danger">*</span>
              </Label>
              <Popover open={repetitionOpen} onOpenChange={setRepetitionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-natural hover:bg-gray-100 font-normal",
                      !repetition ? "text-natural-text/50" : "text-natural-text capitalize"
                    )}
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
                        onClick={() => {
                          setRepetition(option)
                          setRepetitionOpen(false)
                          if (errors.repetition) setErrors((prev) => ({ ...prev, repetition: undefined }))
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-md capitalize transition-colors hover:bg-natural",
                          repetition === option && "bg-natural font-medium"
                        )}
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
            <div className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-at">
                  Schedule At <span className="text-danger">*</span>
                </Label>
                <Input
                  id="schedule-at"
                  type="date"
                  className="bg-natural placeholder:text-natural-text/50"
                  value={scheduleAt}
                  onChange={(e) => {
                    setScheduleAt(e.target.value)
                    if (errors.scheduleAt) setErrors((prev) => ({ ...prev, scheduleAt: undefined }))
                  }}
                />
                {errors.scheduleAt && <p className="text-xs text-danger">{errors.scheduleAt}</p>}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center gap-4">
            <Button
              className="flex-1 p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg"
              onClick={handleCreate}
              disabled={submitting}
            >
              Create
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
