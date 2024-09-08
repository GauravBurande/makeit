import React from "react";
import Link from "next/link";
import Image from "next/image";
import configs from "@/config";
import logo from "@/app/icon.png";
import { UserAvatar } from "./blocks/userAvatar";
import { UsagePill } from "./blocks/storageUsage";
import { UserType } from "@/helper/types";
import { ImageUsageInfo } from "./blocks/imageUsage";

export async function StudioTopBar({ user }: { user: UserType }) {
  return (
    <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between bg-background border-b border-b-border">
      <div className="flex items-center space-x-6">
        <Link
          href="/studio"
          className="text-2xl flex items-center gap-2 font-bold capitalize"
        >
          <Image
            className="rounded-xl"
            src={logo}
            alt={configs.appName}
            width={44}
            height={44}
          />
          <p>{configs.appName} Studio</p>
        </Link>
      </div>

      <div className="flex items-center space-x-8 lg:space-x-12">
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <ImageUsageInfo usedImages={950} imageLimit={1000} />
          <UsagePill storageUsed={123 * 1024} storageLimit={5 * 1024 * 1024} />
        </div>
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} />
        </div>
      </div>
    </header>
  );
}
