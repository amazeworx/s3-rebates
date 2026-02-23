import type { Metadata } from 'next';
//import { Geist, Geist_Mono } from "next/font/google";
import { Outfit, Space_Mono } from 'next/font/google';
import './globals.css';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const fontSans = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'S3 Rebate Calculator - Dark War Survival',
  description: 'Calculate your Season 3 Building Rebates and plan your medal exchange efficiently. Maximize your rewards with our easy-to-use calculator.',
  openGraph: {
    title: 'S3 Rebate Calculator - Maximize Your Rewards',
    description: 'Plan your building upgrades and optimize your medal spending for Season 3.',
    type: 'website',
  },
  icons: {
    icon: '/radiation.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
