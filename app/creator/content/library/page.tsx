import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Library',
  description: 'Manage and organise your published posts',
};

interface LibraryItem {
  id: number;
  title: string;
  thumbnail: string;
  date: string;
  views: number;
}

const items: LibraryItem[] = [
  {
    id: 1,
    title: 'Summer Vibes Photoshoot',
    thumbnail: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=500&q=80',
    date: '2025-08-10',
    views: 1200,
  },
  {
    id: 2,
    title: 'Exclusive Workout Routine',
    thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80',
    date: '2025-07-28',
    views: 890,
  },
  {
    id: 3,
    title: 'Behind‑the‑Scenes Vlog',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80',
    date: '2025-07-15',
    views: 1450,
  },
];

export default function ContentLibraryPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Content Library</h1>
      <p className="text-[var(--ocean-mist)]">Organise, edit and delete your posts.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="glass overflow-hidden">
            <img src={item.thumbnail} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-xs text-[var(--ocean-mist)]">{item.date}</p>
              <p className="text-xs text-[var(--ocean-mist)]">{item.views} views</p>
              <div className="flex space-x-2 pt-2">
                <button className="btn btn-secondary flex-1 text-xs">Edit</button>
                <button className="btn btn-secondary flex-1 text-xs">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}