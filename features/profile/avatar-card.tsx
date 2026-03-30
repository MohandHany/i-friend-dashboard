"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { patchUpdateMe } from "@/services/queries/settings/user/patch/patch-update-me"
import { toast } from "sonner"
import Image from "next/image"
import { ImageCropDialog } from "@/components/image-crop-dialog"
import DeleteIcon from "@/public/delete-icon"
import UploadIcon from "@/public/upload-icon"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UpdateAvatarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newAvatarUrl: string | null) => void
  currentAvatarUrl?: string | null
}

export function AvatarCard({ open, onOpenChange, onSuccess, currentAvatarUrl }: UpdateAvatarDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [cropOpen, setCropOpen] = React.useState(false)
  const [cropImage, setCropImage] = React.useState<string>("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleClose = () => {
    onOpenChange(false)
    setFile(null)
    setPreview(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)")
        return
      }
      const imageUrl = URL.createObjectURL(selectedFile)
      setCropImage(imageUrl)
      setCropOpen(true)
      e.target.value = ""
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    setFile(croppedFile)
    setPreview(URL.createObjectURL(croppedFile))
    setCropOpen(false)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const res = await patchUpdateMe({ avatarUrl: file })
      if (res.success) {
        toast("Avatar updated successfully ✅")
        const newUrl = res.data?.avatarUrl
        if (newUrl) {
          onSuccess(newUrl)
        } else if (preview) {
          onSuccess(preview)
        }
        handleClose()
      } else {
        toast(res.message || "Failed to update avatar ❌")
      }
    } catch (e) {
      toast("An error occurred ❌")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    try {
      const res = await patchUpdateMe({ avatarUrl: "" })
      if (res.success) {
        toast("Avatar removed successfully ✅")
        onSuccess(null)
        handleClose()
      } else {
        toast(res.message || "Failed to remove avatar ❌")
      }
    } catch (e) {
      toast("An error occurred ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm p-6">
        {/* Hidden title for screen readers (Radix accessibility requirement) */}
        <AlertDialogTitle className="sr-only">Profile Picture</AlertDialogTitle>
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-6 w-6 rounded-full opacity-70 transition-opacity hover:opacity-100"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <h2 className="text-xl font-medium mb-6">Update Profile Picture</h2>

        <div className="flex flex-col items-center gap-6">
          <div className="w-fit h-fit relative">
            <div
              className="relative w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-natural bg-gray-50 flex items-center justify-center group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : currentAvatarUrl ? (
                <Image src={currentAvatarUrl} alt="Current" fill className="object-cover" />
              ) : (
                <UploadIcon className="h-8 w-8 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UploadIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            {currentAvatarUrl && !preview && (
              <div className="absolute bottom-0 right-0 bg-white group hover:scale-105 transition-all duration-300 rounded-xl border-4 border-natural shadow-md">
                <Button
                  variant="ghost"
                  className="text-danger group-hover:bg-danger/10 group-hover:text-danger hover:bg-danger/10 hover:text-danger transition-all duration-300 p-1"
                  onClick={handleRemove}
                  disabled={loading}
                >
                  <DeleteIcon className="h-5! w-5!" />
                </Button>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="flex gap-3 w-full">
            <Button
              className="flex-1 bg-primary-blue hover:bg-primary-blue/90"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? "Uploading..." : "Save"}
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </div>

        <ImageCropDialog
          open={cropOpen}
          onOpenChange={setCropOpen}
          imageUrl={cropImage}
          onCropComplete={handleCropComplete}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}
