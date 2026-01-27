import api from "@/services/axios";

export type AnalysisDataset = {
  label: string;
  region: string;
  country: string;
  totalUsers: number;
  data: number[];
};

export type UserAnalysisChart = {
  labels: string[];
  datasets: AnalysisDataset[];
  totalUsersInDb: number;
};

export type AnalysisPeriod = "weekly" | "monthly" | "yearly";

export const getUserAnalysisChart = async (period?: AnalysisPeriod) => {
  try {
    const res = await api.get("/analysis/user-analysis-chart", {
      params: period ? { period } : undefined,
    });
    return {
      success: true as const,
      message: res?.data?.message ?? "User analysis chart data retrieved successfully",
      data: (res?.data?.data ?? {}) as UserAnalysisChart,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to retrieve user analysis chart data",
    };
  }
};

