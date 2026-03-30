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

/** Fetch a single page */
export const getRegionAnalysis = async (page: number = 1, limit: number = 10) => {
  try {
    const res = await api.get<RegionAnalysisResponse>("/analysis/region-analysis", {
      params: { page, limit },
    });

    return {
      success: true as const,
      message: res?.data?.message ?? "Region analysis data retrieved successfully ✅",
      data: (res?.data?.data ?? {}) as RegionAnalysisData,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to retrieve region analysis meta ❗",
    };
  }
};

/**
 * Fetch ALL region analysis rows across every page in parallel.
 * Uses page=1 first to learn totalPages, then fires the remaining pages concurrently.
 */
export const getRegionAnalysisFull = async (pageSize: number = 50): Promise<RegionAnalysisItem[]> => {
  try {
    // Step 1: get page 1 to discover totalPages
    const first = await getRegionAnalysis(1, pageSize);
    if (!first.success || !first.data) return [];

    const { data: firstData, meta } = first.data;
    const { totalPages } = meta;

    if (totalPages <= 1) return firstData ?? [];

    // Step 2: fetch all remaining pages in parallel
    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.all(pageNumbers.map((p) => getRegionAnalysis(p, pageSize)));

    return [
      ...(firstData ?? []),
      ...results.flatMap((r) => (r.success && r.data ? r.data.data ?? [] : [])),
    ];
  } catch {
    return [];
  }
};
