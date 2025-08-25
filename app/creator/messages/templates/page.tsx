import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reply Templates',
  description: 'Predefined responses to streamline your messaging',
};

interface Template {
  id: number;
  title: string;
  content: string;
}

const templates: Template[] = [
  { id: 1, title: 'Thank you note', content: 'Thank you so much for your support! I appreciate you 💖' },
  { id: 2, title: 'Collaboration Inquiry', content: 'I’m interested in learning more about your proposal. Let’s connect!' },
  { id: 3, title: 'Live Stream Reminder', content: 'Don’t forget – I’m going live tomorrow at 7pm. See you there!' },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Reply Templates</h1>
      <p className="text-[var(--ocean-mist)]">Save time by reusing these common replies.</p>
      <div className="space-y-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="glass p-4 space-y-2">
            <h3 className="font-semibold">{tpl.title}</h3>
            <p className="text-sm text-[var(--ocean-mist)]">{tpl.content}</p>
            <button className="btn btn-secondary text-xs">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}