import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import configs from "@/config";
import { StudioTopBar } from "@/components/studio/studioTopBar";
import { getUser } from "@/lib/db";

export default async function LayoutPrivate({
  children,
}: {
  children: React.ReactNode;
}) {
  // todo: fix this by extending the authOptions types with session and profile types extended
  // @ts-ignore
  const session = await getServerSession(authOptions);
  const user = await getUser();

  if (!session || !user) {
    redirect(configs.auth.signinUrl);
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <StudioTopBar user={user} />
      <div className="md:flex md:flex-1">{children}</div>
    </div>
  );
}
