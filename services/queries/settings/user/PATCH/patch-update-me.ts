import api from "@/services/axios";
import { DashboardUserData } from "@/services/queries/settings/user/get/get-all-users";

export interface UpdateMeData {
  avatarUrl?: File | string | null;
  name?: string;
  email?: string;
  password?: string;
  [property: string]: unknown;
}

export type UpdateMeResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: DashboardUserData;
}

export const patchUpdateMe = async (body: UpdateMeData) => {
  try {
    const hasFile = Object.values(body).some(value => value instanceof File || value instanceof Blob);

    let data: any = body;
    let headers = {};

    if (hasFile) {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, value as string | Blob);
      });
      data = formData;
      headers = { "Content-Type": "multipart/form-data" };
    }

    const res = await api.patch<UpdateMeResponse>(
      "/settings/user/update-me",
      data,
      { headers }
    );
    return {
      success: true as const,
      message: res?.data?.message ?? "Profile updated successfully",
      data: res.data?.data,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: { message?: string } } };
    const status = error.response?.status;
    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to update profile",
    };
  }
};
