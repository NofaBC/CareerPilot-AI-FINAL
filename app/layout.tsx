import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerPilot AI™ – Autonomous Job Hunt Agent",
  description: "Autonomous Job Hunt Agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-slate-900 antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
