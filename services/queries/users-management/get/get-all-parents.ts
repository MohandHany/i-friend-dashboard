import api from "@/services/axios";

export type AllParentsItem = {
  id: string;
  name: string;
  email: string;
  kidsCount: number;
  isSubscribed: boolean;
  registrationDate: string;
  avatarUrl?: string;
}

export type AllParentsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AllParentsData = {
  users: AllParentsItem[];
  meta: AllParentsMeta;
}

export type AllParentsResponse = {
  success: boolean;
  message: string;
  data: AllParentsData;
}

/** Fetch a single page */
export const getAllParents = async (page: number = 1, limit: number = 10) => {
  try {
    const res = await api.get<AllParentsResponse>("/user-management/get-all-parents", {
      params: { page, limit },
    });
    return {
      success: true as const,
      message: res?.data?.message ?? "All parents retrieved successfully ✅",
      data: (res?.data?.data ?? {}) as AllParentsData,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch all parents ❗",
    };
  }
};

/**
 * Fetch ALL parents across every page in parallel.
 * Uses page=1 first to learn totalPages, then fires the remaining pages concurrently.
 */
export const getAllParentsFull = async (pageSize: number = 50): Promise<AllParentsItem[]> => {
  try {
    // Step 1: get page 1 to discover totalPages
    const first = await getAllParents(1, pageSize);
    if (!first.success || !first.data) return [];

    const { users: firstUsers, meta } = first.data;
    const { totalPages } = meta;

    if (totalPages <= 1) return firstUsers ?? [];

    // Step 2: fetch all remaining pages in parallel
    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.all(pageNumbers.map((p) => getAllParents(p, pageSize)));

    return [
      ...(firstUsers ?? []),
      ...results.flatMap((r) => (r.success && r.data ? r.data.users ?? [] : [])),
    ];
  } catch {
    return [];
  }
};
