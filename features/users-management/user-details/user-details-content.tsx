"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AllKidsTable } from "./components/all-kids-table"


// Mock data for the user profile
interface UserDetailsContentProps {
  user: any;
}



export function UserDetailsContent({ user }: UserDetailsContentProps) {

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/users-management">Users Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground font-normal">User Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          View <span className="text-gray-500">{user.firstName} {user.lastName}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
            Delete User
          </Button>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
            Block
          </Button>
          <Button className="bg-primary-blue hover:bg-primary-blue-hover text-white">
            Edit User
          </Button>
        </div>
      </div>

      {/* Profile Details Card */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-black text-lg font-semibold">Profile details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">First name</span>
              <span className="text-sm font-semibold col-span-2">{user.firstName}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Last name</span>
              <span className="text-sm font-semibold col-span-2">{user.lastName}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Registration Date</span>
              <span className="text-sm font-semibold col-span-2">{user.registrationDate}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Subscription Status</span>
              <span className="text-sm font-bold col-span-2">{user.subscriptionStatus}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Email</span>
              <span className="text-sm font-semibold col-span-2">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Phone</span>
              <span className="text-sm font-semibold col-span-2">{user.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kids Table Card */}
      <AllKidsTable />
    </div>
  )
}
