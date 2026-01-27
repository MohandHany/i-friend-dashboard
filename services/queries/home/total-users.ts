import api from "@/services/axios";

export type totalUsersType = {
  totalUsers: number;
}

export const getTotalUsers = async () => {
  try {
    const res = await api.get("/home/total-users");
    return {
      success: true,
      message: res?.data?.message ?? "Total users fetched successfully",
      data: (res?.data?.data ?? {}) as totalUsersType,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false,
      status,
      message: data?.message ?? "Total users fetch failed",
    }
  }
}