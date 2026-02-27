import api from "@/services/axios"

export type updateRoleData = {
  permissionIds: string[];
}

export type updateRoleResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: updateRoleData;
}

export const updateRole = async (roleId: string, data: updateRoleData) => {
  try {
    // API expects body strictly: { permissionIds: string[] }
    const payload = { permissionIds: data.permissionIds }
    const res = await api.patch<updateRoleResponse>(
      `/settings/role/update-role/${roleId}`,
      payload
    )
    return {
      success: true as const,
      message: res?.data?.message ?? "Role permissions updated successfully",
      data: res.data.data,
    }
  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to update role permissions",
    }
  }
}

