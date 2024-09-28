import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BeforeAfterSlider from "./ui/beforeAfter";
import Link from "next/link";
import configs from "@/config";

const designImages = [
  "/designs/7.png",
  "/designs/8.png",
  "/designs/9.png",
  "/designs/10.png",
];

const beforeImage = `${configs.r2.bucketUrl}/public/beforeafters/before2.webp`;
const afterImage = `${configs.r2.bucketUrl}/public/beforeafters/after2.png`;

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:p-6"
    >
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-primary flex flex-wrap gap-2 items-center">
            <Link href={"#redesign-rooms"}>
              <Button variant="outline" className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Restyle
              </Button>
            </Link>
            Redesign your existing rooms.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary mb-4">
            Upload an image of your room and our AI design it the way you want
            that looks good and better!
          </p>
          <BeforeAfterSlider
            beforeImage={beforeImage}
            afterImage={afterImage}
          />
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-accent flex flex-wrap gap-2 items-center">
            <Link href={"#design-empty-rooms"}>
              <Button variant="outline" className="mr-2 hover:bg-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M12 20v-6M6 20V10M18 20V4"></path>
                </svg>
                Generate
              </Button>
            </Link>
            Design your empty rooms beautifully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-accent mb-4">
            Specify how you want them to look and easily generate amazing
            looking interior designs for your rooms.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {designImages.map((src, index) => (
              <Image
                key={index}
                width={512}
                height={512}
                src={src}
                alt={`Room design ${index + 1}`}
                className="w-full h-44 sm:h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default HowItWorks;
