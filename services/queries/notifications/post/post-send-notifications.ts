import api from "@/services/axios";
import { TargetAudience, SubscriptionFilter } from "./post-create-template";

export interface SendNotificationPayload {
  title: string;
  message: string;
  targetAudience: TargetAudience;
  subscriptionFilter: SubscriptionFilter;
}

/** Send a manual notification */
export const sendNotification = async (payload: SendNotificationPayload) => {
  try {
    const res = await api.post("/notifications/send-notification", payload);
    return {
      success: true as const,
      message: "Notification sent successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to send notification ❗",
    };
  }
};
