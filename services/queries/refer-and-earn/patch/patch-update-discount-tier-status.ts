import api from "@/services/axios";

/** Update a discount tier status by ID */
export const patchUpdateDiscountTierStatus = async (tierId: string, isActive: boolean) => {
  try {
    const res = await api.patch(`/loyalty/update-discount-tier-status/${tierId}`, { isActive });
    return {
      success: true as const,
      data: res.data.data,
      message: res?.data?.message ?? "Status updated successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to update status ❗",
    };
  }
};
