import type { Metadata } from "next";
import { Lora } from "next/font/google";
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
