import api from "@/services/axios";
import { CreateNotificationTemplatePayload } from "../post/post-create-template";

export interface UpdateNotificationTemplatePayload extends Partial<CreateNotificationTemplatePayload> {
  status?: "PENDING" | "SENT" | "CANCELED" | "PROCESSING" | "FAILED" | string;
}

/** Update an existing notification template by ID */
export const updateNotificationTemplate = async (templateId: string, payload: UpdateNotificationTemplatePayload) => {
  try {
    const res = await api.patch(`/notifications/update-notification-template/${templateId}`, payload);
    return {
      success: true as const,
      message: res?.data?.message ?? "Notification template updated successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to update notification template ❗",
    };
  }
};
