import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { SignOut } from "@/components/signOut";
import { IUser } from "@/models/User";

export async function UserAvatar({ user }: { user: IUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-12 w-12 border-2 border-primary hover:border-primary/80 transition-colors duration-200">
          <AvatarImage
            src={user?.image}
            alt={"@" + user?.name || user?.email}
            className="object-cover"
          />
          <AvatarFallback className="uppercase text-lg font-semibold bg-secondary text-secondary-foreground">
            <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
              {user?.name?.charAt(0) || user?.email?.charAt(0)}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-3 space-y-2">
        <DropdownMenuLabel className="text-lg font-semibold px-2">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2 px-2 rounded-md hover:bg-secondary focus:bg-secondary cursor-pointer">
          <User className="mr-3" size={20} />
          <Link href="/settings#account" className="flex-grow">
            Overview
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 px-2 rounded-md hover:bg-secondary focus:bg-secondary cursor-pointer">
          <Wallet className="mr-3" size={20} />
          <Link href="/settings#billing" className="flex-grow">
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 px-2 rounded-md hover:bg-secondary focus:bg-secondary cursor-pointer">
          <Settings className="mr-3" size={20} />
          <Link href="/settings" className="flex-grow">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-2 px-2 rounded-md hover:bg-secondary focus:bg-secondary cursor-pointer">
          <LogOut className="mr-3" size={20} />
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
