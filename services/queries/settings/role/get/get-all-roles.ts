import api from "@/services/axios"

export type PermissionData = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DashboardRolePermissionData = {
  id: string;
  dashboardUserRoleId: string;
  permissionsId: string;
  createdAt?: string;
  updatedAt?: string;
  permission: PermissionData;
}

export type RoleItemsData = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  dashboardRolePermissions: DashboardRolePermissionData[];
}

export type RolesResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: RoleItemsData[];
}

export const getAllRoles = async () => {
    try {
        const res = await api.get<RolesResponse>("/settings/role/get-all-roles")
        return {
            success: true as const,
            message: res?.data?.message ?? "Roles retrieved successfully",
            data: res.data.data ?? [] as RoleItemsData[],
        }
    } catch (err) {
        const error = err as {response?: { status?: number; data?: { message?: string } }}
        const status = error.response?.status;

        return {
            success: false as const,
            status,
            message: error.response?.data?.message ?? "Failed to fetch roles",
        }
    }
}