import api from "@/services/axios";

export type RoleItemsData = {
  name: string;
  permissionIds: string[];
}

export type CreateRoleResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: RoleItemsData;
}

export const createRole = async (roleName: string, permissionsIds: string[]) => {
  try {
    // API expects: { name: string, permissionIds: string[] }
    const res = await api.post<CreateRoleResponse>(
      "/settings/role/create-role",
      { name: roleName, permissionIds: permissionsIds }
    )
    return {
      success: true as const,
      message: res?.data?.message ?? "Role created successfully",
      data: res.data.data,
    }
  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to create role",
    }
  }
}
