"use client";

import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface UsageProps {
  storageUsed: number; // in KB
  storageLimit: number; // in KB
}

interface UsageCardProps {
  icon: ReactNode;
  title: string;
  used: number;
  limit: number;
  unit: string;
}

interface ImageUsageProps {
  usedImages: number;
  imageLimit: number;
}

const formatStorage = (value: number): string => {
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(2)} GB`;
  } else if (value >= 1024) {
    return `${(value / 1024).toFixed(2)} MB`;
  } else {
    return `${value.toFixed(2)} KB`;
  }
};

const UsageCard = ({ icon, title, used, limit, unit }: UsageCardProps) => {
  const percentage = (used / limit) * 100;
  const formattedUsed = unit === "KB" ? formatStorage(used) : `${used} ${unit}`;
  const formattedLimit =
    unit === "KB" ? formatStorage(limit) : `${limit} ${unit}`;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formattedUsed}</span>
        <span>{formattedLimit}</span>
      </div>
    </div>
  );
};

export function UsagePill({ storageUsed, storageLimit }: UsageProps) {
  const usagePercentage = (storageUsed / storageLimit) * 100 || 0;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-4">
            <Progress
              className="min-w-14 hidden md:block"
              value={usagePercentage}
            />
            <p className="text-muted-foreground">
              <span className="text-foreground font-semibold">Storage</span> (
              {storageLimit == 0
                ? formatStorage(storageUsed)
                : `${usagePercentage.toFixed(2)} %`}
              )
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

export function ImageUsageInfo({ usedImages, imageLimit }: ImageUsageProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center">
            <p className="text-muted-foreground">
              ({usedImages}/{imageLimit}){" "}
              <span className="text-foreground font-semibold">
                Images Created
              </span>
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            You have created {usedImages} out of {imageLimit} available images.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default UsageCard;
