import type { Metadata } from 'next';
import FileUpload from '@/components/ui/file-upload';

export const metadata: Metadata = {
  title: 'Upload Content',
  description: 'Add new posts, photos or videos to your Cabana profile',
};

export default function UploadPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Upload New Content</h1>
        <p className="mt-2 text-[var(--ocean-mist)]">Drag and drop or select files to share with your subscribers.</p>
      </div>
      <FileUpload />
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Post Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input id="title" type="text" placeholder="Enter a title" className="w-full glass px-4 py-2" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" rows={4} placeholder="Describe your content" className="w-full glass px-4 py-2"></textarea>
          </div>
          <button className="btn btn-primary">Publish</button>
        </div>
      </div>
    </div>
  );
}