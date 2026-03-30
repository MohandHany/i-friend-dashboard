import api from "@/services/axios";

export interface RevenueItem {
  id: string;
  parentName: string;
  startDate: string;
  endDate: string | null;
  amount: string;
  states: "TRIALING" | "CANCELED" | "ACTIVE" | string;
  period: "MONTHLY" | "THREE_MONTHS" | "YEARLY" | string;
  packageName: string;
  totalChildrenAssigned: number;
}

export interface TablePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RevenuesResponse {
  success: boolean;
  message: string;
  data: {
    items: RevenueItem[];
    pagination: TablePagination;
  };
}

/** Fetch a single page of revenue data */
export const getRevenuesTableData = async (page: number = 1, limit: number = 10) => {
  try {
    const res = await api.get<RevenuesResponse>("/revenue/get-table-data", {
      params: { page, limit },
    });
    return {
      success: true as const,
      message: res?.data?.message ?? "Revenue list fetched successfully ✅",
      items: res?.data?.data?.items ?? [],
      pagination: res?.data?.data?.pagination as TablePagination,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch revenue data ❗",
    };
  }
};

/*
 * Fetch ALL revenue items across every page in parallel.
 * Useful for client-side filtering.
 */
export const getRevenuesFull = async (pageSize: number = 50): Promise<RevenueItem[]> => {
  try {
    const first = await getRevenuesTableData(1, pageSize);
    if (!first.success || !first.items) return [];

    const { items: firstItems, pagination } = first;
    const { totalPages } = pagination || { totalPages: 1 };

    if (totalPages <= 1) return firstItems ?? [];

    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.all(pageNumbers.map((p) => getRevenuesTableData(p, pageSize)));

    return [
      ...(firstItems ?? []),
      ...results.flatMap((r) => (r.success && r.items ? r.items ?? [] : [])),
    ];
  } catch {
    return [];
  }
};
