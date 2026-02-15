import api from "@/services/axios";
import { DashboardUserData } from "@/services/queries/settings/user/GET/get-all-users";

export interface UpdateUserData {
  roleId: string;
  userId: string;
  [property: string]: unknown;
}

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: DashboardUserData;
};

export const patchUpdateDashboardUser = async (body: UpdateUserData) => {
  try {
    const res = await api.patch<UpdateUserResponse>(
      "/settings/user/update-user",
      body,
    );
    return {
      success: true as const,
      message: res?.data?.message ?? "User role updated successfully",
      data: res.data?.data,
    };
  } catch (err) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = error.response?.status;
    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to update user role",
    };
  }
};
