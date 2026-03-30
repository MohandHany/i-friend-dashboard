import api from "@/services/axios";

export interface DeleteTicketResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const deleteTicket = async (ticketId: string) => {
  try {
    const res = await api.delete<DeleteTicketResponse>(`/help-support/delete-ticket/${ticketId}`);
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Ticket deleted successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to delete ticket ❗",
    };
  }
};
