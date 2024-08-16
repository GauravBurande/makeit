import React from "react";
import { Camera, FileImage, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <main className="text-center">
        <h1 className="text-4xl md:text-6xl max-w-5xl leading-snug text-foreground/80 font-bold mb-6">
          Transform Your Space with AI-Powered Design
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          MakeIt.ai revolutionizes interior design. Redesign your current space,
          fill empty rooms, or enhance your existing interiors - all with the
          power of AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
          <FeatureCard
            icon={<Camera className="w-8 h-8 mb-4" />}
            title="Redesign Current Rooms"
            description="Take a photo of your room and see it transformed with new designs."
          />
          <FeatureCard
            icon={<Home className="w-8 h-8 mb-4" />}
            title="Design Empty Spaces"
            description="Capture your new empty room and watch it come to life with perfect interiors."
          />
          <FeatureCard
            icon={<FileImage className="w-8 h-8 mb-4" />}
            title="Enhance Interiors"
            description="Upscale and improve your existing interior images for a polished look."
          />
        </div>
        <Button size="lg" className="px-8 py-3 capitalize text-lg">
          design your interior
        </Button>
      </main>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="bg-accent p-6 rounded-lg shadow-md">
    {icon}
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Hero;
