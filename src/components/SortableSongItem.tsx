'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { IoPencil, IoReorderThree, IoTrash } from 'react-icons/io5';

import type { Song } from '@/types';

interface SortableSongItemProps {
  song: Song;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
}

export function SortableSongItem({ song, onEdit, onDelete, onSelect }: SortableSongItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 rounded-lg cursor-pointer flex items-center justify-between bg-gray-900 hover:bg-gray-800 transition-colors w-full"
    >
      <div className="flex items-center flex-1 gap-2 min-w-0" onClick={onSelect}>
        <button className="touch-none p-1 hover:bg-white/10 rounded flex-shrink-0" {...attributes} {...listeners}>
          <IoReorderThree className="text-gray-400 text-xl" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium truncate">{song.title}</h3>
          {song.key && <p className="text-gray-400 text-sm truncate">Key: {song.key}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-white hover:text-blue-400 p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <IoPencil className="text-xl" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-400 p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <IoTrash className="text-xl" />
        </button>
      </div>
    </div>
  );
}
