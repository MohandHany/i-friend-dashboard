import api from "@/services/axios";

export interface PlanUpdatePayload {
  billingPeriod: "MONTHLY" | "THREE_MONTHS" | "YEARLY" | string;
  price: number;
  currency: string;
  trialDays: number;
  aiConversationCredits: number;
  aiReportCredits: number;
  isActive: boolean;
}

export interface UpdatePackagePayload {
  name: string;
  maxChildren: number;
  isActive: boolean;
  description?: string | null;
  plans: PlanUpdatePayload[];
}

/** Update an existing subscription package by ID */
export const updatePackage = async (packageId: string, payload: UpdatePackagePayload) => {
  try {
    const res = await api.patch(`/subscriptions/update-package/${packageId}`, payload);
    return {
      success: true as const,
      message: res?.data?.message ?? "Package updated successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to update package ❗",
    };
  }
};
