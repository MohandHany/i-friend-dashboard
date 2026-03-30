import api from "@/services/axios"

export type ParentsStatsData = {
  totalUsers: number;
  subscribedUsers: number;
  notSubscribedUsers: number;
}

export type ParentsStatsResponse = {
  success: boolean;
  message: string;
  data: ParentsStatsData;
}

export const getParentsStats = async () => {
  try {
    const res = await api.get<ParentsStatsResponse>("/user-management/get-parents-stats")
    return {
      success: true as const,
      message: res?.data?.message ?? "Parents stats retrieved successfully ✅",
      data: res?.data?.data ?? {} as ParentsStatsData
    }
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to retrieve parents stats ❗",
    }
  }
}
