import api from "@/services/axios";

export type RatingValue = "EXCELLENT" | "VERY_GOOD" | "GOOD" | "FAIR" | "BAD";

export interface FeedbackParent {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phoneNumber: string;
  user: {
    email: string;
  };
}

export interface FeedbackItem {
  id: string;
  parentId: string;
  rating: RatingValue;
  comment: string;
  createdAt: string;
  parent: FeedbackParent;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllFeedbacksData {
  feedbacks: FeedbackItem[];
  pagination: Pagination;
}

export interface GetAllFeedbacksResponse {
  success: boolean;
  data: GetAllFeedbacksData;
  message?: string;
}

export interface GetAllFeedbacksParams {
  page?: number;
  limit?: number;
  rating?: RatingValue;
}

export const getAllFeedbacks = async (params?: GetAllFeedbacksParams) => {
  try {
    const res = await api.get<GetAllFeedbacksResponse>("/feedbacks/get-all-feedbacks", { params });
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Feedbacks fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch feedbacks ❗",
    };
  }
};
