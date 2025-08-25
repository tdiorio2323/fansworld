import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Frequently asked questions and support',
};

export default function HelpCenterPage() {
  const faqs = [
    {
      question: 'How do I become a creator?',
      answer: 'Sign up for a creator account via the onboarding process. You’ll be guided through identity verification and profile setup.',
    },
    {
      question: 'What fees does Cabana charge?',
      answer: 'Cabana takes 0% of your earnings until you surpass $10k in monthly revenue. After that, a flat 5% platform fee applies.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can send us a message from the contact page or email support@cabanagrp.com. We typically respond within 24 hours.',
    },
  ];
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl sm:text-4xl font-bold">Help Center</h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass p-6">
            <h3 className="text-xl font-semibold mb-2 text-[var(--sunset-gold)]">{faq.question}</h3>
            <p className="text-sm text-[var(--ocean-mist)]">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}