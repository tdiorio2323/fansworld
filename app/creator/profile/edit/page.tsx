import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Update your Cabana creator profile and preferences',
};

export default function EditProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Edit Profile</h1>
      <form className="space-y-6">
        <div className="glass p-6 space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div>
            <label htmlFor="displayName" className="block text-sm mb-1">Display Name</label>
            <input id="displayName" type="text" placeholder="Your public name" className="w-full glass px-3 py-2" />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm mb-1">Bio</label>
            <textarea id="bio" rows={4} placeholder="Tell your fans about yourself" className="w-full glass px-3 py-2"></textarea>
          </div>
        </div>
        <div className="glass p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile Media</h2>
          <div>
            <label className="block text-sm mb-1">Avatar</label>
            <input type="file" className="w-full" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cover Photo</label>
            <input type="file" className="w-full" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save changes</button>
      </form>
    </div>
  );
}