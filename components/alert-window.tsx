import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { ReactNode } from "react"

interface AlertWindowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  icon?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: "default" | "destructive" | "success"
}

export function AlertWindow({
  open,
  onOpenChange,
  title,
  description,
  icon,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: AlertWindowProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] z-[9999] flex flex-col items-center justify-center text-center p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        {icon && (
          <div
            className={cn(
              "mb-4 flex h-20 w-20 items-center justify-center rounded-full",
              variant === "destructive" && "bg-danger/10 text-danger",
              variant === "success" && "bg-success/10 text-success",
              variant === "default" && "bg-primary-blue/10 text-primary-blue"
            )}
          >
            {icon}
          </div>
        )}

        <AlertDialogHeader className="flex flex-col items-center space-y-2">
          <AlertDialogTitle className="text-xl font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex w-full flex-row items-center justify-center gap-4 sm:justify-center sm:space-x-0">
          <Button
            className="p-6 w-full bg-danger/80 hover:bg-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            className="shadow-none p-6 w-full text-natural-text bg-white hover:text-black hover:bg-natural"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
