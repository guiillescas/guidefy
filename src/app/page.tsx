'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, MeasuringStrategy } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoClose, IoPencil, IoMenu, IoChevronBack, IoChevronForward, IoReorderTwo } from 'react-icons/io5';
import type { Song, BaseElement, FlowElement, SequenceItem } from '@/types';

function SortableItem({ 
  item, 
  onEditNote, 
  onDeleteItem 
}: { 
  item: SequenceItem;
  onEditNote: (id: string) => void;
  onDeleteItem: (id: string) => void;
}) {
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
      style={style}
      className={`mb-2 rounded-lg select-none ${
        item.type === 'base' ? 'bg-blue-900/50' : 'bg-purple-900/50'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab p-3 -m-2 hover:bg-white/10 rounded-lg touch-manipulation"
            style={{ touchAction: 'none' }}
          >
            <IoReorderTwo className="text-gray-400 text-2xl" />
          </div>
          <span className="text-white font-medium text-lg">
            {item.occurrence ? `${item.element} ${item.occurrence}` : item.element}
          </span>
        </div>
        <div className="flex items-center">
          <button
            className="p-2"
            onClick={() => onEditNote(item.id)}
          >
            <IoPencil className="text-white text-xl" />
          </button>
          <button
            className="p-2"
            onClick={() => onDeleteItem(item.id)}
          >
            <IoClose className="text-white text-xl" />
          </button>
        </div>
      </div>
      {item.note && (
        <p className="text-gray-300 px-4 pb-4 italic">
          {item.note}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongKey, setNewSongKey] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isBaseElementsExpanded, setIsBaseElementsExpanded] = useState(true);
  const [isFlowElementsExpanded, setIsFlowElementsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseElements: BaseElement[] = ['Intro', 'Verse', 'Chorus', 'Bridge', 'Instrumental', 'Outro', 'Interlude', 'Ending', 'Tag'];
  const flowElements: FlowElement[] = ['Drums', 'Breakdown', 'Build', 'Pause'];
  const repeatingElements = ['Verse', 'Chorus', 'Bridge', 'Instrumental', 'Outro', 'Intro', 'Interlude'];

  useEffect(() => {
    const storedSongs = localStorage.getItem('songs');
    if (storedSongs) {
      setSongs(JSON.parse(storedSongs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('songs', JSON.stringify(songs));
  }, [songs]);

  const handleAddSong = () => {
    if (newSongTitle.trim()) {
      const newSong: Song = {
        id: Date.now().toString(),
        title: newSongTitle.trim(),
        key: newSongKey.trim(),
        sequence: []
      };
      
      setSongs([...songs, newSong]);
      setNewSongTitle('');
      setNewSongKey('');
      setIsModalVisible(false);
    }
  };

  const handleDeleteSong = (songId: string) => {
    setSongs(songs.filter(song => song.id !== songId));
    if (selectedSong?.id === songId) {
      setSelectedSong(null);
    }
  };

  const handleAddSequenceItem = (element: BaseElement | FlowElement, type: 'base' | 'flow', specificOccurrence?: number) => {
    if (!selectedSong) return;

    const newItem: SequenceItem = {
      id: Date.now().toString(),
      type,
      element,
      order: selectedSong.sequence.length,
      occurrence: specificOccurrence
    };

    const sameElements = selectedSong.sequence.filter(item => item.element === element);
    if (sameElements.length > 0 && !specificOccurrence) {
      newItem.occurrence = 1;
      const updatedSequence = selectedSong.sequence.map(item => 
        item.element === element && !item.occurrence 
          ? { ...item, occurrence: 1 }
          : item
      );

      const updatedSong = {
        ...selectedSong,
        sequence: [...updatedSequence, newItem]
      };

      setSongs(songs.map(song => 
        song.id === selectedSong.id ? updatedSong : song
      ));
      setSelectedSong(updatedSong);
    } else {
      const updatedSong = {
        ...selectedSong,
        sequence: [...selectedSong.sequence, newItem]
      };

      setSongs(songs.map(song => 
        song.id === selectedSong.id ? updatedSong : song
      ));
      setSelectedSong(updatedSong);
    }
  };

  const handleDeleteSequenceItem = (itemId: string) => {
    if (!selectedSong) return;

    const updatedSong = {
      ...selectedSong,
      sequence: selectedSong.sequence.filter(item => item.id !== itemId)
    };

    setSongs(songs.map(song => 
      song.id === selectedSong.id ? updatedSong : song
    ));
    setSelectedSong(updatedSong);
  };

  const handleEditNote = (itemId: string) => {
    if (!selectedSong) return;
    const item = selectedSong.sequence.find(item => item.id === itemId);
    setNoteText(item?.note || '');
    setEditingItemId(itemId);
    setIsNoteModalVisible(true);
  };

  const handleSaveNote = () => {
    if (!selectedSong || !editingItemId) return;

    const updatedSong = {
      ...selectedSong,
      sequence: selectedSong.sequence.map(item => 
        item.id === editingItemId 
          ? { ...item, note: noteText.trim() || undefined }
          : item
      )
    };

    setSongs(songs.map(song => 
      song.id === selectedSong.id ? updatedSong : song
    ));
    setSelectedSong(updatedSong);
    setIsNoteModalVisible(false);
    setEditingItemId(null);
    setNoteText('');
  };

  const getAvailableOccurrences = (element: BaseElement | FlowElement) => {
    if (!selectedSong) return [];
    const sameElements = selectedSong.sequence.filter(item => item.element === element);
    if (sameElements.length === 0) return [];
    
    const maxOccurrence = Math.max(...sameElements.map(item => item.occurrence || 1));
    return Array.from({ length: maxOccurrence }, (_, i) => i + 2);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
        distance: 1,
        pressure: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id && selectedSong) {
      const oldIndex = selectedSong.sequence.findIndex((item) => item.id === active.id);
      const newIndex = selectedSong.sequence.findIndex((item) => item.id === over.id);

      const updatedSong = {
        ...selectedSong,
        sequence: arrayMove(selectedSong.sequence, oldIndex, newIndex),
      };

      setSongs(songs.map((song) =>
        song.id === selectedSong.id ? updatedSong : song
      ));
      setSelectedSong(updatedSong);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900">
      <main className="flex h-full w-full bg-gray-900">
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-10 flex items-center px-4">
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <IoMenu className="text-white text-2xl" />
          </button>
          <h1 className="text-xl font-bold text-white ml-4">
            {selectedSong ? selectedSong.title : 'Songs'}
          </h1>
        </div>

        <div 
          className={`fixed md:relative z-20 bg-gray-900 border-r border-gray-700 transition-all duration-300 h-full ${
            isMenuCollapsed ? 'w-20' : 'w-1/3'
          } ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              {!isMenuCollapsed && (
                <h1 className="text-2xl font-bold text-white flex-1 text-center">
                  Songs
                </h1>
              )}
              <button
                className="p-2"
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
              >
                {isMenuCollapsed ? (
                  <IoChevronForward className="text-white text-xl" />
                ) : (
                  <IoChevronBack className="text-white text-xl" />
                )}
              </button>
            </div>

            {!isMenuCollapsed && (
              <button 
                className="mt-4 bg-blue-600 p-4 rounded-lg w-full"
                onClick={() => setIsModalVisible(true)}
              >
                <span className="text-white text-center font-semibold">
                  Add Song
                </span>
              </button>
            )}
          </div>

          <div className="overflow-y-auto">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`p-4 border-b border-gray-700 w-full flex items-center justify-between cursor-pointer ${
                  selectedSong?.id === song.id ? 'bg-gray-800' : ''
                }`}
                onClick={() => setSelectedSong(song)}
              >
                {isMenuCollapsed && window.innerWidth >= 768 ? (
                  <span className="text-lg text-white w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    {song.title[0]}
                  </span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-white">{song.title}</span>
                      {song.key && (
                        <span className="px-2 py-1 bg-blue-600/30 rounded-md text-sm font-medium text-blue-300">
                          {song.key}
                        </span>
                      )}
                    </div>
                    <button
                      className="ml-2 p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSong(song.id);
                      }}
                    >
                      <IoClose className="text-white text-xl" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col h-full md:h-full mt-16 md:mt-0">
          {selectedSong ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-white text-center">
                  {selectedSong.title}
                </h2>
                {selectedSong.key && (
                  <span className="px-3 py-1 bg-blue-600/30 rounded-md text-lg font-medium text-blue-300">
                    {selectedSong.key}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <button 
                  className="flex items-center mb-3"
                  onClick={() => setIsBaseElementsExpanded(!isBaseElementsExpanded)}
                >
                  <IoChevronForward 
                    className={`text-white text-xl transform transition-transform ${
                      isBaseElementsExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="text-xl font-semibold text-white ml-2">Base Elements</span>
                </button>
                
                {isBaseElementsExpanded && (
                  <div className="flex flex-wrap gap-3">
                    {baseElements.map((element) => (
                      <div key={element} className="flex items-center">
                        <button
                          className="bg-blue-600 px-6 py-3 rounded-lg"
                          onClick={() => handleAddSequenceItem(element, 'base')}
                        >
                          <span className="text-white font-medium text-lg">{element}</span>
                        </button>
                        
                        {repeatingElements.includes(element) && (
                          <div className="flex ml-2">
                            {getAvailableOccurrences(element).map((num) => (
                              <button
                                key={`${element}-${num}`}
                                className="bg-blue-800 px-4 py-3 rounded-lg ml-2"
                                onClick={() => handleAddSequenceItem(element, 'base', num)}
                              >
                                <span className="text-white font-medium text-lg">
                                  {num}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button 
                  className="flex items-center mb-3"
                  onClick={() => setIsFlowElementsExpanded(!isFlowElementsExpanded)}
                >
                  <IoChevronForward 
                    className={`text-white text-xl transform transition-transform ${
                      isFlowElementsExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="text-xl font-semibold text-white ml-2">Flow Elements</span>
                </button>
                
                {isFlowElementsExpanded && (
                  <div className="flex flex-wrap gap-3">
                    {flowElements.map((element) => (
                      <button
                        key={element}
                        className="bg-purple-600 px-6 py-3 rounded-lg"
                        onClick={() => handleAddSequenceItem(element, 'flow')}
                      >
                        <span className="text-white font-medium text-lg">{element}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xl font-semibold text-white mb-3">Sequence</h3>
                <div className="border border-gray-700 rounded-lg p-4 flex-1 overflow-y-auto">
                  {selectedSong.sequence.length > 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      measuring={{
                        droppable: {
                          strategy: MeasuringStrategy.Always
                        },
                      }}
                    >
                      <SortableContext
                        items={selectedSong.sequence.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {selectedSong.sequence.map((item) => (
                          <SortableItem 
                            key={item.id} 
                            item={item}
                            onEditNote={handleEditNote}
                            onDeleteItem={handleDeleteSequenceItem}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      Add elements to the sequence
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-xl text-center">
                Select a song to see details
              </p>
            </div>
          )}
        </div>

        {isModalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold text-white mb-4">
                Add New Song
              </h2>
              <input
                className="bg-gray-700 text-white p-3 rounded-lg mb-4 w-full"
                placeholder="Song name"
                value={newSongTitle}
                onChange={(e) => setNewSongTitle(e.target.value)}
              />
              <input
                className="bg-gray-700 text-white p-3 rounded-lg mb-4 w-full"
                placeholder="Key (e.g., C, Am, F#)"
                value={newSongKey}
                onChange={(e) => setNewSongKey(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-600 p-3 rounded-lg flex-1"
                  onClick={() => {
                    setNewSongTitle('');
                    setNewSongKey('');
                    setIsModalVisible(false);
                  }}
                >
                  <span className="text-white text-center">Cancel</span>
                </button>
                <button
                  className="bg-blue-600 p-3 rounded-lg flex-1"
                  onClick={handleAddSong}
                >
                  <span className="text-white text-center">Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isNoteModalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold text-white mb-4">
                Add Note
              </h2>
              <textarea
                className="bg-gray-700 text-white p-3 rounded-lg mb-4 w-full"
                placeholder="Type your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-600 p-3 rounded-lg flex-1"
                  onClick={() => {
                    setNoteText('');
                    setIsNoteModalVisible(false);
                    setEditingItemId(null);
                  }}
                >
                  <span className="text-white text-center">Cancel</span>
                </button>
                <button
                  className="bg-blue-600 p-3 rounded-lg flex-1"
                  onClick={handleSaveNote}
                >
                  <span className="text-white text-center">Save</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
