import React from "react";
import { Button } from "@/components/ui/button";
import Marquee from "./magicui/marquee";
import Image from "next/image";
import { Fade } from "./magicui/fade-in";
import Link from "next/link";

const Hero = () => {
  const designs = Array.from({ length: 9 }, (_, index) => ({
    src: `/designs/${index + 1}.png`,
  }));

  return (
    <section className="overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <main className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl max-w-5xl leading-snug text-foreground/80 font-bold mb-6">
          <Fade>Design your rooms and change the way they look</Fade>
        </h1>
        <Fade
          framerProps={{
            show: { transition: { delay: 0.4 } },
          }}
        >
          <p className="text-xl text-accent max-w-2xl mx-auto">
            Use MakeIt.ai to fill up your empty rooms with the perfect design or
            change the way your rooms look, it&apos;s simple and easy!
          </p>
        </Fade>
      </main>

      <div className="relative w-full mb-12">
        <Marquee pauseOnHover className="[--duration:30s]">
          {designs.map((design, index) => (
            <div key={index} className="flex w-full h-full justify-center px-1">
              <div className="relative group">
                <Image
                  src={design.src}
                  alt={`design ${index + 1}`}
                  width={200}
                  height={80}
                  className="w-full h-full rounded-lg shadow-md transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-primary/50"></div>
              </div>
            </div>
          ))}
        </Marquee>
        <div className="absolute -left-1 lg:left-0 z-40 inset-y-0 w-1/4 bg-gradient-to-r from-background to-transparent h-full pointer-events-none" />
        <div className="absolute -right-1 lg:right-0 z-40 inset-y-0 w-1/4 bg-gradient-to-l from-background to-transparent h-full pointer-events-none" />
      </div>

      <Link href={"/signin"}>
        <Button size="lg" className="px-8 py-3 capitalize text-lg">
          design your interior
        </Button>
      </Link>
    </section>
  );
};

export default Hero;
