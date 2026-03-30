import api from "@/services/axios";

export type DashboardUserRoleType = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DashboardUserData = {
  id: string;
  name: string;
  email: string;
  password: string;
  dashboardUserRoleId: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  dashboardUserRole?: DashboardUserRoleType;
}

export type GetAllUsersResponse = {
  success: boolean;
  message: string;
  status?: number;
  data: DashboardUserData[];
}

export const getAllDashboardUsers = async () => {
  try {
    const res = await api.get<GetAllUsersResponse>("/settings/user/get-all-users");
    return {
      success: true as const,
      message: res?.data?.message ?? "Users retrieved successfully ✅",
      data: res.data.data ?? [] as DashboardUserData[],
    }

  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to fetch users ❗",
    }
  }
}
