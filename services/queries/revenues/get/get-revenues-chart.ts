import api from "@/services/axios"

export interface ChartDataPoint {
  label: string
  amount: number
}

export interface RevenueStatsData {
  totalRevenue: number
  currency: string
  percentChange: string
  chartData: ChartDataPoint[]
}

interface RevenueStatsResponse {
  success: boolean
  message: string
  data: RevenueStatsData
}

export interface GetRevenuesStatsParams {
  timeframe?: "Weekly" | "Monthly" | "Years"
}

export const getRevenuesStats = async (params?: GetRevenuesStatsParams) => {
  try {
    const res = await api.get<RevenueStatsResponse>("/revenue/get-stats", { params })

    return {
      success: true as const,
      message: res.data?.message ?? "Revenue stats fetched successfully ✅",
      data: res.data?.data,
    }
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } }

    return {
      success: false as const,
      status: error?.response?.status,
      message: (error?.response?.data?.message as string) ?? "Failed to fetch revenue stats ❗",
    }
  }
}
