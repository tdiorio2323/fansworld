import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: "Cabana",
  description: "Luxury creator platform"
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
