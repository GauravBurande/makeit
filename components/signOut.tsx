"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOut() {
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  return <button onClick={handleSignOut}>Sign out</button>;
}
