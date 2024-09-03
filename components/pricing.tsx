"use client";
import { Check } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

// todo: change the pricing later with stripe, etc...
const pricingPlans = [
  {
    name: "Personal",
    price: 29,
    description:
      "Discover your inner designer and create your dream home with our cost-effective, user-friendly software.",
    features: [
      "250 images per month",
      "1GB cloud storage for images",
      "AI Prompt suggestions",
      "Personal-use only",
      "Small watermark",
    ],
  },
  {
    name: "Pro",
    price: 99,
    description:
      "Brainstorm ideas quickly, impress clients with stunning visuals, and close deals faster using our professional tools.",
    features: [
      "1,000 images per month",
      "5GB cloud storage for images",
      "AI Prompt suggestions",
      "Commercial license",
      "No watermark",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: 299,
    description:
      "Empower your firm with cutting-edge AI technology to enhance efficiency and stay competitive in the market.",
    features: [
      "5,000 images per month",
      "25GB cloud storage for images",
      "AI Prompt suggestions",
      "Commercial license",
      "No watermark",
    ],
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Simple pricing for everyone
        </h2>
        <p className="text-center mb-8">Cancel anytime.</p>

        <div className="flex justify-center items-center mb-8">
          <span className={`mr-2 ${isYearly ? "text-muted-foreground" : ""}`}>
            Monthly
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`ml-2 ${isYearly ? "" : "text-muted-foreground"}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="ml-2 text-sm text-primary">2 months free</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex overflow-hidden flex-col ${
                plan.popular ? "border-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm">
                  Most popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">{plan.description}</p>
                <p className="text-4xl font-bold mb-6">
                  ${isYearly ? plan.price * 10 : plan.price}
                  <span className="text-lg font-normal">
                    {isYearly ? "/year" : "/ month"}
                  </span>
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex text-accent items-center"
                    >
                      <Check className="h-5 w-5mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Upgrade
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Powered by stripe
        </div>
      </div>
    </section>
  );
};

export default Pricing;
