'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSongStore } from '@/store/songStore';
import { SequenceItem } from './SequenceItem';
import { NoteModal } from './NoteModal';
import { ElementSelector } from './ElementSelector';
import { Badge } from './ui/badge';
import { getAbbreviation } from '@/utils/abbreviations';

export function SequenceEditor() {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const { selectedSong, reorderSequence, updateNote, deleteSequenceItem } = useSongStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = selectedSong?.sequence.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = selectedSong?.sequence.findIndex(
        (item) => item.id === over.id
      );

      if (oldIndex !== undefined && newIndex !== undefined) {
        reorderSequence(oldIndex, newIndex);
      }
    }
  };

  const editingItem = selectedSong?.sequence.find(
    (item) => item.id === editingNoteId
  );

  if (!selectedSong) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a song to start editing
      </div>
    );
  }

  const sequenceSummary = selectedSong?.sequence.map(item => {
    const abbr = getAbbreviation(item.element);
    return item.type === 'base' && item.occurrence && item.occurrence > 1 
      ? `${abbr}${item.occurrence}` 
      : abbr;
  }).join(', ');

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-1">
          {selectedSong.title}
          {selectedSong.key && ' - '}
          {selectedSong.key && <Badge className="text-lg p-0 bg-blue-900 hover:bg-blue-900 w-9 h-9 flex items-center justify-center">{selectedSong.key}</Badge>}
        </h1>

        {selectedSong && (
          <div className="bg-gray-800/50 p-3 rounded-lg mb-4 overflow-x-auto">
            <p className="text-gray-300 text-sm font-bold">
              {sequenceSummary || 'Add elements to see sequence summary'}
            </p>
          </div>
        )}

        <div className="max-w-2xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedSong.sequence}
              strategy={verticalListSortingStrategy}
            >
              {selectedSong.sequence.map((item) => (
                <SequenceItem
                  key={item.id}
                  item={item}
                  onEditNote={(id) => setEditingNoteId(id)}
                  onDeleteItem={deleteSequenceItem}
                />
              ))}
            </SortableContext>
          </DndContext>

          {selectedSong.sequence.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              Add elements to create your sequence
            </div>
          )}
        </div>
      </div>

      <ElementSelector />

      <NoteModal
        isOpen={!!editingNoteId}
        onClose={() => setEditingNoteId(null)}
        initialNote={editingItem?.note || ''}
        onSave={(note) => {
          if (editingNoteId) {
            updateNote(editingNoteId, note);
          }
        }}
      />
    </div>
  );
} 
