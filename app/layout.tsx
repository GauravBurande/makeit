import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { getSEOTags } from "@/lib/seo";
import configs from "@/config";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = getSEOTags({
  title: "MakeIt | Design your Interior" || configs.appName,
  description: configs.description,
  keywords: ["keyword"],
  extraTags: {
    metadataBase: new URL(`https://${configs.domain}/`),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
