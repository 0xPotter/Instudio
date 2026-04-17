import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "In Studio — Inteligencia Natural",
  description:
    "IN Studio — soluciones visuales, sonoras y digitales con inteligencia artificial como aliada.",
  metadataBase: new URL("https://instudiogt.com"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${manrope.variable}`}>
      <body className="bg-surface text-on-surface font-body antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
