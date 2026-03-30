"use client"

import * as React from "react"
import { getRevenuesStats, RevenueStatsData } from "@/services/queries/revenues/get/get-revenues-chart"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "./ui/button"
import { useRouter, usePathname } from "next/navigation"

const chartConfig = {
  amount: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TotalRevenuesChart({ justifyDiscount, showTimeFilter }: { justifyDiscount: string, showTimeFilter?: boolean }) {
  const [timeRange, setTimeRange] = React.useState("Yearly")
  const [data, setData] = React.useState<RevenueStatsData | null>(null)

  React.useEffect(() => {
    (async () => {
      // Map "Yearly" to "Years" to match the API expected values
      const apiTimeframe = timeRange === "Yearly" ? "Years" : (timeRange as "Weekly" | "Monthly" | "Years")
      const res = await getRevenuesStats({ timeframe: apiTimeframe })
      if (res.success && res.data) {
        setData(res.data)
      }
    })()
  }, [timeRange])
  const router = useRouter()
  const pathname = usePathname().split("/")[1]
  return (
    <Card className={`w-full h-fit ${pathname !== "revenues" && "hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer"}`} onClick={() => router.push("/revenues")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex flex-col space-y-1 w-full border-b pb-4">
          <div className="flex items-center justify-between w-full mb-0">
            <CardTitle className="font-normal text-lg">
              Total Revenues
            </CardTitle>
            {showTimeFilter && (
              <div className="flex items-center gap-2">
                {["Weekly", "Monthly", "Yearly"].map((range) => (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-6 py-3 rounded-lg cursor-pointer shadow transition-all duration-200
                      ${timeRange === range
                        ? "bg-primary-blue text-white hover:bg-primary-blue-hover"
                        : "bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20"
                      }`}
                    variant={"default"}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className={`w-full flex items-end gap-4 ${justifyDiscount}`}>
            <span className="text-3xl font-semibold">
              {data ? `${data.totalRevenue.toLocaleString()} ${data.currency}` : "Loading..."}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-0 pr-4 pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={data?.chartData || []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={15}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="amount"
              type="linear"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="#0066FF"
              strokeWidth={2}
              dot={{
                fill: "#0066FF",
                stroke: "#FFFFFF",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
