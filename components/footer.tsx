import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/icon.png";
import configs from "@/config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact Us", href: `mailto:support@${configs.domain}` },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-accent/10 text-foreground/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-5 max-w-sm">
            <div className="text-2xl flex items-center gap-2 text-foreground font-bold capitalize">
              <Image
                className="rounded-xl"
                src={logo}
                alt={configs.appName}
                width={44}
                height={44}
              />
              {configs.appName}
            </div>
            <p className="text-sm">{configs.description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-12 gap-y-8">
            <div>
              <h3 className="text-lg px-4 font-semibold text-secondary mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm",
                        buttonVariants({ variant: "link" })
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg px-4 text-secondary font-semibold mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {legalLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm",
                        buttonVariants({ variant: "link" })
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-foreground/10 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} {configs.appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
