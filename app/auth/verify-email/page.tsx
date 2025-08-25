import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Confirm your email address for Cabana',
};

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">Verify your email</h1>
      <p className="text-[var(--ocean-mist)]">
        We’ve sent a verification link to your email. Please click the link to
        verify your account. If you didn’t receive an email, check your spam folder
        or click the button below to resend.
      </p>
      <button className="btn btn-primary">Resend verification</button>
    </div>
  );
}