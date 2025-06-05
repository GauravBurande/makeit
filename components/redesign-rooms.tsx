import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import configs from "@/config";

const beforeImage = `/beforeafters/before2.webp`;
const afterImage1 = `/beforeafters/after2.1.png`;
const afterImage2 = `/beforeafters/after2.png`;
const afterImage3 = `/beforeafters/after2.2.png`;

const RedesignRooms = () => {
  return (
    <section id="redesign-rooms" className="w-full py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Take a photo and redesign your interior in seconds using AI
        </h2>
        <p className="text-xl text-center mb-12 text-accent">
          Transform your room within minutes
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Card className="w-full md:w-1/3 bg-transparent border-none">
            <CardContent className="p-0">
              <Image
                src={beforeImage}
                alt="Before"
                width={400}
                height={300}
                className="rounded-lg w-full"
              />
            </CardContent>
          </Card>

          <ArrowRight className="rotate-90 md:rotate-0 w-12 h-12 text-primary" />

          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[afterImage1, afterImage2, afterImage3].map((img, index) => (
              <Card key={index} className="bg-transparent border-none">
                <CardContent className="p-0">
                  <Image
                    src={img}
                    alt={`After ${index + 1}`}
                    width={400}
                    height={300}
                    className="rounded-lg w-full"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RedesignRooms;
