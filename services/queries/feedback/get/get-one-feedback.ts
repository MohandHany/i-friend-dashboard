import api from "@/services/axios";
import { FeedbackItem } from "./get-all-feedbacks";

export interface GetSingleFeedbackResponse {
  success: boolean;
  data: FeedbackItem;
  message?: string;
}

export const getSingleFeedback = async (feedbackId: string) => {
  try {
    const res = await api.get<GetSingleFeedbackResponse>(`/feedbacks/get-single-feedback/${feedbackId}`);
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Feedback details fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch feedback details ❗",
    };
  }
};
