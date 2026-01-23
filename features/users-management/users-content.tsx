"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AllUsersTable } from "./components/all-users-table"

export default function UsersContent() {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground font-normal">Users Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6">
        <Card className="rounded-r-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">All users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,000</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">250</div>
          </CardContent>
        </Card>
        <Card className="rounded-l-none col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Not Subscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">500</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Section */}
      <AllUsersTable />
    </div>
  )
}