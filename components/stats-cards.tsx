"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getParentsStats,
  type ParentsStatsData,
} from "@/services/queries/users-management/GET/get-parents-stats";
import { useRouter } from "next/navigation";

type StatsCardsProps = {
  includeAllUsersCard?: boolean;
};

export default function StatsCards({
  includeAllUsersCard = false,
}: StatsCardsProps) {
  const [stats, setStats] = useState<ParentsStatsData | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getParentsStats();
      if (!mounted) return;
      if (res.success) {
        setStats(res.data);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const totalUsers = stats?.totalUsers ?? 0;
  const subscribedUsers = stats?.subscribedUsers ?? 0;
  const notSubscribedUsers = stats?.notSubscribedUsers ?? 0;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-6 ${includeAllUsersCard ? "" : "gap-5"}`}>
      {includeAllUsersCard && (
        <Card className={includeAllUsersCard ? "rounded-r-none" : ""}>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text">
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {totalUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
      <Card className={includeAllUsersCard ? "rounded-none" : "col-span-3 cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200"} {...includeAllUsersCard ? {} : { onClick: () => { router.push("/users-management") } }}>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg text-natural-text font-normal">Subscribed</CardTitle>
        </CardHeader>
        <CardContent className={!includeAllUsersCard ? "flex flex-row items-center justify-between" : ""}>
          <div className="text-3xl font-semibold">{subscribedUsers.toLocaleString()}</div>
          {!includeAllUsersCard && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-flex items-center rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
                +9.6%
              </span>
              <span>Last month</span>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className={includeAllUsersCard ? "rounded-l-none col-span-4" : "col-span-3 cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200"} {...includeAllUsersCard ? {} : { onClick: () => { router.push("/users-management") } }}>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg text-natural-text font-normal">Non-Subscribed</CardTitle>
        </CardHeader>
        <CardContent className={!includeAllUsersCard ? "flex flex-row items-center justify-between" : ""}>
          <div className="text-3xl font-semibold">{notSubscribedUsers.toLocaleString()}</div>
          {!includeAllUsersCard && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-flex items-center rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
                +9.6%
              </span>
              <span>Last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}