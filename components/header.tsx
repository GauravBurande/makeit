import configs from "@/config";
import logo from "@/app/icon.png";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <nav className="w-full max-w-6xl mx-auto flex justify-between items-center mb-16">
      <div className="text-2xl flex items-center gap-2 font-extrabold capitalize">
        <Image
          className="rounded-xl"
          src={logo}
          alt={configs.appName}
          width={44}
          height={44}
        />
        {configs.appName}
      </div>
      <Link href={"/signin"}>
        <Button className="text-lg">get started</Button>
      </Link>
    </nav>
  );
};

export default Header;
