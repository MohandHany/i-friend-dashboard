import api from "@/services/axios"

export type PermissionItemsData = {
  id: string;
  name: string;
  description: string;
}

export type PermissionsResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: PermissionItemsData[];
}

export const getAllPermissions = async () => {
  try {
    const res = await api.get<PermissionsResponse>("/settings/role/get-all-permissions")
    return {
      success: true as const,
      message: res?.data?.message ?? "Permissions retrieved successfully",
      data: res.data.data ?? [] as PermissionItemsData[],
    }
  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to fetch permissions",
    }
  }
}
