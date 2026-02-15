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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ArrowDownIcon from "@/public/arrow-down-icon";
import DownloadIcon from "@/public/download-icon";
import type { KidDetailsData } from "@/services/queries/users-management/GET/get-kid-details";
import { useEffect, useState } from "react";
import { getKidDetails } from "@/services/queries/users-management/GET/get-kid-details";
import IFriendSpinner from "@/components/ifriend-spinner";

const reports = [
  { id: 1, name: "Adham", lastName: "Ahmed", age: 8, reportsCount: 3 },
];

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
              {kid?.parentName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground font-normal">
              {kid?.firstName} {kid?.lastName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Loading */}
      {loading && (
        <div className="w-full h-[70vh] flex items-center justify-center">
          <IFriendSpinner size={80} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="w-full min-h-[40vh] flex items-center justify-center text-danger">
          {error}
        </div>
      )}

      {kid && !loading && (
        <>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            View <span className="text-natural-text">{kid?.firstName} {kid?.lastName}</span>
          </h1>
        </div>

        {/* Profile Details Card */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-black text-lg font-medium">Profile details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm text-gray-500 font-medium">First name</span>
                <span className="text-sm font-medium col-span-2">{kid?.firstName}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">Age</span>
                <span className="col-span-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    {kid?.age}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm text-gray-500 font-medium">Last name</span>
                <span className="text-sm font-medium col-span-2">{kid?.lastName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Child Report Card */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-black text-lg font-medium">Child Report</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-natural border-none">
                <TableRow>
                  <TableHead className="w-[50px] text-center text-lg font-semibold">#</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowDownIcon className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      File name
                      <ArrowDownIcon className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kid?.reports.map((report, index) => (
                  <TableRow key={index + 1}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>{report}</TableCell>
                    <TableCell className="text-right py-0">
                      <div className="flex items-center justify-end pr-8">
                        <Button variant="ghost" className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1">
                          <DownloadIcon className="h-5! w-5!" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}
