import type { Metadata } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next";
import './globals.css';

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
  title: 'DWS Season 3 Building Rebates Calculator',
  description: 'Calculate your Season 3 Building Rebates and plan your medal exchange efficiently. Maximize your rewards with our easy-to-use calculator.',
  openGraph: {
    title: 'DWS Season 3 Building Rebates Calculator',
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
