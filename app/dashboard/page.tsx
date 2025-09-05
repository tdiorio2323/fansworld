
import { CreatorDashboard } from '@/components/dashboard/CreatorDashboard';
import { mockCreator } from '@/lib/mock-data';

export default function Dashboard() {
  // Mock functions for interactivity
  const handleUpload = (file: File) => {
    alert(`Uploading ${file.name}! (This is a simulation)`);
  };

  const handleDelete = (id: string) => {
    alert(`Deleting content ${id}! (This is a simulation)`);
  };

  const mockUser = {
    revenue: 1250,
    subs: 120,
    nextPayout: 'Oct 15, 2025',
    price: mockCreator.subscriptionPrice,
  };

  return (
    <main className="p-4 md:p-8">
      <CreatorDashboard
        user={mockUser}
        uploads={mockCreator.content}
        onUpload={handleUpload}
        onDelete={handleDelete}
      />
    </main>
  );
}
