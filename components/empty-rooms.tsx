import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import configs from "@/config";

const emptyRoomImage = `/beforeafters/room.jpg`;
const designedRoom1 = `/beforeafters/room1.png`;
const designedRoom2 = `/beforeafters/room2.png`;
const designedRoom3 = `/beforeafters/room3.png`;

const DesignEmptyRooms = () => {
  return (
    <section id="design-empty-rooms" className="w-full py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Snap a photo and instantly redesign your empty rooms with AI
        </h2>
        <p className="text-xl text-center mb-12 text-accent">
          Specify how you want them to look and Revamp your room in minutes
          using AI-powered design.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Card className="w-full md:w-1/3 bg-transparent border-none">
            <CardContent className="p-0">
              <Image
                src={emptyRoomImage}
                alt="Empty Room"
                width={400}
                height={300}
                className="rounded-lg w-full"
              />
            </CardContent>
          </Card>

          <ArrowRight className="rotate-90 md:rotate-0 w-12 h-12 text-primary" />

          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[designedRoom1, designedRoom2, designedRoom3].map((img, index) => (
              <Card key={index} className="bg-transparent border-none">
                <CardContent className="p-0">
                  <Image
                    src={img}
                    alt={`Designed Room ${index + 1}`}
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

export default DesignEmptyRooms;
