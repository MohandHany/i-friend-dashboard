import api from "@/services/axios";

/** Delete a discount tier by ID */
export const deleteDiscountTier = async (tierId: string) => {
  try {
    const res = await api.delete(`/loyalty/delete-discount-tier/${tierId}`);
    return {
      success: true as const,
      message: res?.data?.message ?? "Discount tier deleted successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to delete discount tier ❗",
    };
  }
};
