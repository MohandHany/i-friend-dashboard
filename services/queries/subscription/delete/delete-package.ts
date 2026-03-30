import api from "@/services/axios";

/** Delete a subscription package by ID */
export const deletePackage = async (packageId: string) => {
  try {
    const res = await api.delete(`/subscriptions/delete-package/${packageId}`);
    return {
      success: true as const,
      message: res?.data?.message ?? "Package deleted successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to delete package ❗",
    };
  }
};
