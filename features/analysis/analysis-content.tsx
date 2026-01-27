"use client"
import { TotalUsersChart } from "@/components/total-users-chart";
import { UsersLocationTable } from "./components/users-location-table";

export default function AnalysisContent() {
  return (
    <div className="space-y-5">
      <div className="w-full">
        <TotalUsersChart barSize={35} justifyDiscount="justify-start" showTimeFilter={true} />
      </div>
      <UsersLocationTable />
    </div>
  );
}