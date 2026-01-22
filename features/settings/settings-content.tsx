"use client"

import { RolesTable } from "./components/roles-table"
import { UserAccessTable } from "./components/user-access-table"

export default function SettingsContent() {
  return (
    <div className="flex flex-col gap-6 w-full p-6">
      <RolesTable />
      <UserAccessTable />
    </div>
  )
}
