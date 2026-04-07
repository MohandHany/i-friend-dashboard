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
import LoadingSpinner from "@/components/ifriend-spinner";

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
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              {`${versions.length} platform${versions.length !== 1 ? "s" : ""} configured`}
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
            {versions.length === 0 ? (
              <Card className="bg-white text-center py-10 text-natural-text col-span-full">No app versions found</Card>
            ) : (
              versions.map((v) => (
                <VersionCard key={v.id} version={v} onEdit={setEditingVersion} />
              ))
            )}
          </div>
        </>
      )}

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
