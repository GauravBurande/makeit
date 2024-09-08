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
import configs from "@/config";
import { Loader2 } from "lucide-react";
import { post } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Props {
  session: any;
}

const Pricing = ({ session }: Props) => {
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
          {configs.pricing.map((plan, index) => (
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
                <ButtonCheckout popular={plan.popular} priceId={plan.priceId} />
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

interface ButtonCheckoutProps {
  popular: boolean | undefined;
  priceId: string;
  mode?: "payment" | "subscription";
}

export const ButtonCheckout: React.FC<ButtonCheckoutProps> = ({
  popular = false,
  priceId,
  mode = "payment",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await post("/stripe/create-checkout", {
        priceId,
        mode,
        successUrl: configs.stripe.successUrl,
        cancelUrl: window.location.href,
      });

      if (res.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      } else {
        window.location.href = res.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
    </>
  );
};

export default Pricing;
