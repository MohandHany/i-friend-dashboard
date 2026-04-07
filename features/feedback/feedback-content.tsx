"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import { getAllFeedbacks, FeedbackItem, RatingValue } from "@/services/queries/feedback/get/get-all-feedbacks"
import { deleteFeedback } from "@/services/queries/feedback/delete/delete-feedback"
import { AlertWindow } from "@/components/alert-window"
import DeleteIcon from "@/public/delete-icon"
import { toast } from "sonner"
import { FeedbackFilter } from "./components/feedback-filter"
import { FeedbackTable } from "./components/feedback-table"
import { ViewFeedbackModal } from "./components/view-feedback-modal"
import LoadingSpinner from "@/components/ifriend-spinner"

const ITEMS_PER_PAGE = 10

export default function FeedbackContent() {
  const [feedbackList, setFeedbackList] = React.useState<FeedbackItem[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [search, setSearch] = React.useState("")
  const [ratingFilter, setRatingFilter] = React.useState<RatingValue | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [viewFeedback, setViewFeedback] = React.useState<FeedbackItem | null>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchFeedback = React.useCallback(async () => {
    setLoading(true)
    const res = await getAllFeedbacks({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      rating: ratingFilter || undefined,
    })
    if (res.success && res.data) {
      setFeedbackList(res.data.feedbacks)
      setTotalCount(res.data.pagination.total)
    }
    setLoading(false)
  }, [currentPage, ratingFilter])

  React.useEffect(() => {
    fetchFeedback()
  }, [fetchFeedback])

  const filteredFeedback = React.useMemo(() => {
    if (!search) return feedbackList
    return feedbackList.filter((item) => {
      const fullName = `${item.parent.firstName} ${item.parent.lastName}`.toLowerCase()
      return fullName.includes(search.toLowerCase())
    })
  }, [feedbackList, search])

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteFeedback(deleteId)
    if (res.success) {
      toast(res.message || "Feedback deleted successfully ✅")
      fetchFeedback()
    } else {
      toast(res.message || "Failed to delete feedback ❌")
    }
    setIsDeleting(false)
    setDeleteId(null)
  }

  const feedbackToDelete = feedbackList.find((f) => f.id === deleteId)
  const deleteName = feedbackToDelete ? `${feedbackToDelete.parent.firstName}` : ""

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
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Card className="overflow-hidden">
            <FeedbackFilter
              search={search}
              onSearchChange={setSearch}
              ratingFilter={ratingFilter}
              onRatingFilterChange={(val) => {
                setRatingFilter(val)
                setCurrentPage(1)
              }}
              totalCount={totalCount}
            />

            <CardContent className="p-0">
              <FeedbackTable
                feedback={filteredFeedback}
                startIndex={startIndex}
                onView={(f) => setViewFeedback(f)}
                onDelete={(id) => setDeleteId(id)}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <Button
                variant="outline"
                className="gap-2 group transition-all disabled:opacity-40"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon className="w-4 h-4" />
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
                      className={`h-8 w-8 ${currentPage === page ? "bg-gray-50 font-semibold" : ""}`}
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                className="gap-2 group transition-all disabled:opacity-40"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <AlertWindow
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={`Delete ${deleteName} feedback`}
        description="Are you sure you would like to delete this feedback?"
        icon={<DeleteIcon className="h-10! w-10!" />}
        variant="destructive"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Close"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <ViewFeedbackModal
        open={viewFeedback !== null}
        onOpenChange={(open) => !open && setViewFeedback(null)}
        feedback={viewFeedback}
      />
    </div>
  )
}
