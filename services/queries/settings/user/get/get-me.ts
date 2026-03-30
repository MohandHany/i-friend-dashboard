import api from "@/services/axios";

export type MyDataType = {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
    createdAt: string;
    dashboardUserRole: {
      name: string;
      dashboardRolePermissions?: Array<{
        permission: {
          id: string;
          name: string;
        }
      }>;
    }
  };
}

export const getMe = async () => {
  try {
    const res = await api.get("/settings/user/get-me");

    const outer = res?.data;
    const mid = outer?.data;
    const inner = mid?.data;
    const user = inner?.user;

    const normalized: MyDataType = {
      success: Boolean(mid?.success ?? true),
      message: String(mid?.message ?? outer?.message ?? "My data fetching successfully ✅"),
      user: user
        ? {
          ...user,
          role: user?.dashboardUserRole?.name ?? "",
        }
        : {
          id: "",
          name: "",
          email: "",
          role: "",
          avatarUrl: null,
          dashboardUserRole: { name: "" },
        },
    };

    return {
      success: true,
      message: normalized.message,
      data: normalized,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};

    if (process.env.NODE_ENV === 'development') {
      console.error('[getMe] Error fetching user data:', { status, message: data?.message });
    }

    return {
      success: false,
      message: data?.message ?? `My data fetching failed, Error ${status} ❗`,
    };
  }
};
