import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Inbox',
  description: 'AI powered messaging centre for creators',
};

interface Message {
  id: number;
  sender: string;
  preview: string;
  priority: boolean;
}

const messages: Message[] = [
  { id: 1, sender: 'Fan001', preview: 'Loved your latest post! When is the next one?', priority: false },
  { id: 2, sender: 'BrandCollab', preview: 'We would love to sponsor your next livestream. Let’s chat!', priority: true },
  { id: 3, sender: 'Fan002', preview: 'Can you share your workout routine?', priority: false },
];

export default function SmartInboxPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Smart Inbox</h1>
      <p className="text-[var(--ocean-mist)]">Your messages are organised by our AI to surface high‑value interactions.</p>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`glass p-4 flex justify-between items-start ${msg.priority ? 'border-l-4 border-[var(--sunset-gold)]' : ''}`}>
            <div>
              <h3 className="font-semibold">{msg.sender}</h3>
              <p className="text-sm text-[var(--ocean-mist)] truncate">{msg.preview}</p>
            </div>
            <button className="btn btn-secondary text-xs">Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}