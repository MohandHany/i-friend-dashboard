import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iFriend Dashboard",
  description: "iFriend Admin Dashboard",
};

export default function RootLayout({
  children, sidebar, navbar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F9FAFB]`}
      >
        <div>
          {sidebar}
          {navbar}
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
