import api from "@/services/axios";
import { NotificationTemplate } from "./get-all-notifications";

export interface GetNotificationTemplateResponse {
  success: boolean;
  message?: string;
  data: NotificationTemplate;
}

/** Fetch a single notification template by ID */
export const getNotificationTemplate = async (templateId: string) => {
  try {
    const res = await api.get<GetNotificationTemplateResponse>(`/notifications/get-notification-template/${templateId}`);
    return {
      success: true as const,
      message: res?.data?.message ?? "Notification template retrieved successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch notification template ❗",
    };
  }
};
