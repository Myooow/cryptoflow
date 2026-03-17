import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/shared/Header";
import { CommandSearch } from "@/components/shared/CommandSearch";
import "./globals.scss";
import styles from "./layout.module.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CryptoFlow",
    template: "%s | CryptoFlow",
  },
  description: "Terminal d'analyse crypto en temps réel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={styles.body}>
        <Header />
        <CommandSearch />
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
