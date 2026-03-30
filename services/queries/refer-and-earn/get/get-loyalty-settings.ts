import api from "@/services/axios";

export interface LoyaltySettings {
  id: string;
  pointsPerReferral: number;
  signupDiscountPercent: number;
  isReferralEnabled: boolean;
  isRedemptionEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetLoyaltySettingsResponse {
  success: boolean;
  message: string;
  data: LoyaltySettings;
}

export const getLoyaltySettings = async () => {
  try {
    const res = await api.get<GetLoyaltySettingsResponse>("/loyalty/get-loyalty-settings");
    return {
      success: true as const,
      data: res.data.data,
      message: res.data.message ?? "Loyalty settings fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch loyalty settings ❗",
    };
  }
};
