import api from "@/services/axios";

export interface DiscountTier {
  id: string;
  title: string;
  description: string;
  coinsCost: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetDiscountTiersResponse {
  success: boolean;
  data: DiscountTier[];
}

export const getDiscountTiers = async () => {
  try {
    const res = await api.get<GetDiscountTiersResponse>("/loyalty/get-discount-tiers");
    return {
      success: true as const,
      data: res.data.data,
      message: "Discount tiers fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch discount tiers ❗",
    };
  }
};
