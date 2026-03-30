import api from "@/services/axios";

export interface UpdateTicketStatusPayload {
  status: "OPEN" | "RESOLVED" | "CLOSED" | string;
}

export interface UpdateTicketStatusResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const updateTicketStatus = async (ticketId: string, payload: UpdateTicketStatusPayload) => {
  try {
    const res = await api.patch<UpdateTicketStatusResponse>(`/help-support/update-ticket-status/${ticketId}`, payload);
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Ticket status updated successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to update ticket status ❌",
    };
  }
};
