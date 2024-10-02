"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import configs from "@/config";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "./ui/scroll-area";
import FAQ from "./faq";

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  features: string[];
  priceId: string;
  yearlyPriceId: string;
  popular?: boolean;
}

interface PricingProps {
  checkout: boolean;
  plans: PricingPlan[];
  isDialog?: boolean;
}

const PricingTable: React.FC<PricingProps> = ({ checkout, plans }) => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className={`container mx-auto px-4`}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            plan={plan}
            isYearly={isYearly}
            checkout={checkout}
          />
        ))}
      </div>
      <div className="text-center mt-8 text-sm text-muted-foreground">
        Powered by stripe
      </div>
    </div>
  );
};

const PricingCard: React.FC<{
  plan: PricingPlan;
  isYearly: boolean;
  checkout: boolean;
}> = ({ plan, isYearly, checkout }) => (
  <Card
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
      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
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
          <li key={featureIndex} className="flex text-accent items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <ButtonCheckout
        checkout={checkout}
        popular={plan.popular}
        isYearly={isYearly}
        priceId={isYearly ? plan.yearlyPriceId : plan.priceId}
      />
    </CardFooter>
  </Card>
);

interface ButtonCheckoutProps {
  checkout: boolean;
  popular: boolean | undefined;
  priceId: string;
  isYearly: boolean;
  mode?: "payment" | "subscription";
}

const ButtonCheckout: React.FC<ButtonCheckoutProps> = ({
  isYearly,
  checkout = false,
  popular = false,
  priceId,
  mode = "subscription",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handlePayment = async () => {
    if (checkout) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            mode,
            isYearly,
            successUrl: window.location.href,
            cancelUrl: window.location.href,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
        } else {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Error creating checkout:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "You must be logged in to upgrade",
      });
      router.push(
        `/signin?callbackurl=${encodeURIComponent("/studio#upgrade")}`
      );
    }
  };

  return (
    <div className="w-full">
      <Button
        className="w-full"
        variant={popular ? "default" : "outline"}
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Upgrade"
        )}
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const PricingDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkUrlForUpgrade = () => {
      if (typeof window !== "undefined") {
        const url = window.location.href;
        if (url.endsWith("#upgrade")) {
          setIsOpen(true);
          window.history.replaceState(null, "", url.slice(0, -8));
        }
      }
    };

    checkUrlForUpgrade();
    window.addEventListener("hashchange", checkUrlForUpgrade);

    return () => {
      window.removeEventListener("hashchange", checkUrlForUpgrade);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[75vw] w-full max-h-[90vh]">
        <ScrollArea className="max-h-[80vh]">
          <DialogTitle className="hidden">Pricing Options</DialogTitle>
          <DialogDescription className="hidden">
            Choose the plan that best fits your needs.
          </DialogDescription>
          <PricingTable
            checkout={true}
            plans={configs.pricing}
            isDialog={true}
          />
          <FAQ />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const Pricing: React.FC<{ session: any }> = ({ session }) => {
  const checkout = session;
  return (
    <section id="pricing" className="py-16 bg-background text-foreground">
      <PricingTable checkout={checkout} plans={configs.pricing} />
    </section>
  );
};
export default Pricing;
export { PricingDialog };
