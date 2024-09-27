import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUser, HardDrive, ImageIcon, Mail } from "lucide-react";
import UsageCard from "@/components/studio/blocks/usage";
import { DangerZone } from "@/components/blocks/dangerZone";
import { getBilling, getUser } from "@/lib/db";
import { PlainUser } from "@/helpers/types";
import { BillingSection } from "@/components/blocks/billing";

export const dynamic = "force-dynamic";

interface UserProps {
  user: PlainUser;
}

export default async function Settings() {
  const user = await getUser();
  let billing: any = await getBilling();
  if (!billing) {
    billing = {
      plan: "Free",
      status: "unpaid",
      currentPeriodStart: undefined,
      currentPeriodEnd: undefined,
      cancelAtPeriodEnd: new Date(),
      endedAt: undefined,
    };
  }
  if (!user) {
    return null;
  }
  return (
    <main className="min-h-screen space-y-12 p-10 w-full max-w-3xl mx-auto">
      <AccountOverview user={user} />
      <BillingSection billing={billing} user={user} />
      <DangerZone user={user} />
    </main>
  );
}

const AccountOverview = async ({ user }: UserProps) => {
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
            icon={<ImageIcon className="h-5 w-5 text-muted-foreground" />}
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
