import api from "@/services/axios";

export type deleteRolesData = {
    roleIds: string[];
}

export type deleteRolesResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: deleteRolesData;
}

export const deleteRoles = async (roleIds: string[]) => {
  try {
    const res = await api.delete<deleteRolesResponse>(`/settings/role/delete-role`, { data: { roleIds } })
    return {
      success: true as const,
      message: res?.data?.message ?? "Roles deleted successfully",
      data: res.data.data,
    }
  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to delete roles",
    }
  }
}
