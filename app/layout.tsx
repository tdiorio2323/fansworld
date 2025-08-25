import './globals.css';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { ReactNode } from 'react';

export const metadata = {
  title: {
    default: 'Cabana – Where Creators Become Royalty',
    template: '%s | Cabana'
  },
  description: 'A luxury creator monetisation platform empowering digital royalty.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {children}
      </body>
    </html>
  );
}