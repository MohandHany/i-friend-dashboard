import { useState, useEffect } from "react"
import { getAllRoles, RoleItemsData } from "@/services/queries/settings/role/get/get-all-roles"
import { deleteRoles } from "@/services/queries/settings/role/delete/delete-roles"
import { toast } from "sonner"

export function useRolesTable() {
  const [roles, setRoles] = useState<RoleItemsData[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [cannotDeleteOpen, setCannotDeleteOpen] = useState(false)
  const [cannotDeleteMessage, setCannotDeleteMessage] = useState("")
  const pageSize = 5

  const reload = async () => {
    try {
      const res = await getAllRoles()
      if (res.success && res.data) {
        setRoles(res.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await getAllRoles()
        if (isMounted && res.success && res.data) {
          setRoles(res.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  const filteredRoles = roles.filter((r) => r.name?.toLowerCase().includes(searchValue.toLowerCase()))

  useEffect(() => { setPage(1) }, [searchValue, roles.length])

  const pageCount = Math.max(1, Math.ceil(filteredRoles.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const selectedInView = filteredRoles.filter((r) => selectedIds.includes(r.id))
  const allSelected = filteredRoles.length > 0 && selectedInView.length === filteredRoles.length
  const someSelected = selectedInView.length > 0 && !allSelected

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id]
      return prev.filter((x) => x !== id)
    })
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = filteredRoles.map((r) => r.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])))
    } else {
      const idsInView = new Set(filteredRoles.map((r) => r.id))
      setSelectedIds((prev) => prev.filter((id) => !idsInView.has(id)))
    }
  }

  const handleDeleteSingle = async (roleId: string) => {
    try {
      const res = await deleteRoles([roleId])
      if (res.success) {
        toast(`Role deleted successfully ✅`)
        await reload()
      } else {
        const isConflict = res.status === 409 || /used|assign/i.test(res.message || "")
        if (isConflict) {
          setCannotDeleteMessage("because it's used by users")
          setCannotDeleteOpen(true)
        } else {
          toast(res.message || `Failed to delete role ❌`)
        }
      }
    } catch (e) {
      console.error(e)
      toast(`Failed to delete role ❌`)
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await deleteRoles(ids)
      if (res.success) {
        toast(`${ids.length} Roles deleted successfully ✅`)
        await reload()
        setSelectedIds([])
      } else {
        const isConflict = res.status === 409 || /used|assign/i.test(res.message || "")
        if (isConflict) {
          setCannotDeleteMessage("Some selected roles can't be deleted because they're used by users")
          setCannotDeleteOpen(true)
        } else {
          toast(res.message || `Failed to delete selected roles ❌`)
        }
      }
    } catch (e) {
      console.error(e)
      toast(`Failed to delete selected roles ❌`)
    }
  }

  return {
    roles,
    searchValue,
    setSearchValue,
    paginatedRoles,
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
    cannotDeleteOpen,
    setCannotDeleteOpen,
    cannotDeleteMessage,
  }
}
