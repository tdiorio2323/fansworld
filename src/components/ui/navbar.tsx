"use client";

import Link from 'next/link';
import { useState } from 'react';

/**
 * Navigation bar for Cabana pages.  It uses a glassmorphism effect and
 * horizontally scrollable navigation items to ensure it works nicely on
 * mobile devices.  The active link styling can be extended by using
 * Next.js `usePathname` hook inside this component if desired.  By
 * default the nav displays a simple brand and a handful of top‑level
 * links.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-auto flex h-16 items-center justify-between px-6 md:px-10 glass backdrop-blur-md">
      <Link href="/" className="flex items-center space-x-2 text-lg font-semibold">
        <span className="text-2xl font-extrabold text-[var(--sunset-gold)]">C</span>
        <span className="hidden sm:inline-block font-bold">Cabana</span>
      </Link>
      <div className="hidden md:flex items-center space-x-6 text-sm">
        <Link href="/pricing" className="hover:text-[var(--sunset-gold)] transition-colors">Pricing</Link>
        <Link href="/creator/dashboard" className="hover:text-[var(--sunset-gold)] transition-colors">Creator</Link>
        <Link href="/user/home" className="hover:text-[var(--sunset-gold)] transition-colors">Discover</Link>
        <Link href="/about" className="hover:text-[var(--sunset-gold)] transition-colors">About</Link>
      </div>
      <div className="hidden md:flex space-x-3">
        <Link href="/auth/login" className="btn btn-secondary text-sm">Login</Link>
        <Link href="/auth/register" className="btn btn-primary text-sm">Sign up</Link>
      </div>
      {/* Mobile menu toggle */}
      <button
        className="md:hidden p-2 rounded-md focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Toggle navigation</span>
        {/* Hamburger icon */}
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 flex flex-col space-y-2 bg-[var(--deep-ocean)] border-b border-[rgba(255,255,255,0.1)] p-4 md:hidden">
          <Link href="/pricing" className="py-2" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/creator/dashboard" className="py-2" onClick={() => setOpen(false)}>Creator</Link>
          <Link href="/user/home" className="py-2" onClick={() => setOpen(false)}>Discover</Link>
          <Link href="/about" className="py-2" onClick={() => setOpen(false)}>About</Link>
          <div className="flex space-x-2 pt-2">
            <Link href="/auth/login" className="btn btn-secondary flex-1 text-center" onClick={() => setOpen(false)}>Login</Link>
            <Link href="/auth/register" className="btn btn-primary flex-1 text-center" onClick={() => setOpen(false)}>Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}