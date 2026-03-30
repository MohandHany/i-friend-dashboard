import api from "@/services/axios";

export interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  targetAudience: "ALL" | "CHILDREN" | "PARENTS" | string;
  subscriptionFilter: "ALL" | "SUBSCRIBED" | "NOT_SUBSCRIBED" | string;
  packageId: string | null;
  scheduledAt: string;
  recurrenceRule: "DAILY" | "WEEKLY" | "MONTHLY" | "NONE" | string;
  status: "PENDING" | "SENT" | "CANCELED" | "PROCESSING" | "FAILED" | string;
  sentAt: string | null;
  totalTargeted: number | null;
  totalSent: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TablePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationTemplatesResponse {
  success: boolean;
  message?: string;
  data: NotificationTemplate[];
  pagination: TablePagination;
}

/** Fetch a single page of notification templates */
export const getNotificationTemplates = async (page: number = 1, limit: number = 10) => {
  try {
    const res = await api.get<NotificationTemplatesResponse>("/notifications/get-notification-templates", {
      params: { page, limit },
    });
    return {
      success: true as const,
      message: res?.data?.message ?? "Notification templates retrieved successfully ✅",
      data: res?.data?.data ?? [],
      pagination: res?.data?.pagination as TablePagination,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch notification templates ❗",
    };
  }
};

/**
 * Fetch ALL notification templates across every page in parallel.
 * Useful for client-side filtering.
 */
export const getNotificationTemplatesFull = async (pageSize: number = 50): Promise<NotificationTemplate[]> => {
  try {
    // Step 1: get page 1 to discover totalPages
    const first = await getNotificationTemplates(1, pageSize);
    if (!first.success || !first.data) return [];

    const { data: firstTemplates, pagination } = first;
    const { totalPages } = pagination || { totalPages: 1 };

    if (totalPages <= 1) return firstTemplates ?? [];

    // Step 2: fetch all remaining pages in parallel
    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const results = await Promise.all(pageNumbers.map((p) => getNotificationTemplates(p, pageSize)));

    return [
      ...(firstTemplates ?? []),
      ...results.flatMap((r) => (r.success && r.data ? r.data ?? [] : [])),
    ];
  } catch {
    return [];
  }
};
