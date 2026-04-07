"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AllKidsTable } from "./components/all-kids-table"
import { useEffect, useState } from "react"
import { getParentDetails } from "@/services/queries/users-management/get/get-parent-details"
import type { ParentDetailsData } from "@/services/queries/users-management/get/get-parent-details"
import IFriendSpinner from "@/components/ifriend-spinner"
import { formatRegistrationDate } from "@/lib/utils"
import { Detail } from "@/components/detail"
import LoadingSpinner from "@/components/ifriend-spinner"

export function ParentDetailsContent({ parentId }: { parentId: string }) {
  const [parent, setParent] = useState<ParentDetailsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentDetails = async () => {
      try {
        setLoading(true);
        const res = await getParentDetails(parentId);
        if (res.success) {
          setParent(res.data ?? null);
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
    fetchParentDetails();
  }, [parentId]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center text-danger">
          {error}
        </div>
      ) : parent ? (
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
                <BreadcrumbPage className="text-natural-text font-normal">
                  {parent.firstName} {parent.lastName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <h1 className="text-[22px] font-semibold">
            View{" "}
            <span className="text-natural-text">
              {parent.firstName} {parent.lastName}
            </span>
          </h1>

          {/* Profile Details */}
          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-lg font-medium text-black">
                Profile details
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <Detail label="First Name" content={parent.firstName} />
                <Detail label="Last Name" content={parent.lastName} />
                <Detail label="Registration Date" content={formatRegistrationDate(parent.registrationDate)} />

                <Detail label="Subscription Status" content={
                  <span className={`px-3 py-1 rounded-full ${parent.isSubscribed ? "text-success bg-success/10" : "text-danger bg-danger/10"}`}>
                    {parent.isSubscribed ? "Subscribed" : "Not Subscribed"}
                  </span>
                } />

                <Detail label="Email" content={parent.email} />
                <Detail label="Phone" content={parent.phone} />
              </div>
            </CardContent>
          </Card>

          {/* Kids Table */}
          <AllKidsTable kids={parent.children ?? []} />
        </>
      ) : null}
    </div>
  );
}