import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and edit your user profile on Cabana',
};

export default function UserProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>
      <div className="glass p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" alt="User avatar" className="h-16 w-16 rounded-full object-cover" />
          <div>
            <h2 className="text-xl font-semibold">Your Name</h2>
            <p className="text-sm text-[var(--ocean-mist)]">@username</p>
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" value="you@example.com" className="w-full glass px-3 py-2" readOnly />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm mb-1">Bio</label>
          <textarea id="bio" rows={3} placeholder="Tell creators about yourself" className="w-full glass px-3 py-2"></textarea>
        </div>
        <button className="btn btn-primary">Save Profile</button>
      </div>
    </div>
  );
}