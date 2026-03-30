import api from "@/services/axios";

export interface CreateDiscountTierPayload {
  coinsCost: number;
  discountPercent: number;
  isActive: boolean;
}

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

export interface CreateDiscountTierResponse {
  success: boolean;
  message: string;
  data: DiscountTier;
}

/** Create a new discount tier for loyalty rewards */
export const createDiscountTier = async (payload: CreateDiscountTierPayload) => {
  try {
    const res = await api.post<CreateDiscountTierResponse>("/loyalty/add-discount-tier", payload);
    return {
      success: true as const,
      message: res.data.message ?? "Reward tier created successfully ✅",
      data: res.data.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to create reward tier ❗",
    };
  }
};
