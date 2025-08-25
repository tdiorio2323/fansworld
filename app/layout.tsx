import './globals.css';
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
      <body className="min-h-dvh text-white antialiased">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
