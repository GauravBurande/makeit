import React from "react";
import { Button } from "@/components/ui/button";
import BeforeAfterSlider from "./ui/beforeAfter";
import Link from "next/link";
import configs from "@/config";

const CTA = () => {
  const beforeImage = `/beforeafters/before1.webp`;
  const afterImage = `/beforeafters/after1.png`;
  return (
    <div className="rounded-xl p-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4">
            Change the way Your rooms look
          </h2>
          <p className="mb-6">
            Experience the power of AI-driven interior design. Reimagine your
            home with just a photo - no expensive designer needed. Get stunning,
            personalized results in seconds, right from your device.
          </p>
          <Link href={"/signin"}>
            <Button className="text-xl capitalize" variant="default" size="lg">
              design your interior
            </Button>
          </Link>
        </div>
        <div className="flex-1 w-full">
          <BeforeAfterSlider
            beforeImage={beforeImage}
            afterImage={afterImage}
          />
        </div>
      </div>
    </div>
  );
};

export default CTA;
