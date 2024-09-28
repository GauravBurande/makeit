import React from "react";
import { Button } from "@/components/ui/button";
import Marquee from "./magicui/marquee";
import Image from "next/image";
import { Fade } from "./magicui/fade-in";
import Link from "next/link";
import configs from "@/config";

interface Props {
  session: any;
}

const Hero = ({ session }: Props) => {
  const designs = Array.from({ length: 9 }, (_, index) => ({
    src: `${configs.r2.bucketUrl}/public/designs/${index + 1}.png`,
  }));

  return (
    <section className="overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <main className="text-center mb-12">
        <Fade direction="up">
          <h1 className="text-4xl md:text-6xl max-w-5xl leading-snug text-foreground/80 font-bold mb-6">
            Design your rooms and change the way they look
          </h1>
        </Fade>
        <Fade
          direction="up"
          framerProps={{
            show: { transition: { delay: 0.2 } },
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
                  className="w-full h-full rounded-lg shadow-md transition-all duration-300 group-hover:scale-105"
                  src={design.src}
                  alt={`design ${index + 1}`}
                  width={200}
                  height={80}
                  priority
                />
                <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-primary/50"></div>
              </div>
            </div>
          ))}
        </Marquee>
        <div className="absolute -left-1 lg:left-0 z-40 inset-y-0 w-1/4 bg-gradient-to-r from-background to-transparent h-full pointer-events-none" />
        <div className="absolute -right-1 lg:right-0 z-40 inset-y-0 w-1/4 bg-gradient-to-l from-background to-transparent h-full pointer-events-none" />
      </div>

      <Link href={session ? "/studio" : "/signin"}>
        <Button size="lg" className="px-8 py-3 capitalize text-lg">
          {session ? "MakeIt studio" : "design your interior"}
        </Button>
      </Link>
    </section>
  );
};

export default Hero;
