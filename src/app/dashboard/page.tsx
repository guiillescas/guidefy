import { SequenceEditor } from '@/components/SequenceEditor';
import { SongList } from '@/components/SongList';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="fixed inset-0 bg-gray-900">
      <DashboardHeader />
      <main className="flex h-[calc(100%-4rem)] w-full bg-gray-900">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="hidden md:block">
            <SongList variant="sidebar" />
          </div>
          <SequenceEditor />
        </Suspense>
      </main>
    </div>
  );
} 
