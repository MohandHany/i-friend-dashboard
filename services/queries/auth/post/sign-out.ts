import api from "@/services/axios";

export const signOut = async (refreshToken?: string) => {
  try {
    // Prefer explicitly provided token; otherwise read from localStorage (set by interceptors on sign-in)
    const stored = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
    const rt = refreshToken ?? stored ?? "";
    const res = await api.post("/auth/sign-out", { refreshToken: rt });
    return {
      success: true,
      message: res?.data?.message ?? "Signed out successfully",
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data;
    const hasMessage = (d: unknown): d is { message: string } =>
      typeof d === "object" && d !== null && "message" in d && typeof (d as { message: unknown }).message === "string";
    const fallbackMessage = hasMessage(data) ? data.message : undefined;
    return {
      success: false,
      message: status === 500 ? "Internal Server Error" : (fallbackMessage ?? "Failed to sign out"),
    };
  }
};
