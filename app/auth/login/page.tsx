import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Cabana account',
};

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Sign in</h1>
      <form className="space-y-4 glass p-6">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" placeholder="you@example.com" className="w-full glass px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input id="password" type="password" placeholder="Your password" className="w-full glass px-3 py-2" />
        </div>
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>
      <div className="text-center text-sm text-[var(--ocean-mist)]">
        <Link href="/auth/forgot-password" className="hover:text-[var(--sunset-gold)]">Forgot password?</Link>
      </div>
      <div className="text-center text-sm">
        Don’t have an account?{' '}
        <Link href="/auth/register" className="text-[var(--sunset-gold)] hover:underline">Sign up</Link>
      </div>
    </div>
  );
}