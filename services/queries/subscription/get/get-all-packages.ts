import api from "@/services/axios";

export interface PackagePlan {
  id: string;
  packageId: string;
  billingPeriod: "MONTHLY" | "THREE_MONTHS" | "YEARLY" | string;
  price: string;
  currency: string;
  trialDays: number;
  aiConversationCredits: number;
  aiReportCredits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  description: string | null;
  maxChildren: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  plans: PackagePlan[];
}

export interface GetAllPackagesResponse {
  success: boolean;
  message: string;
  data: SubscriptionPackage[];
}

/** Fetch all packages with their associated plans */
export const getAllPackages = async () => {
  try {
    const res = await api.get<GetAllPackagesResponse>("/subscriptions/get-all-packages");
    return {
      success: true as const,
      message: res?.data?.message ?? "Packages fetched successfully ✅",
      data: res?.data?.data ?? [],
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch packages ❗",
    };
  }
};
