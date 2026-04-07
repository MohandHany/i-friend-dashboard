"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppVersion } from "@/services/queries/app-config/get/get-app-version";
import { PlatformBadge } from "./platform-badge";
import EditIcon from "@/public/edit-icon";

export interface VersionCardProps {
  version: AppVersion;
  onEdit: (v: AppVersion) => void;
}

export function VersionCard({ version, onEdit }: VersionCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium">
            <span className="bg-natural-text/10 text-natural-text px-2.5 py-1 rounded-full border">v{version.latestVersion}</span>
          </CardTitle>
          <Button
            variant="ghost"
            className="text-primary-blue hover:text-primary-blue-hover hover:bg-primary-blue/10"
            onClick={() => onEdit(version)}
            title="Edit version"
          >
            <EditIcon className="w-5! h-5!" />
            <span className="hidden sm:block">Edit</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Version info grid */}
        <PlatformBadge platform={version.platform} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-natural-text mb-1">Latest Version</p>
            <p className="text-sm font-medium">{version.latestVersion}</p>
          </div>
          <div>
            <p className="text-sm text-natural-text mb-1">Min. Version</p>
            <p className="text-sm font-medium">{version.minVersion}</p>
          </div>
          <div>
            <p className="text-sm text-natural-text mb-1">Force Update</p>
            <Badge
              variant={version.forceUpdate ? "destructive" : "secondary"}
              className={`text-xs font-medium ${version.forceUpdate
                  ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                }`}
            >
              {version.forceUpdate ? "Required" : "Optional"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-natural-text mb-1">Store URL</p>
            {version.storeUrl ? (
              <a
                href={version.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-blue hover:underline truncate block max-w-[120px]"
              >
                View Store
              </a>
            ) : (
              <p className="text-sm text-natural-text">Not set</p>
            )}
          </div>
        </div>

        <hr className="border-border/50" />

        {/* Release notes */}
        <div>
          <p className="text-sm text-natural-text mb-1">Release Notes</p>
          <p className="text-sm leading-relaxed">
            {version.releaseNotes || (
              <span className="text-natural-text">No notes</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
