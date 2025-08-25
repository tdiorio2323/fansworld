import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Register for a Cabana creator or fan account',
};

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Create your account</h1>
      <form className="space-y-4 glass p-6">
        <div>
          <label htmlFor="name" className="block text-sm mb-1">Name</label>
          <input id="name" type="text" placeholder="Your full name" className="w-full glass px-3 py-2" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" placeholder="you@example.com" className="w-full glass px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input id="password" type="password" placeholder="Create a password" className="w-full glass px-3 py-2" />
        </div>
        <button type="submit" className="btn btn-primary w-full">Create account</button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[var(--sunset-gold)] hover:underline">Sign in</Link>
      </div>
    </div>
  );
}