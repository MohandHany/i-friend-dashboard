import api from "@/services/axios"

export interface UpdateLoyaltySettingsPayload {
  pointsPerReferral: number
  signupDiscountPercent: number
  isReferralEnabled: boolean
  isRedemptionEnabled: boolean
}

export const updateLoyaltySettings = async (payload: UpdateLoyaltySettingsPayload) => {
  try {
    const res = await api.put("/loyalty/update-loyalty-settings", payload)
    return {
      success: true as const,
      message: res.data?.message ?? "Loyalty settings updated successfully ✅",
      data: res.data?.data,
    }
  } catch (err: any) {
    return {
      success: false as const,
      message: err.response?.data?.message || "Failed to update loyalty settings ❗",
    }
  }
}
