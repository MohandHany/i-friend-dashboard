import { useState, useEffect } from "react"
import { getAllDashboardUsers, DashboardUserData } from "@/services/queries/settings/user/get/get-all-users"
import { deleteUsers } from "@/services/queries/settings/user/delete/delete-user"
import { toast } from "sonner"

export function useUserTable() {
  const [users, setUsers] = useState<DashboardUserData[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 5

  const reload = async () => {
    try {
      const res = await getAllDashboardUsers()
      if (res.success && res.data) setUsers(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const roles = Array.from(new Set(users.map((u) => u.dashboardUserRole?.name).filter(Boolean))) as string[]

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    )
  }

  const filteredUsers = users
    .filter((u) => !searchValue || u.name?.toLowerCase().includes(searchValue.toLowerCase()) || u.email?.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((u) => selectedRoles.length === 0 || (u.dashboardUserRole?.name ? selectedRoles.includes(u.dashboardUserRole.name) : false))

  useEffect(() => { setPage(1) }, [searchValue, selectedRoles.length, users.length])

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const selectedInView = filteredUsers.filter((u) => selectedIds.includes(u.id))
  const allSelected = filteredUsers.length > 0 && selectedInView.length === filteredUsers.length
  const someSelected = selectedInView.length > 0 && !allSelected

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id]
      return prev.filter((x) => x !== id)
    })
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = filteredUsers.map((u) => u.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])))
    } else {
      const idsInView = new Set(filteredUsers.map((u) => u.id))
      setSelectedIds((prev) => prev.filter((id) => !idsInView.has(id)))
    }
  }

  const handleDeleteSingle = async (userId: string) => {
    try {
      const res = await deleteUsers([userId])
      if (res.success) {
        toast("User deleted successfully ✅")
        await reload()
      }
    } catch (e) {
      console.error(e)
      toast("Failed to delete user ❌")
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await deleteUsers(ids)
      if (res.success) {
        toast(`${ids.length} Users deleted successfully ✅`)
        await reload()
        setSelectedIds([])
      }
    } catch (e) {
      console.error(e)
      toast("Failed to delete selected users ❌")
    }
  }

  return {
    users,
    roles,
    selectedRoles,
    toggleRole,
    searchValue,
    setSearchValue,
    paginatedUsers,
    page: currentPage,
    setPage,
    pageCount,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    allSelected,
    someSelected,
    reload,
    handleDeleteSingle,
    handleBulkDelete,
  }
}
