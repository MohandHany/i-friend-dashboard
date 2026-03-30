"use client";

import { useState } from "react";
import { toast } from "sonner";
import { postReplyOnTicket } from "@/services/queries/help-and-support/post/post-reply-on-ticket";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getOneTicket } from "@/services/queries/help-and-support/get/get-one-ticket";

interface AddReplyProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  onSuccess?: () => void;
}

export default function AddReplyCard({ isOpen, onClose, ticketId, onSuccess }: AddReplyProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setMessage("");
    setError("");
    onClose();
  };

  const handleSend = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    setError("");
    setLoading(true);
    const res = await postReplyOnTicket({ ticketId, message: message.trim() });
    const ticketData = await getOneTicket(ticketId);
    const status = ticketData.data?.status;
    setLoading(false);
    if (res.success) {
      toast(res.message || "Reply sent successfully ✅");
      handleClose();
      if (onSuccess) onSuccess();
    } else {
      toast(res.message || status === "CLOSED" ? "Ticket is closed 🔒" : "Failed to send reply ❌");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="max-w-[500px] z-[9999] flex flex-col items-center justify-center p-0 overflow-hidden bg-transparent border-none shadow-none gap-0">
        <Card className="w-[500px] rounded-2xl bg-white shadow-lg border-0 m-0 relative p-6">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 space-y-0 relative border-b-0">
            <AlertDialogTitle className="text-lg font-medium p-0 m-0 leading-none">Reply</AlertDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2 w-full text-left">
              <Label>Message</Label>
              <textarea
                className={`min-h-[160px] w-full resize-none rounded-xl bg-natural border p-3 text-sm outline-none placeholder:text-natural-text focus:ring-2 focus:ring-primary-blue focus:ring-offset-1 transition-all disabled:opacity-50 ${error && "ring-2 ring-danger"}`}
                placeholder="Message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading}
              />
              {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
            </div>

            <AlertDialogFooter className="flex w-full flex-row items-center justify-center gap-4 sm:justify-center sm:space-x-0">
              <Button
                className="p-6 h-12 w-1/2 rounded-[14px] bg-primary-blue text-base font-semibold text-white hover:bg-primary-blue-hover transition-colors disabled:opacity-50"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
              <Button
                variant="ghost"
                className="shadow-none p-6 h-12 w-1/2 rounded-[14px] text-base font-semibold text-natural-text bg-white hover:text-black hover:bg-natural transition-colors disabled:opacity-50"
                onClick={handleClose}
                disabled={loading}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
