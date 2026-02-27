import api from "@/services/axios";

export type DeleteUsersData = {
  userIds: string[];
}

export type DeleteUsersResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: DeleteUsersData;
}

export const deleteUsers = async (userIds: string[]) => {
  try {
    const res = await api.delete<DeleteUsersResponse>(
      "/settings/user/delete-user",
      { data: { userIds } }
    );
    return {
      success: true as const,
      message: res?.data?.message ?? "Users deleted successfully",
      data: res.data.data,
    }
  } catch (err) {
    const error = err as {response?: { status?: number; data?: { message?: string } }}
    const status = error.response?.status;

    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to delete users",
    }
  }
}

