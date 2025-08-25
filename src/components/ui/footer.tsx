"use client";

import Link from 'next/link';

/**
 * Simple footer component for Cabana pages.  It provides a dark
 * backdrop, subtle separators and a few useful links.  Extend as
 * necessary to include more navigation or social icons.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-[rgba(255,255,255,0.1)] bg-[var(--deep-ocean)] text-sm">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold text-[var(--sunset-gold)]">C</span>
          <span className="font-semibold">Cabana</span>
        </div>
        <p className="text-[var(--ocean-mist)]">© {year} Cabana Group. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link href="/legal/privacy" className="hover:text-[var(--sunset-gold)]">Privacy</Link>
          <Link href="/legal/terms" className="hover:text-[var(--sunset-gold)]">Terms</Link>
          <Link href="/help/contact" className="hover:text-[var(--sunset-gold)]">Support</Link>
        </div>
      </div>
    </footer>
  );
}