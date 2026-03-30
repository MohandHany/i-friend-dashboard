"use client"

import { AllUsersTable } from "./components/all-users-table"
import StatsCards from "@/components/stats-cards";

export default function UsersContent() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Stats Cards */}
      <StatsCards includeAllUsersCard />

      {/* Users Table Section */}
      <AllUsersTable />
    </div>
  )
}


