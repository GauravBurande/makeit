"use client";

import { SessionProvider } from "next-auth/react";
import config from "@/config";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default ClientLayout;
