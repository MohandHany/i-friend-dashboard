"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getAnalysisChart,
  AnalysisPeriod,
} from "@/services/queries/analysis/get/get-analysis-chart";

// Dynamic chart state populated from API
type DynamicChartRow = { period: string;[key: string]: number | string }

const defaultPalette = ["#0066FF", "#4D94FF", "#80B3FF", "#B3D1FF", "#D9E6FF", "#6EE7B7", "#F59E0B", "#EF4444", "#A78BFA", "#10B981"]

export function TotalUsersChart({ barSize, justifyDiscount, showTimeFilter }: { barSize: number, justifyDiscount: string, showTimeFilter?: boolean }) {
  const [timeRange, setTimeRange] = useState<AnalysisPeriod>("yearly")
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [rows, setRows] = useState<DynamicChartRow[]>([])
  const [config, setConfig] = useState<ChartConfig>({})
  const ranges: AnalysisPeriod[] = ["weekly", "monthly", "yearly"]
  const router = useRouter()
  const pathname = usePathname().split("/")[1]

  useEffect(() => {
    (async () => {
      try {
        const res = await getAnalysisChart(timeRange);
        if (res.success && res.data) {
          // Build dynamic rows for Recharts
          const labels = res.data.labels;
          const datasets = res.data.datasets;
          const totalUsers = res.data.totalUsersInDb;
          setTotalUsers(totalUsers);
          const builtRows: DynamicChartRow[] = labels.map((label, index) => {
            const row: DynamicChartRow = { period: label };
            datasets.forEach((ds) => {
              // use dataset.label as key (e.g., "Cairo, Egypt")
              row[ds.label] = ds.data[index] ?? 0;
            });
            return row;
          });
          setRows(builtRows);

          // Build legend/config dynamically
          const builtConfig: ChartConfig = {};
          datasets.forEach((ds, i) => {
            builtConfig[ds.label] = {
              label: ds.label,
              color: defaultPalette[i % defaultPalette.length],
            };
          });
          setConfig(builtConfig);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [timeRange]);

  return (
    <Card className={`h-full ${pathname !== "analysis" && "hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer"}`} onClick={() => router.push("/analysis")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex flex-col space-y-1 w-full border-b pb-4">
          <div className="flex items-center justify-between w-full mb-0">
            <CardTitle className="font-normal text-lg">Total Users</CardTitle>
            {showTimeFilter && (
              <div className="flex items-center gap-2">
                {ranges.map((range) => (
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
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className={`w-full flex items-end gap-4 ${justifyDiscount}`}>
            <span className="text-3xl font-semibold">{totalUsers}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">
                -1.8%
              </span>
              <span className="text-xs text-muted-foreground">Last month</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-0 pr-4 pb-4">
        <ChartContainer config={config} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={rows}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // labels expected as e.g., 2026-W04
              tickFormatter={(value) => String(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            // Let Recharts compute domain from data
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.entries(config).map(([key, cfg]) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={cfg.color}
                radius={[5, 5, 5, 5]}
                stroke="#fff"
                strokeWidth={2}
                barSize={barSize}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
