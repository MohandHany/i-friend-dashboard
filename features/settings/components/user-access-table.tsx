"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import PlusIcon from "@/public/plus-icon"
import { Label } from "@/components/ui/label"
import { AddUserCard } from "./add-user-card"
import { AlertWindow } from "@/components/alert-window"

const users = [
  {
    id: "1",
    name: "Mahmoud A Elkarim",
    email: "mahmo4udi@gmail.com",
    role: "Administrator",
    avatar: "/Ellipse 16.png",
    initials: "ME",
  },
  {
    id: "2",
    name: "Muhand",
    email: "Muhand01@gmail.com",
    role: "Admin",
    avatar: "/mu.png",
    initials: "M",
  },
]

export function UserAccessTable() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  // Extract unique roles
  const roles = Array.from(new Set(users.map((user) => user.role)))

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    )
  }

  const filteredUsers =
    selectedRoles.length > 0
      ? users.filter((user) => selectedRoles.includes(user.role))
      : users

  const handleDeleteClick = (userId: string) => {
    setDeleteUserId(userId)
  }

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete logic here
    console.log("Deleting user:", deleteUserId)
    setDeleteUserId(null)
  }

  const handleDeleteCancel = () => {
    setDeleteUserId(null)
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Access</h2>
        <Button
          variant="default"
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
          onClick={() => setIsAddUserOpen(true)}
        >
          <PlusIcon className="!h-6 !w-6" /> Add User
        </Button>
      </div>

      <AddUserCard open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />

      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-start items-center gap-4 p-4">
          <div className="relative w-72 m-0">
            <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
            <Input placeholder="Search" className="pr-10 rounded-lg placeholder:text-natural-text focus:outline-none" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 p-5">
                <FilterIcon className="!w-5.5 !h-5.5 fill-white" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Roles</h4>
                  <div className="grid gap-2">
                    {roles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => toggleRole(role)}
                        />
                        <Label htmlFor={`role-${role}`}>{role}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-b last:border-0">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-0">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" className="text-blue-600 hover:text-primary-blue hover:bg-primary-blue/10">
                        <EditIcon className="!h-5 !w-5" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-danger hover:bg-danger/10"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <DeleteIcon className="!h-5 !w-5" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertWindow
        open={deleteUserId !== null}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        icon={<DeleteIcon className="h-10 w-10" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}
