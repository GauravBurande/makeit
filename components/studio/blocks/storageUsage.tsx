"use client";

import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";

interface UsageProps {
  storageUsed: number; // in KB
  storageLimit: number; // in KB
}

function formatStorage(sizeInKB: number): string {
  if (sizeInKB < 1024) return `${sizeInKB} KB`;
  if (sizeInKB < 1048576) return `${(sizeInKB / 1024).toFixed(2)} MB`;
  return `${(sizeInKB / 1048576).toFixed(2)} GB`;
}

export function UsagePill({ storageUsed, storageLimit }: UsageProps) {
  const usagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-4">
            <Progress
              className="min-w-20 hidden md:block"
              value={usagePercentage}
            />
            <p className="text-muted-foreground">
              <span className="text-foreground font-semibold">Storage</span> (
              {usagePercentage.toFixed(2)}%)
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            You have used {formatStorage(storageUsed)} out of{" "}
            {formatStorage(storageLimit)} storage.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function UsageCard({ storageUsed, storageLimit }: UsageProps) {
  const [open, setOpen] = useState(true);
  const usagePercentage = (storageUsed / storageLimit) * 100;

  if (usagePercentage < 80) return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full px-5 py-4 bg-card rounded-lg"
    >
      <CollapsibleTrigger className="text-left w-full flex flex-col gap-4 transition-all">
        <div className="w-full">
          <div className="flex justify-between w-full">
            <p className="text-sm text-foreground font-medium">Storage usage</p>
            <ChevronUp
              size={18}
              className={
                "text-accent-foreground transition-transform " +
                (open ? "" : "rotate-180")
              }
            />
          </div>
          {open && (
            <p className="text-sm text-muted-foreground mt-1.5">
              You have used {usagePercentage.toFixed(1)}% of your total
              available storage. Consider upgrading.
            </p>
          )}
        </div>
        <Progress className="w-full grayscale h-2" value={usagePercentage} />
        {open && (
          <Link
            href="/settings/plan"
            className={buttonVariants({ variant: "link", size: "none" })}
          >
            Upgrade plan
          </Link>
        )}
      </CollapsibleTrigger>
    </Collapsible>
  );
}

// todo: update these values later by fetched from db
export default function StorageUsageDashboard({
  storageUsed = 0,
  storageLimit = 5 * 1024 * 1024,
}: UsageProps) {
  return (
    <div className="space-y-4">
      <UsagePill storageUsed={storageUsed} storageLimit={storageLimit} />
      <UsageCard storageUsed={storageUsed} storageLimit={storageLimit} />
    </div>
  );
}
