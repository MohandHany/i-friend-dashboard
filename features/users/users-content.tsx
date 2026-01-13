"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import VisibleIcon from "@/public/visible-icon"
import DeleteIcon from "@/public/delete-icon"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"

// Mock data
const users = [
  { id: 1, name: "Ahmed Sami Alawadi", kids: 3, subscription: "Active", date: "23 March,2024" },
  { id: 2, name: "Layla Mohamed Khattab", kids: 5, subscription: "Not Subscribed", date: "22 March,2024" },
  { id: 3, name: "Youssef Emad Morad", kids: 4, subscription: "Not Subscribed", date: "21 March,2024" },
  { id: 4, name: "Mariam Khaled Selim", kids: 2, subscription: "Not Subscribed", date: "19 March,2024" },
  { id: 5, name: "Omar Hany Altayeb", kids: 1, subscription: "Active", date: "14 March,2024" },
  { id: 6, name: "Nouran Ahmed Fawzy", kids: 1, subscription: "Active", date: "12 March,2024" },
  { id: 7, name: "Samer Alaa Aljundi", kids: 3, subscription: "Active", date: "9 March,2024" },
  { id: 8, name: "Hadeel Tarek Saber", kids: 4, subscription: "Not Subscribed", date: "5 March,2024" },
  { id: 9, name: "Kareem Mahmoud Albadr", kids: 2, subscription: "Active", date: "2 March,2024" },
]

export default function UsersContent() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground font-normal">Users Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">All users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">250</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Not Subscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">500</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table Section */}
      <div>
        <div className="w-full bg-white rounded-xl border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
            <h2 className="text-lg font-semibold">All Users</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <SearchIcon className="absolute fill-natural right-2 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search" className="pr-10 rounded-lg placeholder:text-natural-text" />
              </div>
              <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 rounded-lg p-5">
                <FilterIcon className="!w-5.5 !h-5.5 fill-white" />
                Filter
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-light-natural">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Kids
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Subscription
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Registration date
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-500">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.kids}</TableCell>
                  <TableCell>{user.subscription}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                        <VisibleIcon className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 hover:bg-red-50 gap-1">
                        <DeleteIcon className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between py-4">
          <Button variant="outline" className="gap-2 group">
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-gray-50">1</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">2</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">3</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">4</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">5</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">6</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">7</Button>
            <span className="text-gray-400">...</span>
          </div>
          <Button variant="outline" className="gap-2 group">
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      </div>
    </div>
  )
}