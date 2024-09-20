"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOut({ fullWidth = false, children = "Sign out" }) {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (fullWidth) {
    return (
      <Button
        onClick={handleSignOut}
        variant={"outline"}
        className={"w-full hover:bg-destructive py-6"}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {children}
      </Button>
    );
  }

  return <button onClick={handleSignOut}>Sign out</button>;
}

export default SignOut;
