import { TotalUsersChart } from "@/components/total-users-chart";

export default function AnalysisContent() {
  return (
    <div>
      <div className="w-full">
        <TotalUsersChart barSize={35} justifyDiscount="justify-start" />
      </div>
    </div>
  );
}