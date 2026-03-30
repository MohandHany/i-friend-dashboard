import api from "@/services/axios";

interface UpdateDiscountTierData {
  coinsCost: number;
  discountPercent: number;
}

/** Update a discount tier by ID */
export const putUpdateDiscountTier = async (tierId: string, data: UpdateDiscountTierData) => {
  try {
    const res = await api.put(`/loyalty/update-discount-tier/${tierId}`, data);
    return {
      success: true as const,
      data: res.data.data,
      message: res?.data?.message ?? "Discount tier updated successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to update discount tier ❗",
    };
  }
};
