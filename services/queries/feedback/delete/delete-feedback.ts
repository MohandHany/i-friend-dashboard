import api from "@/services/axios";

export interface DeleteFeedbackResponse {
  success: boolean;
  message?: string;
}

export const deleteFeedback = async (feedbackId: string) => {
  try {
    const res = await api.delete<DeleteFeedbackResponse>(`/feedbacks/delete-feedback/${feedbackId}`);
    return {
      success: true as const,
      message: res.data.message ?? "Feedback deleted successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to delete feedback ❗",
    };
  }
};
