import { TotalRevenueChart } from "@/components/total-revenue-chart";

export default function RevenueContent() {
  return (
    <div>
      <TotalRevenueChart justifyDiscount="justify-start" showTimeFilter={true} />
    </div>
  );
}