"use client"
import StatsCards from "@/components/stats-cards";
import { TotalRevenuesChart } from "@/components/total-revenue-chart";
import { TotalUsersChart } from "@/components/total-users-chart";
import { TopList } from "./components/top-list";
import { useAuth } from "@/contexts/auth-context";
import { PERMISSIONS } from "@/lib/permissions";

export default function DashboardContent() {
  const { hasPermission } = useAuth()
  return (
    <div className="flex flex-col gap-5">
      {hasPermission(PERMISSIONS.USERS) && <StatsCards />}
      {(hasPermission(PERMISSIONS.REVENUE) || hasPermission(PERMISSIONS.ANALYSIS)) && (
        <div className={`grid grid-cols-1 ${hasPermission(PERMISSIONS.REVENUE) && hasPermission(PERMISSIONS.ANALYSIS) ? "xl:grid-cols-2" : "xl:grid-cols-1"} gap-5`}>
          {hasPermission(PERMISSIONS.REVENUE) && <TotalRevenuesChart justifyDiscount="justify-between" />}
          {hasPermission(PERMISSIONS.ANALYSIS) && <TotalUsersChart barSize={20} justifyDiscount="justify-between" />}
        </div>
      )}
      <TopList />
    </div>
  );
}