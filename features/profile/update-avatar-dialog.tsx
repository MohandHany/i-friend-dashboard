"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Upload } from "lucide-react"
import { patchUpdateMe } from "@/services/queries/settings/user/patch/patch-update-me"
import { toast } from "sonner"
import Image from "next/image"
import { ImageCropDialog } from "@/components/image-crop-dialog"
import DeleteIcon from "@/public/delete-icon"

interface UpdateAvatarDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newAvatarUrl: string | null) => void
  currentAvatarUrl?: string | null
}

export function UpdateAvatarDialog({ open, onOpenChange, onSuccess, currentAvatarUrl }: UpdateAvatarDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const [cropOpen, setCropOpen] = React.useState(false)
  const [cropImage, setCropImage] = React.useState<string>("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
      setFile(null)
      setPreview(null)
    }, 200)
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
      // Clear input value to allow selecting same file again
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

  if (!open && !isClosing) return null

  return (
    <div className={cn(
      "fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm duration-200",
      isClosing ? "animate-out fade-out-0" : "animate-in fade-in-0"
    )}>
      <div className={cn(
        "relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm duration-200 mx-4",
        isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50"
      )}>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-medium mb-6">Update Profile Picture</h2>

        <div className="flex flex-col items-center gap-6">
          <div className="w-fit h-fit relative">
            <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-natural bg-gray-50 flex items-center justify-center group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : currentAvatarUrl ? (
                <Image src={currentAvatarUrl} alt="Current" fill className="object-cover" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
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
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <ImageCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageUrl={cropImage}
        onCropComplete={handleCropComplete}
      />
    </div >
  )
}
