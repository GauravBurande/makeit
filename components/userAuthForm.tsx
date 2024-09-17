"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import configs from "@/config";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IconGoogle, IconSpinner } from "./icons";
import { Key } from "lucide-react";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [lastUsedMethod, setLastUsedMethod] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const callbackUrl = decodeURIComponent(
    searchParams.get("callbackurl") || configs.auth.callbackUrl
  );

  useEffect(() => {
    const storedMethod = localStorage.getItem("lastUsedSignInMethod");
    if (storedMethod) {
      setLastUsedMethod(storedMethod);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    localStorage.setItem("lastUsedSignInMethod", "google");
    await signIn("google", { callbackUrl });
    setIsLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.setItem("lastUsedSignInMethod", "email");
    await signIn("email", { callbackUrl, email });
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const LastUsedTag = () => (
    <div className="absolute bg-black/20 p-1 rounded-md -left-1 top-1/2 -translate-x-full -translate-y-1/2 pr-2 flex items-center">
      <Key className="h-4 w-4 mr-1" />
      <span className="text-xs">Last used</span>
    </div>
  );

  return (
    <section className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleEmailSignIn}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              onChange={handleChange}
              value={email}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            {lastUsedMethod === "email" && <LastUsedTag />}
            <Button disabled={isLoading} className="w-full">
              {isLoading && (
                <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </Button>
          </div>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>
      <div className="relative">
        {lastUsedMethod === "google" && <LastUsedTag />}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <IconGoogle className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </div>
    </section>
  );
}
