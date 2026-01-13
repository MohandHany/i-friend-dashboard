import { StatsCards } from "@/components/stats-cards";
import { TotalRevenueChart } from "@/components/total-revenue-chart";
import { TotalUsersChart } from "@/components/total-users-chart";
import { TopList } from "./components/top-list";

export default function HomeContent() {
  return (
    <div className="flex flex-col gap-5">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TotalRevenueChart justifyDiscount="justify-between" />
        <TotalUsersChart barSize={20} justifyDiscount="justify-between" />
      </div>
      <TopList />
    </div>
  );
}