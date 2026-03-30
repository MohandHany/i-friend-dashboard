import api from "@/services/axios";

export interface TicketParent {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface TicketCount {
  messages: number;
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  parentId: string;
  type: string;
  status: string;
  title: string;
  description: string;
  attachmentUrls: string[] | null;
  createdAt: string;
  updatedAt: string;
  parent: TicketParent;
  _count: TicketCount;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllTicketsData {
  tickets: Ticket[];
  pagination: Pagination;
}

export interface GetAllTicketsResponse {
  success: boolean;
  data: GetAllTicketsData;
  message?: string;
}

export interface GetAllTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export const getAllTickets = async (params?: GetAllTicketsParams) => {
  try {
    const res = await api.get<GetAllTicketsResponse>("/help-support/get-all-tickets", { params });
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Tickets fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch tickets ❗",
    };
  }
};
