import api from "@/services/axios";

export interface InviteeItem {
  referralRewardId: string;
  inviteeId: string;
  fullName: string;
  email: string;
  isSubscribed: boolean;
  points: number;
  status: "PENDING" | "CONFIRMED";
  confirmedAt: string | null;
  createdAt: string;
}

export interface UserInviteesData {
  data: InviteeItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ParentLoyaltyDetails {
  parent: {
    id: string;
    fullName: string;
    isSubscribed: boolean;
    referralCode: string;
    availablePoints: number;
  };
  pendingPoints: number;
  confirmedPoints: number;
  invitees: UserInviteesData;
}

export interface GetParentDetailsResponse {
  success: boolean;
  message: string;
  data: ParentLoyaltyDetails;
}

export interface GetParentDetailsParams {
  page?: number;
  limit?: number;
}

export const getParentDetails = async (parentId: string, params?: GetParentDetailsParams) => {
  try {
    const res = await api.get<GetParentDetailsResponse>(`/loyalty/get-parent-details/${parentId}`, { params });
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "User loyalty details fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch user loyalty details ❗",
    };
  }
};
