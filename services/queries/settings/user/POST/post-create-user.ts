import api from "@/services/axios";
import { DashboardUserData } from "@/services/queries/settings/user/get/get-all-users";

export interface Request {
  avatarUrl?: File;
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  [property: string]: unknown;
}

export type CreateUserResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: DashboardUserData;
};

export const postCreateDashboardUser = async (body: Request) => {
  try {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      // Append files/blobs directly, otherwise cast to string
      if (typeof Blob !== "undefined" && value instanceof Blob) {
        formData.append(key, value);
      } else if (typeof File !== "undefined" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const res = await api.post<CreateUserResponse>(
      "/settings/user/create-user",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return {
      success: true as const,
      message: res?.data?.message ?? "User created successfully",
      data: res.data?.data,
    };
  } catch (err) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = error.response?.status;
    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to create user",
    };
  }
};
