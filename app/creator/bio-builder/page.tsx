import type { Metadata } from 'next';
import FileUpload from '@/components/ui/file-upload';

export const metadata: Metadata = {
  title: 'Bio Builder',
  description: 'Craft your personalised link in bio page',
};

export default function BioBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Bio Builder</h1>
      <p className="text-[var(--ocean-mist)]">Create a beautiful landing page to showcase your brand and drive traffic.</p>
      <div className="glass p-6 space-y-6">
        <div>
          <label htmlFor="headline" className="block text-sm mb-1">Headline</label>
          <input id="headline" type="text" placeholder="e.g. Welcome to my world" className="w-full glass px-3 py-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm mb-1">Description</label>
          <textarea id="description" rows={3} placeholder="Short description about you" className="w-full glass px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block text-sm mb-1">Profile Image</label>
          <FileUpload />
        </div>
        <div>
          <label className="block text-sm mb-1">Links</label>
          <div className="space-y-3">
            <input type="text" placeholder="Link Title" className="w-full glass px-3 py-2" />
            <input type="url" placeholder="https://" className="w-full glass px-3 py-2" />
            <button className="btn btn-secondary text-sm">Add another link</button>
          </div>
        </div>
        <button className="btn btn-primary">Generate Bio</button>
      </div>
    </div>
  );
}