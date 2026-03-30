import api from "@/services/axios"

export type ParentChildrenData = {
  id: string
  name: string
  reportsCount: number
  avatarUrl?: string
}

export type ParentDetailsData = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isSubscribed: boolean
  registrationDate: string
  avatarUrl?: string
  children: ParentChildrenData[]
}

export type ParentDetailsResponse = {
    success: boolean 
    message: string
    status?: number
    data?: ParentDetailsData
  }

export const getParentDetails = async ( parentId: string): Promise<ParentDetailsResponse> => {
  try {
    const res = await api.get(`/user-management/get-parent-details/${parentId}`)

    return {
      success: true as const,
      message: res?.data?.message ?? "Parent details retrieved successfully ✅",
      data: res.data.data ?? {} as ParentDetailsData,
    }
  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to fetch parent details ❗",
    }
  }
}
