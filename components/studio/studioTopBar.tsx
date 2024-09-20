import Link from "next/link";
import Image from "next/image";
import configs from "@/config";
import logo from "@/app/icon.png";
import { UserAvatar } from "./blocks/userAvatar";
import ButtonUpgrade from "./blocks/buttonUpgrade";
import { ImageUsageInfo, UsagePill } from "./blocks/usage";
import { TUser } from "@/helpers/types";

interface studioTopBarProps {
  user: TUser;
}
export async function StudioTopBar({ user }: studioTopBarProps) {
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
          <ImageUsageInfo
            usedImages={user?.usedImages || 0}
            imageLimit={user?.imageLimit || 0}
          />
          <UsagePill
            storageUsed={user?.storageUsed || 0}
            storageLimit={user?.storageLimit || 0}
          />
        </div>
        {!user.hasAccess && <ButtonUpgrade />}
        <div className={`${!user.hasAccess ? "hidden sm:flex" : ""}`}>
          <UserAvatar user={user} />
        </div>
      </div>
    </header>
  );
}
