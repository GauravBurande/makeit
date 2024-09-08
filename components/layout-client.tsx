"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "./ui/toaster";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
    </>
  );
};

export default ClientLayout;
