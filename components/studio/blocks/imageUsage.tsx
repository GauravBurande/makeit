"use client";

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

interface ImageUsageProps {
  usedImages: number;
  imageLimit: number;
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
            You have used {usedImages} out of {imageLimit} available images.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ImageUsageCard({ usedImages, imageLimit }: ImageUsageProps) {
  const [open, setOpen] = useState(true);

  if (usedImages < 0.8 * imageLimit) return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full px-5 py-4 bg-card rounded-lg"
    >
      <CollapsibleTrigger className="text-left w-full flex flex-col gap-4 transition-all">
        <div className="w-full">
          <div className="flex justify-between w-full">
            <p className="text-sm text-foreground font-medium">Image usage</p>
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
              You have used {usedImages} out of {imageLimit} available images.
              Consider upgrading.
            </p>
          )}
        </div>
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

export default function ImageUsageDashboard({
  usedImages = 0,
  imageLimit = 1000,
}: ImageUsageProps) {
  return (
    <div className="space-y-4">
      <ImageUsageInfo usedImages={usedImages} imageLimit={imageLimit} />
      <ImageUsageCard usedImages={usedImages} imageLimit={imageLimit} />
    </div>
  );
}
