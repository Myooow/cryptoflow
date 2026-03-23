import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/shared/Header/Header";
import "@/app/globals.scss";
import styles from "./layout.module.scss";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "CryptoFlow", template: "%s | CryptoFlow" },
  description: "Real-time crypto terminal — prices, charts and live trades.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Suspense fallback={null}><Header /></Suspense>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
