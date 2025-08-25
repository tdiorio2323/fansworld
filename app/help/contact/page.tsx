import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Reach out to the Cabana support team',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Contact Us</h1>
      <p className="text-[var(--ocean-mist)]">Have a question or need help? Send us a message and our team will get back to you shortly.</p>
      <form className="glass p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-1">Name</label>
          <input id="name" type="text" placeholder="Your name" className="w-full glass px-3 py-2" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" placeholder="you@example.com" className="w-full glass px-3 py-2" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm mb-1">Message</label>
          <textarea id="message" rows={5} placeholder="How can we help you?" className="w-full glass px-3 py-2"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send Message</button>
      </form>
    </div>
  );
}