import api from "@/services/axios";
import { TicketParent } from "./get-all-tickets";

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: "USER" | "SUPPORT" | string;
  message: string;
  createdAt: string;
}

export interface SingleTicketData {
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
  messages: TicketMessage[];
}

export interface GetOneTicketResponse {
  success: boolean;
  data: SingleTicketData;
  message?: string;
}

export const getOneTicket = async (ticketId: string) => {
  try {
    const res = await api.get<GetOneTicketResponse>(`/help-support/get-single-ticket/${ticketId}`);
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Ticket fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch ticket ❗",
    };
  }
};
