import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Priority Messages',
  description: 'High‑value messages requiring your attention',
};

interface Message {
  id: number;
  sender: string;
  preview: string;
}

const messages: Message[] = [
  { id: 1, sender: 'BrandCollab', preview: 'Sponsorship opportunity – 5x your usual rate!' },
  { id: 2, sender: 'VIPFan', preview: 'I’d like to book a private video call this weekend.' },
  { id: 3, sender: 'Media', preview: 'Interview request for our creator economy podcast.' },
];

export default function PriorityMessagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Priority Messages</h1>
      <p className="text-[var(--ocean-mist)]">These messages are highlighted by our AI as high value or urgent.</p>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="glass p-4 flex justify-between items-start border-l-4 border-[var(--sunset-gold)]">
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