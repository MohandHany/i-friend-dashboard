"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAllRoles, RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import { getAllDashboardUsers, DashboardUserData } from "@/services/queries/settings/user/get/get-all-users"
import { postCreateDashboardUser, Request as CreateUserRequest } from "@/services/queries/settings/user/post/post-create-user"
import { toast } from "sonner"
import { X } from "lucide-react"
import { ImageCropDialog } from "@/components/image-crop-dialog"
import { AvatarUpload } from "./avatar-upload"
import { UserFormFields } from "./user-form-fields"
import { createValidationSchemas } from "./validation-schemas"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

const roleOptionsFallback = ["Administrator", "Admin", "Marketing"]

export function AddUserCard({ open, onOpenChange, onCreated }: AddUserDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("")
  const [roles, setRoles] = React.useState<RoleItemsData[]>([])
  const [isClosing, setIsClosing] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [avatarFile, setAvatarFile] = React.useState<File | undefined>(undefined)
  const [avatarPreview, setAvatarPreview] = React.useState<string | undefined>(undefined)
  const [tempImageUrl, setTempImageUrl] = React.useState<string | undefined>(undefined)
  const [cropDialogOpen, setCropDialogOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [passwordVisiblity, setPasswordVisiblity] = React.useState(false)
  const [rolePopoverOpen, setRolePopoverOpen] = React.useState(false)
  const [users, setUsers] = React.useState<DashboardUserData[]>([])
  const [nameError, setNameError] = React.useState<string>("")
  const [emailError, setEmailError] = React.useState<string>("")
  const [passwordError, setPasswordError] = React.useState<string>("")
  const [roleError, setRoleError] = React.useState<string>("")

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setSelectedRoleId("")
    setAvatarFile(undefined)
    setAvatarPreview(undefined)
    setTempImageUrl(undefined)
    setNameError("")
    setEmailError("")
    setPasswordError("")
    setRoleError("")
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onOpenChange(false)
      setIsClosing(false)
      resetForm()
    }, 200)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const tempUrl = URL.createObjectURL(file)
      setTempImageUrl(tempUrl)
      setCropDialogOpen(true)
    }
  }

  const handleCropComplete = (croppedFile: File) => {
    setAvatarFile(croppedFile)
    const previewUrl = URL.createObjectURL(croppedFile)
    setAvatarPreview(previewUrl)
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl)
      setTempImageUrl(undefined)
    }
  }

  React.useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  React.useEffect(() => {
    if (!open) return
    let mounted = true
    const load = async () => {
      try {
        const res = await getAllRoles()
        if (mounted && res.success && res.data) setRoles(res.data)
        const usersRes = await getAllDashboardUsers()
        if (mounted && usersRes.success && usersRes.data) setUsers(usersRes.data)
      } catch (e) {
        console.error(e)
      }
    }
    load()
    return () => { mounted = false }
  }, [open])

  const { roleSchema, nameSchema, emailSchema, passwordSchema } = React.useMemo(
    () => createValidationSchemas(roles, users),
    [roles, users]
  )

  const validateAll = React.useCallback(() => {
    let valid = true
    const n = nameSchema.safeParse(name)
    if (!n.success) { setNameError(n.error.issues[0]?.message || "Invalid name"); valid = false } else { setNameError("") }
    const e = emailSchema.safeParse(email)
    if (!e.success) { setEmailError(e.error.issues[0]?.message || "Invalid email"); valid = false } else { setEmailError("") }
    const p = passwordSchema.safeParse(password)
    if (!p.success) { setPasswordError(p.error.issues[0]?.message || "Invalid password"); valid = false } else { setPasswordError("") }
    const r = roleSchema.safeParse(selectedRoleId)
    if (!r.success) { setRoleError(r.error.issues[0]?.message || "Please select a role"); valid = false } else { setRoleError("") }
    return valid
  }, [nameSchema, emailSchema, passwordSchema, roleSchema, name, email, password, selectedRoleId])

  React.useEffect(() => {
    if (open || isClosing) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open, isClosing])

  if (!open && !isClosing) return null

  const handleSubmit = async () => {
    const valid = validateAll()
    if (!valid) return
    try {
      setLoading(true)
      const body: CreateUserRequest = {
        name,
        email,
        password,
        roleId: selectedRoleId,
        avatarUrl: avatarFile,
      }
      const res = await postCreateDashboardUser(body)
      if (res.success) {
        toast("User created successfully ✅")
        onCreated?.()
        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        resetForm()
        handleClose()
      } else {
        toast(res.message || "Failed to create user ❌")
      }
    } catch (e) {
      console.error(e)
      toast("Failed to create user ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {tempImageUrl && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
        />
      )}

      <div className={cn("fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm m-0 duration-200", isClosing ? "animate-out fade-out-0" : "animate-in fade-in-0")}>
        <div className={cn("relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6 duration-200", isClosing ? "animate-out zoom-out-50" : "animate-in zoom-in-50")}>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-6 w-6 rounded-full" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col space-y-6">
            <h2 className="text-xl font-semibold">Add User</h2>
            <div className="space-y-4">
              <AvatarUpload avatarPreview={avatarPreview} onFileSelect={handleAvatarChange} />
              <UserFormFields
                name={name} setName={setName} nameError={nameError} setNameError={setNameError} nameSchema={nameSchema}
                email={email} setEmail={setEmail} emailError={emailError} setEmailError={setEmailError} emailSchema={emailSchema}
                password={password} setPassword={setPassword} passwordError={passwordError} setPasswordError={setPasswordError} passwordSchema={passwordSchema}
                passwordVisibility={passwordVisiblity} setPasswordVisibility={setPasswordVisiblity}
                selectedRoleId={selectedRoleId} setSelectedRoleId={setSelectedRoleId} roleError={roleError} setRoleError={setRoleError}
                roles={roles} roleOptionsFallback={roleOptionsFallback} rolePopoverOpen={rolePopoverOpen} setRolePopoverOpen={setRolePopoverOpen}
              />
            </div>
            <div className="flex items-center gap-4 justify-between mt-2">
              <Button className="w-full p-6 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </Button>
              <Button variant="ghost" className="w-full p-6 text-natural-text hover:text-black hover:bg-natural" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
