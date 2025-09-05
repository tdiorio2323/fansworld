
import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata: Metadata = {
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
      url: 'https://www.cabanagrp.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'TD Studios - Premium Creator Platform'
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
    images: ['https://www.cabanagrp.com/og-image.png']
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#9333ea',
  appleWebApp: {
    capable: true,
    title: 'Cabana',
    statusBarStyle: 'black-translucent'
  },
  applicationName: 'Cabana'
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={urbanist.className}>{children}</body>
    </html>
  );
}
