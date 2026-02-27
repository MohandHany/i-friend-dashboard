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
import VisibleIcon from "@/public/visible-icon"
import UnvisibleIcon from "@/public/unvisible-icon"
import type { RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import type { z } from "zod"

interface UserFormFieldsProps {
  name: string
  setName: (value: string) => void
  nameError: string
  setNameError: (value: string) => void
  nameSchema: z.ZodType<string>

  email: string
  setEmail: (value: string) => void
  emailError: string
  setEmailError: (value: string) => void
  emailSchema: z.ZodType<string>

  password: string
  setPassword: (value: string) => void
  passwordError: string
  setPasswordError: (value: string) => void
  passwordSchema: z.ZodType<string>
  passwordVisibility: boolean
  setPasswordVisibility: (value: boolean) => void

  selectedRoleId: string
  setSelectedRoleId: (value: string) => void
  roleError: string
  setRoleError: (value: string) => void
  roles: RoleItemsData[]
  roleOptionsFallback: string[]
  rolePopoverOpen: boolean
  setRolePopoverOpen: (value: boolean) => void
}

export function UserFormFields({
  name, setName, nameError, setNameError, nameSchema,
  email, setEmail, emailError, setEmailError, emailSchema,
  password, setPassword, passwordError, setPasswordError, passwordSchema,
  passwordVisibility, setPasswordVisibility,
  selectedRoleId, setSelectedRoleId, roleError, setRoleError,
  roles, roleOptionsFallback, rolePopoverOpen, setRolePopoverOpen
}: UserFormFieldsProps) {
  return (
    <>
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="user-name" className="text-sm">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="user-name"
          placeholder="Name"
          className="bg-natural focus-visible:ring-blue-500"
          value={name}
          onChange={(e) => { setName(e.target.value); if (nameError) setNameError("") }}
          onBlur={() => {
            const res = nameSchema.safeParse(name)
            setNameError(res.success ? "" : (res.error.issues[0]?.message || "Invalid name"))
          }}
        />
        {nameError ? (<p className="text-xs text-red-500">{nameError}</p>) : null}
      </div>

      {/* Role Field */}
      <div className="space-y-2">
        <Label className="text-sm">
          Role <span className="text-red-500">*</span>
        </Label>
        <Popover open={rolePopoverOpen} onOpenChange={setRolePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between bg-natural border-gray-100 hover:bg-gray-100 font-normal",
                !selectedRoleId && "text-muted-foreground"
              )}
            >
              {roles.find(r => r.id === selectedRoleId)?.name || roleOptionsFallback[0] || "Select role"}
              <ArrowDown2Icon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 z-99999" align="start">
            <div className="space-y-1">
              {(roles.length ? roles.map(r => ({ id: r.id, name: r.name })) : roleOptionsFallback.map((name, idx) => ({ id: String(idx), name }))).map((item) => (
                <button key={item.id} onClick={() => { setSelectedRoleId(item.id); setRolePopoverOpen(false); if (roleError) setRoleError("") }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors">
                  {item.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {roleError ? (<p className="text-xs text-red-500">{roleError}</p>) : null}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="user-email" className="text-sm">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="user-email"
          type="email"
          placeholder="example@gmail.com"
          className="bg-natural focus-visible:ring-blue-500"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError("") }}
          onBlur={() => {
            const res = emailSchema.safeParse(email)
            setEmailError(res.success ? "" : (res.error.issues[0]?.message || "Invalid email"))
          }}
        />
        {emailError ? (<p className="text-xs text-red-500">{emailError}</p>) : null}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="user-password" className="text-sm">
          Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="user-password"
            type={passwordVisibility ? "text" : "password"}
            placeholder="Password"
            className="bg-natural focus-visible:ring-blue-500"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError("") }}
            onBlur={() => {
              const res = passwordSchema.safeParse(password)
              setPasswordError(res.success ? "" : (res.error.issues[0]?.message || "Invalid password"))
            }}
          />
          <Button variant="ghost"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 p-3 fill-natural-text hover:fill-black hover:bg-transparent active:bg-black/5"
            onClick={() => setPasswordVisibility(!passwordVisibility)}
          >
            {passwordVisibility ? <VisibleIcon /> : <UnvisibleIcon />}
          </Button>
        </div>
        {passwordError ? (<p className="text-xs text-red-500">{passwordError}</p>) : null}
      </div>
    </>
  )
}
