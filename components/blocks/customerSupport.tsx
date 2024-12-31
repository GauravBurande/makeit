"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LifeBuoy,
  Mail,
  MessageSquare,
  CheckCircle2,
  //   HelpCircle,
  //   ExternalLink,
} from "lucide-react";

const CustomerSupport = () => {
  return (
    <div className="mt-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex text-accent items-center gap-2">
              <LifeBuoy className="h-6 w-6 text-muted-foreground" />
              <CardTitle>Customer Support</CardTitle>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              All Systems Normal
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto justify-start gap-3 p-4 hover:bg-card-foreground"
              onClick={() =>
                (window.location.href = "mailto:support@example.com")
              }
            >
              <div className="rounded-full bg-primary/10 p-2">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Email Support</span>
                <span className="text-sm text-muted-foreground">
                  Get help via email
                </span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start gap-3 p-4 hover:bg-card-foreground"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Live Chat</span>
                <span className="text-sm text-muted-foreground">
                  Start a conversation
                </span>
              </div>
            </Button>
          </div>

          <div className="mt-4 grid gap-2">
            {/* <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Visit Help Center</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div> */}

            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-sm text-primary/80">
                Need immediate assistance? Our live chat support is the fastest
                way to get help.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSupport;
