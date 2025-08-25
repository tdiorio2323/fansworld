import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Feed',
  description: 'Discover exclusive content from your favourite creators',
};

interface Post {
  id: number;
  creator: string;
  avatar: string;
  image: string;
  title: string;
  description: string;
}

const samplePosts: Post[] = [
  {
    id: 1,
    creator: 'Sophia Luxe',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=80&q=80',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    title: 'Behind the Scenes of My Photoshoot',
    description: 'Join me for an exclusive look at my latest beach shoot! 🌊📸',
  },
  {
    id: 2,
    creator: 'Leo Royale',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    title: 'Live Q&A Tomorrow',
    description: 'I’ll be answering your burning questions live at 7pm! Ask me anything 💬',
  },
  {
    id: 3,
    creator: 'Maya Pearl',
    avatar: 'https://images.unsplash.com/photo-1519682577863-94dfc0c873ae?auto=format&fit=crop&w=80&q=80',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    title: 'Morning Yoga Routine',
    description: 'Flow with me through my favourite sunrise yoga poses. 🌅🧘‍♀️',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Discover Creators</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">A curated feed of premium content from our exclusive community.</p>
      </div>
      <div className="space-y-6">
        {samplePosts.map((post) => (
          <article key={post.id} className="glass overflow-hidden">
            <div className="flex items-center p-4 space-x-4">
              <img src={post.avatar} alt={post.creator} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">{post.creator}</h3>
                <p className="text-xs text-[var(--ocean-mist)]">Premium Creator</p>
              </div>
            </div>
            <img src={post.image} alt={post.title} className="w-full h-60 object-cover" />
            <div className="p-4 space-y-2">
              <h4 className="text-lg font-semibold">{post.title}</h4>
              <p className="text-sm text-[var(--ocean-mist)]">{post.description}</p>
              <div className="flex items-center justify-between pt-2">
                <button className="btn btn-secondary text-sm">Subscribe</button>
                <button className="btn btn-primary text-sm">Message</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}