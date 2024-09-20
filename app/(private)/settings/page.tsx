import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CircleUser,
  CreditCard,
  HardDrive,
  Image,
  Mail,
} from "lucide-react";
import UsageCard from "@/components/studio/blocks/usage";
import { formatDate } from "@/helpers/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DangerZone } from "@/components/blocks/dangerZone";
import SignOut from "@/components/signOut";
import { getBilling, getUser } from "@/lib/db";

export default function Settings() {
  return (
    <main className="min-h-screen space-y-12 p-10 w-full max-w-3xl mx-auto">
      <AccountOverview />
      <BillingSection />
      <SignOut fullWidth />
      <DangerZone />
    </main>
  );
}

export const AccountOverview = async () => {
  const user = await getUser();
  if (!user) {
    return null;
  }
  return (
    <Card id="account" className="w-full">
      <CardHeader>
        <CardTitle className="flex text-accent items-center space-x-2">
          <CircleUser className="h-6 w-6" />
          <span>Account Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{user?.email}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsageCard
            icon={<Image className="h-5 w-5 text-muted-foreground" />}
            title="Image Usage"
            used={user?.usedImages || 0}
            limit={user?.imageLimit || 0}
            unit="images"
          />
          <UsageCard
            icon={<HardDrive className="h-5 w-5 text-muted-foreground" />}
            title="Storage Usage"
            used={user?.storageUsed || 0}
            limit={user?.storageLimit || 0}
            unit="KB"
          />
        </div>
      </CardContent>
    </Card>
  );
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

export const BillingSection = async () => {
  let billing: any = await getBilling();
  if (!billing) {
    billing = {
      plan: "Free",
      status: "unpaid",
      currentPeriodStart: undefined,
      currentPeriodEnd: undefined,
      cancelAtPeriodEnd: false,
    };
  }
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
              <span>User hasn't purchasesd any plan yet!</span>
            )}
          </div>
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
        <Button className="w-full">
          {billing?.cancelAtPeriodEnd
            ? "Resume Subscription"
            : "Manage Subscription"}
        </Button>
      </CardFooter>
    </Card>
  );
};
