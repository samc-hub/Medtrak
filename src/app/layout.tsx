import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedTrack — medication & dose tracker",
  description:
    "A simple, private way to track your medications and log every dose. Built with Next.js, TypeScript, and Drizzle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
