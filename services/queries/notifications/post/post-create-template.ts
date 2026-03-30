import api from "@/services/axios";

export type TargetAudience = "ALL" | "CHILDREN" | "PARENTS" | string;
export type SubscriptionFilter = "ALL" | "SUBSCRIBED" | "NOT_SUBSCRIBED" | string;
export type RecurrenceRule = "DAILY" | "WEEKLY" | "MONTHLY" | "NONE" | string;

export interface CreateNotificationTemplatePayload {
  title: string;
  message: string;
  targetAudience: TargetAudience;
  subscriptionFilter: SubscriptionFilter;
  scheduledAt: string;
  recurrenceRule: RecurrenceRule;
}

/** Create a new notification template */
export const createNotificationTemplate = async (payload: CreateNotificationTemplatePayload) => {
  try {
    const res = await api.post("/notifications/create-notification-template", payload);
    return {
      success: true as const,
      message: res?.data?.message ?? "Notification template created successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to create notification template ❗",
    };
  }
};
