"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getAppVersion,
  AppVersion,
} from "@/services/queries/app-config/get/get-app-version";
import { VersionCard } from "./version-card";
import { EditVersionCard } from "./edit-version-card";
import { CreateVersionCard } from "./create-version-card";
import PlusIcon from "@/public/plus-icon";

function SkeletonCard() {
  return (
    <Card className="border border-border/60 shadow-sm animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-8 w-8 rounded-md bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-5 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-px w-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
        </div>
        <div className="h-3 w-32 rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export default function AppConfigContent() {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingVersion, setEditingVersion] = useState<AppVersion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchVersions = async () => {
    setIsLoading(true);
    const res = await getAppVersion();
    if (res.success) {
      setVersions(res.data);
    } else {
      toast(res.message + " ❗");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          {isLoading
            ? "Loading..."
            : `${versions.length} platform${versions.length !== 1 ? "s" : ""} configured`}
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5"
        >
          <PlusIcon className="w-6! h-6!" />
          Add Platform
        </Button>
      </div>

      <hr className="border-border/50" />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : versions.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-3-3v6M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No app versions found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Version data will appear here once configured.
            </p>
          </div>
        ) : (
          versions.map((v) => (
            <VersionCard key={v.id} version={v} onEdit={setEditingVersion} />
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingVersion && (
        <EditVersionCard
          open={!!editingVersion}
          onClose={() => setEditingVersion(null)}
          version={editingVersion}
          onSaved={fetchVersions}
        />
      )}

      {/* Create Dialog */}
      <CreateVersionCard
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onSaved={fetchVersions}
      />
    </div>
  );
}
