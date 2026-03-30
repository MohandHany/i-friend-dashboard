import api from "@/services/axios"

export interface UpdateSignupDiscountPayload {
  signupDiscountPercent: number
}

export const updateSignupDiscount = async (payload: UpdateSignupDiscountPayload) => {
  try {
    const res = await api.patch("/loyalty/update-signup-discount", payload)
    return {
      success: true as const,
      message: res.data?.message ?? "Signup discount updated successfully ✅",
      data: res.data?.data,
    }
  } catch (err: any) {
    return {
      success: false as const,
      message: err.response?.data?.message || "Failed to update signup discount ❗",
    }
  }
}
