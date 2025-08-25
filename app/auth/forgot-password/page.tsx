import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Request a password reset email for your Cabana account',
};

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-sm mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Reset your password</h1>
      <form className="space-y-4 glass p-6">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" placeholder="you@example.com" className="w-full glass px-3 py-2" />
        </div>
        <button type="submit" className="btn btn-primary w-full">Send reset link</button>
      </form>
      <div className="text-center text-sm">
        Back to{' '}
        <Link href="/auth/login" className="text-[var(--sunset-gold)] hover:underline">login</Link>
      </div>
    </div>
  );
}