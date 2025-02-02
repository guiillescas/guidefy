'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoClose, IoPencil, IoReorderTwo } from 'react-icons/io5';
import type { SequenceItem } from '@/types';

interface SortableItemProps {
  item: SequenceItem;
  onEditNote: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function SortableItem({ item, onEditNote, onDeleteItem }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: item.id,
    data: {
      type: 'item',
      item: item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    touchAction: 'manipulation' as const,
    WebkitTouchCallout: 'none' as const,
    WebkitUserModify: 'read-write-plaintext-only' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitUserModify: 'read-only',
        pointerEvents: 'none'
      }}
      className={`mb-2 rounded-lg select-none ${
        item.type === 'base' ? 'bg-blue-900/50' : 'bg-purple-900/50'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div 
        className="flex items-center justify-between p-4"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center gap-3">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab p-3 -m-2 hover:bg-white/10 rounded-lg touch-manipulation"
            style={{ touchAction: 'none' }}
          >
            <IoReorderTwo className="text-gray-400 text-2xl" />
          </div>
          <span className="text-white font-medium text-lg select-none pointer-events-none"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitUserModify: 'read-only'
            }}
          >
            {item.occurrence ? `${item.element} ${item.occurrence}` : item.element}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditNote(item.id)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <IoPencil className="text-white text-xl" />
          </button>
          <button
            onClick={() => onDeleteItem(item.id)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <IoClose className="text-white text-xl" />
          </button>
        </div>
      </div>
      {item.note && (
        <p className="text-gray-300 px-4 pb-4 italic select-none pointer-events-none">
          {item.note}
        </p>
      )}
    </div>
  );
} 
