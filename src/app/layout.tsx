import type { Metadata } from "next";
import Header from "@/components/Header";

import "@xyflow/react/dist/style.css";
import "@/theme/globals.css";
import Providers from "@/providers";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";

const inter = localFont({
  src: "./inter-variable.ttf",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Euler Vault Explorer",
  description: "Explore the relationship between credit vaults in the Euler protocol.",
  metadataBase: new URL("https://euler-vault-explorer.vercel.app/"),
  keywords: [
    "Decentralized Finance",
    "Lending",
    "Borrowing",
    "ERC-20",
    "Euler",
    "Vaults",
    "Credit",
    "DeFi",
    "Ethereum",
    "Blockchain",
    "Decentralized Exchange",
    "Lend crypto",
    "Borrow crypto",
    "Web3",
    "Crypto",
    "Paperclip Labs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`} data-vaul-drawer-wrapper="">
        <Providers>
          <Header />
          <div className="flex min-h-dvh flex-col justify-between">
            <main className="w-full max-w-[2560px] flex-grow self-center px-4 pb-6 pt-[86px] md:px-6">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
