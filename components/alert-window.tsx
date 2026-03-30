import {
  AlertDialog,
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
  onOpenChange: (open: boolean) => any
  title?: string
  description?: string
  icon?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => any
  onCancel?: () => any
  variant?: "default" | "destructive" | "success"
  children?: ReactNode
  className?: string
  hideButtons?: boolean
  closeOnOutsideClick?: boolean
  disabled?: boolean
}

export function AlertWindow({
  open,
  onOpenChange,
  title,
  description,
  icon,
  confirmText = "Continue",
  cancelText = "Close",
  onConfirm,
  onCancel,
  variant = "default",
  children,
  className,
  hideButtons = false,
  closeOnOutsideClick = false,
  disabled = false,
}: AlertWindowProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          "max-w-[400px] z-9999 flex flex-col items-center justify-center text-center p-6",
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => onOpenChange(false)}
          disabled={disabled}
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

        {(title || description) && (
          <AlertDialogHeader className="flex flex-col items-center space-y-2">
            {title && (
              <AlertDialogTitle className="text-xl font-bold text-center">
                {title}
              </AlertDialogTitle>
            )}
            {description && (
              <AlertDialogDescription className="text-center text-muted-foreground">
                {description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}

        {children}

        {!hideButtons && onConfirm && (
          <AlertDialogFooter className="flex w-full flex-row items-center justify-center gap-4 sm:justify-center sm:space-x-0 mt-4">
            <Button
              className="p-6 w-1/2 bg-danger/80 hover:bg-danger"
              onClick={onConfirm}
              disabled={disabled}
            >
              {confirmText}
            </Button>
            {onCancel && (
              <Button
                className="shadow-none p-6 w-1/2 text-natural-text bg-white hover:text-black hover:bg-natural"
                onClick={onCancel}
                disabled={disabled}
              >
                {cancelText}
              </Button>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
