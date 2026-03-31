"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import EditIcon from "@/public/edit-icon"
import DeleteIcon from "@/public/delete-icon"
import SearchIcon from "@/public/search-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon } from "lucide-react"

import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"

interface Package {
  id: string
  discount: string
  coins: number
  active: boolean
}

interface AllPackageProps {
  packages: Package[]
  onEdit: (pkg: Package) => void
  onDelete: (id: string) => void
  onBulkDelete: (ids: string[]) => void
  onToggle: (id: string, active: boolean) => void
  onAdd: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function AllDiscountsTable({
  packages,
  onEdit,
  onDelete,
  onBulkDelete,
  onToggle,
  onAdd,
  currentPage,
  totalPages,
  onPageChange,
  searchValue,
  onSearchChange
}: AllPackageProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = packages.length > 0 && Array.from(selectedIds).length === packages.length
  const someSelected = Array.from(selectedIds).length > 0 && !allSelected

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(packages.map((p) => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    setSelectedIds(next)
  }


  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | "...")[] = []
    pages.push(1)
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium mb-0">All Discounts</h2>
        <div className="flex items-center gap-4">
          {selectedIds.size > 1 && (
            <Button
              variant="ghost"
              className="bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-5 shadow-sm"
              onClick={() => {
                onBulkDelete(Array.from(selectedIds))
                setSelectedIds(new Set())
              }}
            >
              <DeleteIcon className="h-5! w-5!" /> Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Button
            variant="default"
            className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
            onClick={onAdd}
          >
            <PlusIcon className="w-6! h-6!" />
            Create Discount
          </Button>
        </div>
      </div>
      <Card className="overflow-hidden mt-4">
        <CardContent className="p-0 rounded-b-xl overflow-hidden shadow-sm">
          <Table className="w-full text-left">
            <TableHeader className={`bg-light-natural border-b border-natural text-nowrap`}>
              <TableRow>
                <TableHead className="p-4 w-12 text-center">
                  <Checkbox
                    className="border-natural-text/30"
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Discount type
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Coins
                    <ArrowDownIcon className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="text-nowrap border-b border-natural last:border-0 hover:bg-light-natural/50 transition-colors">
                  <TableCell className="p-4 text-center">
                    <Checkbox
                      className="border-natural-text/30"
                      checked={selectedIds.has(pkg.id)}
                      onCheckedChange={(checked) => toggleOne(pkg.id, Boolean(checked))}
                    />
                  </TableCell>
                  <TableCell className="p-3 text-sm">{pkg.discount}</TableCell>
                  <TableCell className="px-3 py-2">
                    <div className="bg-natural rounded-md px-3 py-2 inline-block border">
                      {pkg.coins} Coins
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-8 px-4 py-0">
                    <Switch
                      checked={pkg.active}
                      onCheckedChange={(checked) => onToggle(pkg.id, checked)}
                      className="data-[state=checked]:bg-primary-blue"
                    />
                    <div className="flex justify-end gap-2 pr-4">
                      <Button
                        variant="ghost"
                        className="text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10"
                        onClick={() => onEdit(pkg)}
                      >
                        <EditIcon className="w-5! h-5!" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => onDelete(pkg.id)}
                      >
                        <DeleteIcon className="w-5! h-5!" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group transition-all disabled:opacity-40"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>

          <div className="flex items-center gap-1 text-sm">
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-natural-text">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "outline" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 ${currentPage === page ? "bg-gray-50 font-semibold" : "text-natural-text"}`}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            className="gap-2 group transition-all disabled:opacity-40"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}
    </div>
  )
}
