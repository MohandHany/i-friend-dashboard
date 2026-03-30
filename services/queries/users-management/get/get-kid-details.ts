import api from "@/services/axios"

export type KidReport = {
  id: string | number;
  name: string;
  fileName: string;
  date: string;
};

export type KidDetailsData = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  avatarUrl: string;
  reports: KidReport[];
  parentName: string;
}

export type KidDetailsResponse = {
  success: boolean;
  message: string;
  status?: number;
  data?: KidDetailsData;
}

export const getKidDetails = async (kidId: string): Promise<KidDetailsResponse> => {
  try {
    const res = await api.get(`/user-management/get-child-details/${kidId}`)
    return {
      success: true as const,
      message: res?.data?.message ?? "Kid details retrieved successfully ✅",
      data: res?.data?.data ?? {} as KidDetailsData,
    }
  } catch (err) {
    const error = err as { response?: { status?: number; data?: { message?: string } } };
    const status = error?.response?.status;
    return {
      success: false as const,
      status,
      message: error.response?.data?.message ?? "Failed to retrieve kid details ❗",
    }
  }
}


