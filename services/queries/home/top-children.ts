import api from "@/services/axios";

export type topChild = {
  name: string;
  scoreCoins: number;
  phone: string;
}

export const getTopChildren = async () => {
  try {
    const res = await api.get("/home/top-children");
    return {
      success: true,
      message: res?.data?.message ?? "Top children fetched successfully",
      data: (res?.data?.data ?? []) as topChild[],
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false,
      status,
      message: data?.message ?? "Top children fetch failed",
    }
  }
}
