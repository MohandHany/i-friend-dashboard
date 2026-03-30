import api from "@/services/axios";

/** Cancel a single notification template by ID */
export const cancelNotificationTemplate = async (templateId: string) => {
  try {
    const res = await api.delete(`/notifications/cancel-notification-template/${templateId}`);
    return {
      success: true as const,
      message: res?.data?.message ?? "Notification template cancelled successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to cancel notification template ❗",
    };
  }
};
