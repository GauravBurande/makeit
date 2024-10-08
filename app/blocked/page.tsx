import Link from "next/link";
import { AlertTriangle, Home, LockIcon, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - visual */}
          <div className="bg-primary p-8 flex flex-col justify-center items-center text-primary-foreground">
            <LockIcon className="h-24 w-24 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Access Blocked</h1>
            <p className="text-center">
              We've temporarily restricted access to your account.
            </p>
          </div>

          {/* Right side - info and actions */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                <p>
                  Your access has been temporarily suspended for security
                  reasons.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                <p>
                  Please try again in 1 minute or contact support if this
                  persists.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                <p>
                  If you need immediate assistance, please contact our support
                  team.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
