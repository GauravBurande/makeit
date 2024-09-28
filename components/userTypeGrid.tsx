import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fade } from "./magicui/fade-in";
import configs from "@/config";

const userTypes = [
  {
    title: "Home Owners",
    imageUrl: `${configs.r2.bucketUrl}/public/userTypes/home-owners.webp`,
    description: "Discover your dream home without breaking the bank.",
    details:
      "Our user-friendly, professional-grade tool empowers you to envision your perfect space with ease.",
  },
  {
    title: "Interior Designers",
    imageUrl: `${configs.r2.bucketUrl}/public/userTypes/interior-designers.jpeg`,
    description:
      "Secure more clients and seal deals faster by generating a plethora of design ideas in a fraction of the time.",
    details:
      "Stay ahead of the curve by incorporating cutting-edge AI technology in your work.",
  },
  {
    title: "Real Estate Agents",
    imageUrl: `${configs.r2.bucketUrl}/public/userTypes/real-estate.jpeg`,
    description:
      "Sell properties faster by showcasing multiple interior design possibilities to prospective clients.",
    details:
      "Boost conversion rates on your website with diverse and stunning visualizations.",
  },
  //   {
  //     title: "Architects",
  //     imageUrl: "/userTypes/4.png",
  //     description:
  //       "Simplify your design process and impress clients with a sneak peek into their future interior.",
  //     details:
  //       "Leverage our easy-to-use tool to generate design ideas without needing to master interior design.",
  //   },
  {
    title: "Airbnb Hosts",
    imageUrl: `${configs.r2.bucketUrl}/public/userTypes/airbnb-hosts.webp`,
    description:
      "Maximize your rental potential by showcasing beautiful, fully-furnished spaces to prospective guests.",
    details:
      "Easily create inviting and photogenic environments that can boost your listings and attract more bookings.",
  },
];

const UserTypeGrid = () => {
  return (
    <section id="use-cases">
      <h3 className="text-3xl md:text-5xl max-w-5xl mx-auto text-center leading-snug text-foreground/80 font-bold mb-6">
        <Fade>Useful for any of your needs</Fade>
      </h3>
      <Fade
        framerProps={{
          show: { transition: { delay: 0.4 } },
        }}
      >
        <p className="text-xl text-accent text-center max-w-2xl mx-auto mb-6">
          Whether you&apos;re looking to envision your dream home, impress
          clients with stunning designs, or maximize your rental potential,
          makeit.ai offers the resources you need.
        </p>
      </Fade>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {userTypes.map((userType, index) => (
          <Card className="shadow-lg rounded-xl overflow-hidden" key={index}>
            <CardHeader className="p-0">
              <Image
                src={userType.imageUrl}
                alt={userType.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{userType.title}</CardTitle>
              <p className="text-sm mb-2">{userType.description}</p>
              <p className="text-accent text-sm">{userType.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default UserTypeGrid;
