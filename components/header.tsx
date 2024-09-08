import configs from "@/config";
import logo from "@/app/icon.png";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  session: any;
}

const Header = ({ session }: Props) => {
  const navLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact Us", href: `mailto:support@${configs.domain}` },
  ];

  return (
    <nav className="w-full max-w-6xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-8">
        <div className="text-2xl flex items-center gap-2 font-bold capitalize">
          <Image
            className="rounded-xl"
            src={logo}
            alt={configs.appName}
            width={44}
            height={44}
          />
          {configs.appName}
        </div>
        <ul className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn("text-sm", buttonVariants({ variant: "link" }))}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link href={session ? "/studio" : "/signin"}>
        <Button className="text-lg capitalize">
          {session ? "MakeIt studio" : "Get Started"}
        </Button>
      </Link>
    </nav>
  );
};

export default Header;
