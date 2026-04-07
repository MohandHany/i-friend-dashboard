"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AllReportsTable } from "./components/all-reports-table";
import type { KidDetailsData } from "@/services/queries/users-management/get/get-kid-details";
import { useEffect, useState } from "react";
import { getKidDetails } from "@/services/queries/users-management/get/get-kid-details";
import IFriendSpinner from "@/components/ifriend-spinner";
import { Detail } from "@/components/detail";
import LoadingSpinner from "@/components/ifriend-spinner";


export function KidDetailsContent({ kidId }: { kidId: string }) {
  const [kid, setKid] = useState<KidDetailsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKidDetails = async () => {
      try {
        setLoading(true);
        const res = await getKidDetails(kidId);
        if (res.success) {
          setKid(res.data ?? null);
          setError(null);
        } else {
          setError(res.message);
        }
      } catch {
        setError("Unexpected error happened");
      } finally {
        setLoading(false);
      }
    };
    fetchKidDetails();
  }, [kidId]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center text-danger">
          {error}
        </div>
      ) : kid ? (
        <>
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/users-management">
                  Users Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/users-management/parent-details">
                  {kid.parentName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground font-normal">
                  {kid.firstName} {kid.lastName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-[22px] font-semibold">
              View <span className="text-natural-text">{kid.firstName} {kid.lastName}</span>
            </h1>
          </div>

          {/* Profile Details Card */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-black text-lg font-medium">Profile details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <Detail label="First Name" content={kid.firstName} />
                  <Detail label="Age" content={
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {kid.age}
                    </span>
                  } />
                  <Detail label="Last Name" content={kid.lastName} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Child Report Table */}
          <AllReportsTable reports={kid.reports} />
        </>
      ) : null}
    </div>
  );
}
