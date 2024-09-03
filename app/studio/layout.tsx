import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
// @ts-ignore
import { authOptions } from "@/libs/next-auth";
// @ts-ignore
import configs from "@/config";
import NavBar from "@/components/NavBar";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({
  children,
}: {
  children: React.ReactNode;
}) {
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
