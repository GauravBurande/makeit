import Link from "next/link";
import { UserAuthForm } from "@/components/userAuthForm";
import { Button } from "@/components/ui/button";
import configs from "@/config";
import Image from "next/image";
import logo from "@/app/icon.png";

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link href="/" className="absolute right-4 top-4 md:right-8 md:top-8">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 -translate-x-1 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                clipRule="evenodd"
              />
            </svg>{" "}
            Back
          </Button>
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-foreground dark:border-r lg:flex">
          <div className="absolute z-10 inset-0 bg-[url(/designs/1.png)] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-background/20" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="flex lg:flex-1">
              <Link
                className="flex items-center gap-2 shrink-0"
                href="/"
                title={`${configs.appName} hompage`}
              >
                <Image
                  src={logo}
                  alt={`${configs.appName} logo`}
                  className="w-14 rounded-xl"
                  priority={true}
                  width={512}
                  height={512}
                />
                <span className="font-bold text-2xl">{configs.appName}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign In to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue or start with designing
                interior.
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
