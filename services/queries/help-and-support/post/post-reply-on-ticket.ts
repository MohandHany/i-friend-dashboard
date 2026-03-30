import api from "@/services/axios";

export interface ReplyOnTicketPayload {
  ticketId: string;
  message: string;
}

export interface ReplyData {
  id: string;
  ticketId: string;
  sender: string;
  message: string;
  createdAt: string;
}

export interface PostReplyResponse {
  success: boolean;
  data: ReplyData;
  message?: string;
}

export const postReplyOnTicket = async (payload: ReplyOnTicketPayload) => {
  try {
    const res = await api.post<PostReplyResponse>("/help-support/ticket-reply", payload);
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Reply sent successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to send reply ❌",
    };
  }
};
