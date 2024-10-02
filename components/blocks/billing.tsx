"use client";

import { useState } from "react";
import { formatDate } from "@/helpers/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlainUser } from "@/helpers/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Loader,
} from "lucide-react";

interface BillingProps {
  user: PlainUser;
  billing: {
    plan: string;
    status: string;
    currentPeriodStart: Date | undefined;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    endedAt: Date | undefined;
  };
}

export const BillingSection = ({ user, billing }: BillingProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBilling = async () => {
    setIsLoading(true);
    try {
      if (user.hasAccess) {
        const response = await fetch("/api/stripe/create-portal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            returnUrl: window.location.origin,
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        router.push("/studio#upgrade");
      }
    } catch (error) {
      console.error("Error handling billing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "canceled":
      case "past_due":
      case "unpaid":
        return "bg-red-500";
      case "incomplete":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card id="billing">
      <CardHeader className="flex justify-between items-start">
        <CardTitle className="flex text-accent mb-2 items-center space-x-2">
          <CreditCard className="h-6 w-6" />
          <span>Billing</span>
        </CardTitle>
        <Badge
          variant="secondary"
          className="bg-primary text-primary-foreground"
        >
          {billing?.plan} Plan
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-md font-semibold text-foreground">
            Subscription Status
          </span>
          <Badge
            className={`${getStatusColor(
              billing?.status || "unpaid"
            )} text-primary-foreground capitalize`}
          >
            {billing?.status}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="text-primary" />
            <span className="font-medium">Current Billing Period:</span>
            {billing?.currentPeriodStart ? (
              <span>
                {formatDate(billing?.currentPeriodStart)} -{" "}
                {formatDate(billing?.currentPeriodEnd)}
              </span>
            ) : (
              <span>User hasn&apos;t purchased any plan yet!</span>
            )}
          </div>

          {billing?.endedAt && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="text-primary" />
              <span className="font-medium">Subscription Ended:</span>
              <span>{formatDate(billing.endedAt)}</span>
            </div>
          )}
        </div>

        {billing?.currentPeriodStart && (
          <div>
            {billing?.cancelAtPeriodEnd ? (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md flex items-center space-x-2">
                <AlertTriangle className="text-yellow-800" />
                <span>
                  Your subscription will be canceled at the end of the current
                  billing period.
                </span>
              </div>
            ) : billing?.endedAt ? (
              <div className="bg-red-100 text-red-800 p-4 rounded-md flex items-center space-x-2">
                <AlertTriangle className="text-red-800" />
                <span>
                  Your subscription has ended. Renew to continue using premium
                  features.
                </span>
              </div>
            ) : (
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-md flex items-center space-x-2">
                <CheckCircle className="text-emerald-800" />
                <span>
                  Your subscription will automatically renew at the end of the
                  billing period.
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleBilling} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : billing?.endedAt ? (
            "Renew Subscription"
          ) : billing?.cancelAtPeriodEnd ? (
            "Resume Subscription"
          ) : (
            "Manage Subscription"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
