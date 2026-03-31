"use client"

import { Button } from "@/components/ui/button"
import { FeedbackItem } from "@/services/queries/feedback/get/get-all-feedbacks"
import CallIcon from "@/public/call-outline-icon"
import MailIcon from "@/public/mail-icon"

import { AlertWindow } from "@/components/alert-window"
import { AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

interface ViewFeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedback: FeedbackItem | null
}

export function ViewFeedbackModal({ open, onOpenChange, feedback }: ViewFeedbackModalProps) {
  const fullName = feedback ? `${feedback.parent.firstName} ${feedback.parent.lastName}` : "";

  return (
    <AlertWindow
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-[440px] p-6 gap-8 flex flex-col items-start text-left"
    >
      <AlertDialogTitle className="text-xl mb-2">
        View <span className="text-natural-text">{fullName}</span>
      </AlertDialogTitle>

      <div className="space-y-3 w-full">
        <Label>Message</Label>
        <div className="w-full bg-natural rounded-xl border p-3 min-h-[140px] text-natural-text text-left">
          {feedback?.comment}
        </div>
      </div>

      <div className="flex  gap-4 w-full">
        <Button
          className="flex-1 bg-primary-blue hover:bg-primary-blue-hover text-white h-12 rounded-xl gap-2 font-bold transition-all"
          onClick={() => feedback?.parent.user.email && window.open(`mailto:${feedback.parent.user.email}`)}
        >
          <MailIcon className="w-5! h-5!" />
          <span className="hidden sm:block">Reply to Email</span>
        </Button>
        <Button
          className="flex-1 bg-primary-blue hover:bg-primary-blue-hover text-white h-12 rounded-xl gap-2 font-bold transition-all"
          onClick={() => feedback?.parent.phoneNumber && window.open(`tel:${feedback.parent.phoneNumber}`)}
        >
          <CallIcon className="w-5! h-5!" />
          <span className="hidden sm:block">Call to phone</span>
        </Button>
      </div>
    </AlertWindow>
  )
}