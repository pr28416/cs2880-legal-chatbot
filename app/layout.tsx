import type { Metadata } from "next";
import {
  Poppins,
  Kanit,
  Lora,
  Figtree,
  Urbanist,
  Inter_Tight,
  Raleway,
  Inter,
  Playfair_Display,
  Anek_Devanagari,
  Merriweather,
  Roboto_Slab,
  PT_Sans,
  Work_Sans,
  Fira_Sans,
  Fira_Code,
  Manrope,
  Mulish,
  DM_Sans,
  IBM_Plex_Mono,
  Inconsolata,
  Source_Code_Pro,
  Noto_Sans_Mono,
  JetBrains_Mono,
  Reddit_Mono,
  Martian_Mono,
  Red_Hat_Mono,
  Roboto_Mono,
  M_PLUS_Code_Latin,
  Sono,
  Fira_Mono,
  Fira_Sans_Condensed,
  Merriweather_Sans,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const fontFamily = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal AI Assistant",
  description: "Legal AI Assistant for CS 2880",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark ${fontFamily.className} antialiased `}>
        {children}
      </body>
    </html>
  );
}
