import api from "@/services/axios"

// ─── Response Shapes ────────────────────────────────────────────────────────

export interface ParentItem {
  id: string
  fullName: string
  email: string
  inviteeCount: number
  isSubscribed: boolean
  joinedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface GetAllParentsResponse {
  success: boolean
  message: string
  data: ParentItem[]
  pagination: Pagination
}

// ─── Request Params ──────────────────────────────────────────────────────────

export interface GetAllParentsParams {
  page?: number
  limit?: number
  search?: string
  inviteesCount?: number
  subscriptionStatus?: string   // "true" | "false"
  registrationDate?: string     // ISO string
}

// ─── Query ───────────────────────────────────────────────────────────────────

export const getAllParents = async (params?: GetAllParentsParams) => {
  try {
    const res = await api.get<GetAllParentsResponse>("/loyalty/get-all-parents", { params })
    return {
      success: true as const,
      message: res.data.message,
      data: res.data.data,
      pagination: res.data.pagination,
    }
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } }
    return {
      success: false as const,
      status: error?.response?.status,
      message: (error?.response?.data?.message as string) ?? "Failed to fetch users ❗",
    }
  }
}
