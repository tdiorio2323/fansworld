import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'CABANA - Premium Creator Platform | Exclusive Content & Community',
  description: 'Join CABANA, the luxury platform for premium creators and exclusive content. Experience the future of creator monetization with advanced analytics, seamless payments, and premium fan engagement.',
  openGraph: {
    title: 'CABANA - Premium Creator Platform',
    description: 'The luxury platform for premium creators and exclusive content. Join the future of creator monetization.',
    url: 'https://cabanagrp.com',
    siteName: 'CABANA',
    images: [
      {
        url: 'https://cabanagrp.com/cabana-crystal-bg.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CABANA - Premium Creator Platform',
    description: 'The luxury platform for premium creators and exclusive content.',
    images: ['https://cabanagrp.com/cabana-crystal-bg.jpg'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="grad-bg">
      <body className="min-h-dvh text-white antialiased">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
