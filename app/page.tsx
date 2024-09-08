import CTA from "@/components/cta";
import DesignEmptyRooms from "@/components/empty-rooms";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Pricing from "@/components/pricing";
import RedesignRooms from "@/components/redesign-rooms";
import UserTypeGrid from "@/components/userTypeGrid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";

export default async function Home() {
  // @ts-ignore
  const session = await getServerSession(authOptions);

  return (
    <>
      <main className="px-10 md:px-20 py-10 space-y-6 md:space-y-10">
        <Header session={session} />
        <Hero session={session} />
        <HowItWorks />
        <RedesignRooms />
        <DesignEmptyRooms />
        <UserTypeGrid />
        <Pricing session={session} />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
