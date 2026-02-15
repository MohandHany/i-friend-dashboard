"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterIcon from "@/public/filter-icon";
import SearchIcon from "@/public/search-icon";
import EditIcon from "@/public/edit-icon";
import DeleteIcon from "@/public/delete-icon";
import PlusIcon from "@/public/plus-icon";
import { Label } from "@/components/ui/label";
import { AddUserCard } from "./add-user-card";
import { EditUserCard } from "./edit-user-card";
import { AlertWindow } from "@/components/alert-window";
import {
  getAllDashboardUsers,
  DashboardUserData,
} from "@/services/queries/settings/user/get/get-all-users";
import { deleteUsers } from "@/services/queries/settings/user/DELETE/delete-user";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@/public/arrow-left-icon";
import { ArrowRightIcon } from "@/public/arrow-right-icon";

// Data will be fetched from API

export function UserAccessTable() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DashboardUserData | null>(
    null,
  );
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<DashboardUserData[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const reload = async () => {
    try {
      const res = await getAllDashboardUsers();
      if (res.success && res.data) setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // Extract unique roles from fetched users
  const roles = Array.from(
    new Set(users.map((u) => u.dashboardUserRole?.name).filter(Boolean)),
  ) as string[];

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const filteredUsers = users
    .filter(
      (u) =>
        !searchValue ||
        u.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchValue.toLowerCase()),
    )
    .filter(
      (u) =>
        selectedRoles.length === 0 ||
        (u.dashboardUserRole?.name
          ? selectedRoles.includes(u.dashboardUserRole.name)
          : false),
    );

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchValue, selectedRoles.length, users.length]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDeleteClick = (userId: string) => {
    setDeleteUserId(userId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    try {
      const res = await deleteUsers([deleteUserId]);
      if (res.success) {
        toast("User deleted successfully ✅");
        await reload();
      }
    } catch (e) {
      console.error(e);
      toast("Failed to delete user ❌");
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteUserId(null);
  };

  // Editing dialog handlers
  const handleEditClick = (user: DashboardUserData) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) setEditingUser(null);
  };

  // Selection helpers
  const selectedInView = filteredUsers.filter((u) =>
    selectedIds.includes(u.id),
  );
  const allSelected =
    filteredUsers.length > 0 && selectedInView.length === filteredUsers.length;
  const someSelected = selectedInView.length > 0 && !allSelected;

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((x) => x !== id);
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = filteredUsers.map((u) => u.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      const idsInView = new Set(filteredUsers.map((u) => u.id));
      setSelectedIds((prev) => prev.filter((id) => !idsInView.has(id)));
    }
  };

  // Bulk delete
  const handleBulkDeleteOpen = () => {
    if (selectedIds.length <= 1) return;
    setIsBulkDeleteOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length <= 1) return;
    try {
      const res = await deleteUsers(selectedIds);
      if (res.success) {
        toast(`${selectedIds.length} Users deleted successfully ✅`);
        await reload();
        setSelectedIds([]);
      }
    } catch (e) {
      console.error(e);
      toast("Failed to delete selected users ❌");
    } finally {
      setIsBulkDeleteOpen(false);
    }
  };

  const handleBulkDeleteCancel = () => setIsBulkDeleteOpen(false);

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Access</h2>
        <Button
          variant="default"
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
          onClick={() => setIsAddUserOpen(true)}
        >
          <PlusIcon className="h-6! w-6!" /> Add User
        </Button>
      </div>

      <AddUserCard
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onCreated={reload}
      />
      <EditUserCard
        open={isEditOpen}
        onOpenChange={handleEditOpenChange}
        user={editingUser}
        onUpdated={reload}
      />

      <div className="h-[500px]">
        <Card className="mb-0">
          <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
            <div className="flex items-center gap-4 mb-0">
              <div className="relative w-72 m-0">
                <SearchIcon className="absolute fill-natural-text right-2 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search"
                  className="pr-10 rounded-lg placeholder:text-natural-text focus:outline-none"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-primary-blue hover:bg-primary-blue-hover gap-2 p-5 mb-0"
                  >
                    <FilterIcon className="w-5.5! h-5.5! fill-white" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Roles</h4>
                      <div className="grid gap-2">
                        {roles.map((role) => (
                          <div
                            key={role}
                            className="flex items-center space-x-2"
                          >
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
            </div>
            {selectedIds.length > 1 && (
              <Button
                variant="default"
                className={`bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-5 mb-0`}
                onClick={handleBulkDeleteOpen}
              >
                <DeleteIcon className="w-5! h-5!" /> Delete Selected
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        allSelected
                          ? true
                          : someSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked) =>
                        toggleSelectAll(Boolean(checked))
                      }
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="border-b last:border-0">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={(checked) =>
                          toggleSelect(user.id, Boolean(checked))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>
                            {(user.name || "")
                              .split(" ")
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal"
                      >
                        {user.dashboardUserRole?.name || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-0">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-primary-blue hover:bg-primary-blue/10"
                          onClick={() => handleEditClick(user)}
                        >
                          <EditIcon className="h-5! w-5!" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-gray-500 hover:text-danger hover:bg-danger/10"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          <DeleteIcon className="h-5! w-5!" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>
          <div className="flex items-center gap-2 text-sm">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={currentPage === p ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === p ? "bg-gray-50" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
          >
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}

      <AlertWindow
        open={deleteUserId !== null}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title={`Delete ${users.find((u) => u.id === deleteUserId)?.name}`}
        description="Are you sure you want to delete this user?"
        icon={<DeleteIcon className="h-10 w-10" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <AlertWindow
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title={`Delete ${selectedIds.length} selected user${selectedIds.length === 1 ? "" : "s"}`}
        description={(() => {
          const names = users
            .filter((u) => selectedIds.includes(u.id))
            .map((u) => u.name)
            .filter(Boolean) as string[];
          const preview = names.slice(0, 3).join(", ");
          return names.length > 3
            ? `${preview}, ...`
            : preview || "This action cannot be undone.";
        })()}
        icon={<DeleteIcon className="h-10 w-10" />}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleBulkDeleteConfirm}
        onCancel={handleBulkDeleteCancel}
      />
    </div>
  );
}
