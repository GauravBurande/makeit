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

const settings = {
  email: "burandegaurav8899@gmail.com",
  usedImages: 0,
  imageLimit: 1000,
  usedStorage: 0,
  storageLimit: 5 * 1024 * 1024, // 5 GB in KB
  plan: "Pro",
  status: "active",
  currentPeriodStart: new Date("2024-09-01"),
  currentPeriodEnd: new Date("2024-10-01"),
  cancelAtPeriodEnd: false,
};

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

export const AccountOverview = () => {
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
          <span className="text-sm font-medium">{settings.email}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsageCard
            icon={<Image className="h-5 w-5 text-muted-foreground" />}
            title="Image Usage"
            used={settings.usedImages}
            limit={settings.imageLimit}
            unit="images"
          />
          <UsageCard
            icon={<HardDrive className="h-5 w-5 text-muted-foreground" />}
            title="Storage Usage"
            used={settings.usedStorage}
            limit={settings.storageLimit}
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

export const BillingSection = () => {
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
          {settings.plan || "Free"} Plan
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-md font-semibold text-foreground">
            Subscription Status
          </span>
          <Badge
            className={`${getStatusColor(
              settings.status || "unpaid"
            )} text-primary-foreground capitalize`}
          >
            {settings.status || "unpaid"}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="text-primary" />
            <span className="font-medium">Current Billing Period:</span>
            {settings.currentPeriodStart ? (
              <span>
                {formatDate(settings.currentPeriodStart)} -{" "}
                {formatDate(settings.currentPeriodEnd)}
              </span>
            ) : (
              <span>User hasn't purchasesd any plan yet!</span>
            )}
          </div>
        </div>

        {settings.currentPeriodStart && (
          <div>
            {settings.cancelAtPeriodEnd ? (
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
          {settings.cancelAtPeriodEnd
            ? "Resume Subscription"
            : "Manage Subscription"}
        </Button>
      </CardFooter>
    </Card>
  );
};
