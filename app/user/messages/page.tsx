import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'View your conversations with creators',
};

interface Conversation {
  id: number;
  creator: string;
  avatar: string;
  lastMessage: string;
}

const conversations: Conversation[] = [
  { id: 1, creator: 'Sophia Luxe', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=80&q=80', lastMessage: 'Thanks for joining the livestream!' },
  { id: 2, creator: 'Leo Royale', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80', lastMessage: 'Your questions were amazing!' },
];

export default function UserMessagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Messages</h1>
      <div className="space-y-4">
        {conversations.map((conv) => (
          <div key={conv.id} className="glass p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={conv.avatar} alt={conv.creator} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">{conv.creator}</h3>
                <p className="text-xs text-[var(--ocean-mist)] truncate max-w-xs">{conv.lastMessage}</p>
              </div>
            </div>
            <button className="btn btn-secondary text-xs">Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}