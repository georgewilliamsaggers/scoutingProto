import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PrototypeWorkspace } from "@/components/PrototypeWorkspace";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "fX AgOS AI — Field Scouting",
  description:
    "The AI-powered agricultural operating system. Scout fields and capture insights from the ground.",
  applicationName: "AgOS Scout",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgOS Scout",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a3340",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-dvh`}>
        <PrototypeWorkspace>{children}</PrototypeWorkspace>
      </body>
    </html>
  );
}
