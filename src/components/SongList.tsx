'use client';

import { useState, useEffect } from 'react';
import { IoAdd, IoTrash, IoPencil, IoReorderThree } from 'react-icons/io5';
import { useSongStore } from '@/store/songStore';
import { AddSongModal } from './AddSongModal';
import { EditSongModal } from './EditSongModal';
import { SongSkeleton } from './SongSkeleton';
import type { Song } from '@/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSongItem } from './SortableSongItem';

export function SongList() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const { songs, setSelectedSong, deleteSong, reorderSongs, loadSongs } = useSongStore();

  useEffect(() => {
    const fetchSongs = async () => {
      await loadSongs();
      setIsLoading(false);
    };
    fetchSongs();
  }, [loadSongs]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = songs.findIndex((song) => song.id === active.id);
      const newIndex = songs.findIndex((song) => song.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderSongs(oldIndex, newIndex);
      }
    }
  };

  return (
    <div className="w-80 h-full border-r border-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Songs</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <IoAdd className="text-white text-2xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <SongSkeleton key={index} />
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={songs}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {songs.map((song) => (
                  <SortableSongItem
                    key={song.id}
                    song={song}
                    onEdit={() => setEditingSong(song)}
                    onDelete={() => deleteSong(song.id)}
                    onSelect={() => setSelectedSong(song)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editingSong && (
        <EditSongModal
          isOpen={!!editingSong}
          onClose={() => setEditingSong(null)}
          song={editingSong}
        />
      )}
    </div>
  );
} 
