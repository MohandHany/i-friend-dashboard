"use client"
import { TotalRevenuesChart } from "@/components/total-revenue-chart";
import { AllCustomersTable } from "./components/all-customers-table";

export default function RevenuesContent() {
  return (
    <div>
      <TotalRevenuesChart justifyDiscount="justify-start" showTimeFilter={true} />
      <AllCustomersTable />
    </div>
  );
}