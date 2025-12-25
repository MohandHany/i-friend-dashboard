"use client"

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

const chartData = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 5000 },
  { month: "Mar", revenue: 12000 },
  { month: "Apr", revenue: 16000 },
  { month: "May", revenue: 26000 },
  { month: "Jun", revenue: 9000 },
  { month: "Jul", revenue: 16000 },
  { month: "Aug", revenue: 34000 },
  { month: "Sep", revenue: 18000 },
  { month: "Oct", revenue: 29000 },
  { month: "Nov", revenue: 31000 },
  { month: "Dec", revenue: 31000 },
  { month: "Jan2", revenue: 20000 },
  { month: "Feb2", revenue: 30000 },
]

// Truncate to 12 months for display matching image
const displayData = chartData.slice(1, 13).map((d, i) => ({ ...d, month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i] }))


const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TotalRevenueChart({ justifyDiscount }: { justifyDiscount: string }) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col space-y-1 w-full">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Total revenues
          </CardTitle>
          <div className={`w-full flex items-end gap-4 ${justifyDiscount}`}>
            <span className="text-2xl font-bold">10,230 EGP</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                +9.6%
              </span>
              <span className="text-xs text-muted-foreground">last month</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={displayData}
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tickFormatter={(value) => `${value / 1000}k`}
              domain={[0, 50000]}
              ticks={[0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="revenue"
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
