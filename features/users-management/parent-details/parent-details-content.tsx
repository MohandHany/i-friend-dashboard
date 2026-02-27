"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AllKidsTable } from "./components/all-kids-table"
import { useEffect, useState } from "react"
import { getParentDetails } from "@/services/queries/users-management/get/get-parent-details"
import type { ParentDetailsData } from "@/services/queries/users-management/get/get-parent-details"
import IFriendSpinner from "@/components/ifriend-spinner"
import { formatRegistrationDate } from "@/lib/utils"

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
            <BreadcrumbPage className="text-muted-foreground font-normal">
              {parent?.firstName} {parent?.lastName}
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

      {/* Content */}
      {parent && !loading && (
        <>
          {/* Header */}
          <h1 className="text-2xl font-semibold text-black">
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
                <Detail label="First Name">{parent.firstName}</Detail>
                <Detail label="Last Name">{parent.lastName}</Detail>
                <Detail label="Registration Date">
                  {formatRegistrationDate(parent.registrationDate)}
                </Detail>

                <Detail label="Subscription Status">
                  {parent.isSubscribed ? "Subscribed" : "Not Subscribed"}
                </Detail>

                <Detail label="Email">{parent.email}</Detail>
                <Detail label="Phone">{parent.phone}</Detail>
              </div>
            </CardContent>
          </Card>

          {/* Kids Table */}
          <AllKidsTable kids={parent.children ?? []} />
        </>
      )}
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <span className="text-sm text-natural-text font-medium">{label}</span>
      <span className="text-sm font-semibold col-span-2">{children}</span>
    </div>
  );
}
