"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import SignOut from "../signOut";
import { PlainUser } from "@/helpers/types";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";

interface DangerZoneProps {
  user: PlainUser;
}
export const DangerZone = ({ user }: DangerZoneProps) => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { toast } = useToast();
  const handleDeleteAccount = async () => {
    if (email === user.email) {
      const response = await fetch(`/api/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.status === 200) {
        signOut({ callbackUrl: "/" });
        console.log("Account deleted successfully!");
      } else {
        console.error("Failed to delete account.");
        toast({
          title: "Failed to delete account.",
          description: data.error,
          variant: "destructive",
        });
      }
    }
    console.log("Account deletion initiated for email:", email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail));
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Actions in this area can have irreversible consequences. Please
          proceed with caution. You cannot click buttons accidentally here!
        </p>
        <SignOut fullWidth />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers. Please enter
                your email address to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="mt-2"
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={!isEmailValid}
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
