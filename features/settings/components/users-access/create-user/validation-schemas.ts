import { z } from "zod"
import type { RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import type { DashboardUserData } from "@/services/queries/settings/user/get/get-all-users"

export function createValidationSchemas(
  roles: RoleItemsData[],
  users: DashboardUserData[]
) {
  const existingNames = new Set(users.map(u => (u.name || "").trim().toLowerCase()))
  const existingEmails = new Set(users.map(u => (u.email || "").trim().toLowerCase()))
  const existingPasswords = new Set(users.map(u => (u.password || "").trim().toLowerCase()))

  const roleSchema = (() => {
    const roleIds = new Set(roles.map(r => r.id))
    if (roles.length > 0) {
      return z.string().min(1, "Please select a role").refine((id) => roleIds.has(id), { message: "Please select a valid role" })
    }
    return z.string().min(1, "Please select a role")
  })()

  const nameSchema = z.string()
    .min(6, "Name must be at least 6 characters")
    .refine((val) => !existingNames.has(val.trim().toLowerCase()), { message: "Name is already used" })

  const emailSchema = z.string()
    .min(1, "Email is required")
    .refine((val) => val.includes("@"), { message: "Email must contain @" })
    .refine((val) => !existingEmails.has(val.trim().toLowerCase()), { message: "Email is already used" })

  const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[0-9]/.test(val), { message: "Password must contain a number" })
    .refine((val) => /[^\w\s]/.test(val), { message: "Password must contain a special character" })
    .refine((val) => /[A-Za-z]/.test(val), { message: "Password must contain a letter" })
    .refine((val) => !existingPasswords.has(val.trim().toLowerCase()), { message: "Password is already used" })

  return {
    roleSchema,
    nameSchema,
    emailSchema,
    passwordSchema,
  }
}
