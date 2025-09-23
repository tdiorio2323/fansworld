
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cabanagrp.com"),
  title: 'CABANA | The Ultimate Creator Empire',
  description: 'Premium creator platform for exclusive content & fan engagement. Advanced monetization tools that go beyond OnlyFans. Build your empire.',
  keywords: 'creator platform, premium content, fan engagement, subscription platform, adult content, creator economy, monetization, OnlyFans alternative',
  authors: [{ name: 'Cabana Group' }],
  creator: 'Cabana Group',
  publisher: 'Cabana Group',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.cabanagrp.com'
  },
  openGraph: {
    type: 'website',
    url: 'https://www.cabanagrp.com',
    title: 'CABANA | The Ultimate Creator Empire',
    description: 'Premium creator platform for exclusive content & fan engagement. Advanced monetization tools that go beyond OnlyFans. Build your empire.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'CABANA - Premium Creator Platform'
    }],
    siteName: 'Cabana',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cabanaplatform',
    creator: '@cabanaplatform',
    title: 'CABANA | The Ultimate Creator Empire',
    description: 'Premium creator platform for exclusive content & fan engagement. Build your empire.',
    images: ['/og-image.png']
  },
  appleWebApp: {
    capable: true,
    title: 'Cabana',
    statusBarStyle: 'black-translucent'
  },
  applicationName: 'Cabana'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#9333ea'
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
