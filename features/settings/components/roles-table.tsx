"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import SearchIcon from "@/public/search-icon"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import PlusIcon from "@/public/plus-icon"
import { CreateRoleCard } from "./create-role-card"
import { useState } from "react"
import { AlertWindow } from "@/components/alert-window"

const roles = [
  {
    id: "1",
    name: "Administrator",
    access: ["Administrator"],
  },
  {
    id: "2",
    name: "Admin",
    access: ["Dashboard", "Revenue", "Users Management", "Analysis"],
  },
  {
    id: "3",
    name: "Markiting",
    access: ["Analysis"],
  },
]

export function RolesTable() {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)

  const handleDeleteClick = (roleId: string) => {
    setDeleteRoleId(roleId)
  }

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete logic here
    console.log("Deleting role:", deleteRoleId)
    setDeleteRoleId(null)
  }

  const handleDeleteCancel = () => {
    setDeleteRoleId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Roles</h2>
        <Button
          variant="default"
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
          onClick={() => setIsCreateRoleOpen(true)}
        >
          <PlusIcon className="!h-6 !w-6" /> Create Role
        </Button>
      </div>

      <CreateRoleCard open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen} />

      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <div className="relative w-72 m-0">
            <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
            <Input placeholder="Search" className="pr-10 rounded-lg placeholder:text-natural-text" />
          </div>
        </CardHeader>

        <CardContent className="p-0">

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Role name</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className="border-b last:border-0">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {role.access.map((item) => (
                        <Badge key={item} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-0">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" className="text-blue-600 hover:text-primary-blue hover:bg-primary-blue/10">
                        <EditIcon className="!h-5 !w-5" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-danger hover:bg-danger/10"
                        onClick={() => handleDeleteClick(role.id)}
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
        open={deleteRoleId !== null}
        onOpenChange={(open) => !open && setDeleteRoleId(null)}
        title="Delete Role"
        description="Are you sure you want to delete this role?"
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
