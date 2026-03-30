import api from "@/services/axios";

export interface PlanCreatePayload {
  billingPeriod: "MONTHLY" | "THREE_MONTHS" | "YEARLY" | string;
  price: number;
  currency: string;
  trialDays: number;
  aiConversationCredits: number;
  aiReportCredits: number;
  isActive: boolean;
}

export interface CreatePackagePayload {
  name: string;
  maxChildren: number;
  isActive: boolean;
  description?: string | null;
  plans: PlanCreatePayload[];
}

/** Create a new subscription package */
export const createPackage = async (payload: CreatePackagePayload) => {
  try {
    const res = await api.post("/subscriptions/create-package", payload);
    return {
      success: true as const,
      message: res?.data?.message ?? "Package created successfully ✅",
      data: res?.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to create package ❗",
    };
  }
};
