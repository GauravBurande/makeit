import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import configs from "@/config";
import NavBar from "@/components/NavBar";

export default async function LayoutPrivate({
  children,
}: {
  children: React.ReactNode;
}) {
  // todo: fix this
  // @ts-ignore
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(configs.auth.signinUrl);
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <NavBar />
      <div className="md:flex md:flex-1">
        {/* <InteriorForm /> */}
        {children}
      </div>
    </div>
  );
}
