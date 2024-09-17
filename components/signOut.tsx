"use client";
import { signOut } from "next-auth/react";

export function SignOut() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  return <button onClick={handleSignOut}>Sign out</button>;
}
