import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import { AvatarProvider } from "./avatar-context";
import { AuthProvider } from "./auth-context";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "چت بات",
  description: "چت بات هوش مصنوعی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-vazirmatn bg-gray-950 min-h-screen flex flex-col">
        <AvatarProvider>
          <AuthProvider>{children}</AuthProvider>
        </AvatarProvider>
      </body>
    </html>
  );
}
