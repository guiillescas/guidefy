import { SequenceEditor } from '@/components/SequenceEditor';
import { SongList } from '@/components/SongList';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="fixed inset-0 bg-gray-900">
      <main className="flex h-full w-full bg-gray-900">
        <Suspense fallback={<div>Loading...</div>}>
          <SongList />
          <SequenceEditor />
        </Suspense>
      </main>
    </div>
  );
} 
