import api from "@/services/axios";

export type RegionAnalysisMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type RegionAnalysisItem = {
  region: string;
  country: string;
  totalUser: number;
  newUser: number;
};

export type RegionAnalysisData = {
  data: RegionAnalysisItem[];
  meta: RegionAnalysisMeta;
};

export type RegionAnalysisResponse = {
  success: boolean;
  message: string;
  data: RegionAnalysisData;
};

export const getRegionAnalysis = async (page = 1, limit = 10) => {
  try {
    const res = await api.get<RegionAnalysisResponse>("/analysis/region-analysis", {
      params: { page, limit },
    });

    return {
      success: true as const,
      message: res?.data?.message ?? "Region analysis data retrieved successfully",
      data: (res?.data?.data ?? {}) as RegionAnalysisData,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to retrieve region analysis meta",
    };
  }
};
