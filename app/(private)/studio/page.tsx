import { InteriorDesignForm } from "@/components/studio/InteriorForm";
import { PricingDialog } from "@/components/pricing";
import ImageGallery from "@/components/studio/imageGallery";
import { getUser } from "@/lib/db";
import { redirect } from "next/navigation";

const Studio = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <main className="flex flex-col w-screen md:flex-row md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)]">
      <PricingDialog />
      <div className="w-full md:w-1/3 md:max-w-md">
        <InteriorDesignForm user={user} />
      </div>
      <div className="w-full md:w-2/3 md:flex-grow md:ml-2">
        <ImageGallery user={user} />
      </div>
    </main>
  );
};

export default Studio;
