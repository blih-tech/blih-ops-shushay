import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Blih Talent — Evidence-Backed Professional Growth",
  description:
    "Connect verified, remote-ready talents with European and global companies through evidence-backed capability profiles.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} bg-background text-foreground font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
