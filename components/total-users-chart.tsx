"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", cairo: 200, giza: 100, alexandria: 50, dakahlia: 30, other: 50 },
  { month: "Feb", cairo: 200, giza: 100, alexandria: 50, dakahlia: 30, other: 50 },
  { month: "Mar", cairo: 350, giza: 100, alexandria: 50, dakahlia: 30, other: 100 },
  { month: "Apr", cairo: 150, giza: 100, alexandria: 50, dakahlia: 30, other: 80 },
  { month: "May", cairo: 300, giza: 200, alexandria: 50, dakahlia: 30, other: 100 },
  { month: "Jun", cairo: 150, giza: 100, alexandria: 50, dakahlia: 30, other: 150 },
  { month: "Jul", cairo: 200, giza: 300, alexandria: 50, dakahlia: 30, other: 100 },
  { month: "Aug", cairo: 100, giza: 100, alexandria: 50, dakahlia: 30, other: 80 },
  { month: "Sep", cairo: 50, giza: 50, alexandria: 50, dakahlia: 30, other: 80 },
  { month: "Oct", cairo: 400, giza: 100, alexandria: 50, dakahlia: 30, other: 100 },
  { month: "Nov", cairo: 100, giza: 100, alexandria: 50, dakahlia: 30, other: 80 },
  { month: "Dec", cairo: 200, giza: 200, alexandria: 50, dakahlia: 30, other: 80 },
]

const chartConfig = {
  cairo: {
    label: "Cairo",
    color: "#0066FF",
  },
  giza: {
    label: "Giza",
    color: "#4D94FF",
  },
  alexandria: {
    label: "Alexandria",
    color: "#80B3FF",
  },
  dakahlia: {
    label: "Dakahlia",
    color: "#B3D1FF",
  },
  other: {
    label: "Other",
    color: "#D9E6FF",
  },
} satisfies ChartConfig

export function TotalUsersChart({ barSize, justifyDiscount }: { barSize: number, justifyDiscount: string }) {
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col space-y-1 w-full">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Total users
          </CardTitle>
          <div className={`w-full flex items-end gap-4 ${justifyDiscount}`}>
            <span className="text-2xl font-bold">4,230</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">
                -1.8%
              </span>
              <span className="text-xs text-muted-foreground">last month</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 1000]}
              ticks={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="cairo"
              stackId="a"
              fill="var(--color-cairo)"
              radius={[5, 5, 5, 5]}
              stroke="#fff"
              strokeWidth={2}
              barSize={barSize}
            />
            <Bar
              dataKey="giza"
              stackId="a"
              fill="var(--color-giza)"
              radius={[5, 5, 5, 5]}
              stroke="#fff"
              strokeWidth={2}
              barSize={barSize}
            />
            <Bar
              dataKey="alexandria"
              stackId="a"
              fill="var(--color-alexandria)"
              radius={[5, 5, 5, 5]}
              stroke="#fff"
              strokeWidth={2}
              barSize={barSize}
            />
            <Bar
              dataKey="dakahlia"
              stackId="a"
              fill="var(--color-dakahlia)"
              radius={[5, 5, 5, 5]}
              stroke="#fff"
              strokeWidth={2}
              barSize={barSize}
            />
            <Bar
              dataKey="other"
              stackId="a"
              fill="var(--color-other)"
              radius={[5, 5, 5, 5]}
              stroke="#fff"
              strokeWidth={2}
              barSize={barSize}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
