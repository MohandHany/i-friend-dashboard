import api from "@/services/axios";

export const signIn = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/sign-in", { email, password });
    const accessToken: string | undefined = res?.data?.data?.accessToken;

    if (typeof window !== "undefined" && accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    return {
      success: true,
      message: res?.data?.message ?? "Login successful",
      accessToken: accessToken,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false,
      message: data?.message ?? status === 401 ? "Invalid email or password" : "Login failed",
    };
  }
};