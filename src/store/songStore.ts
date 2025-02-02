import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Song, BaseElement, FlowElement, SequenceItem } from '@/types';

interface SongStore {
  songs: Song[];
  selectedSong: Song | null;
  setSongs: (songs: Song[]) => void;
  setSelectedSong: (song: Song | null) => void;
  addSong: (title: string, key: string) => void;
  deleteSong: (id: string) => void;
  addSequenceItem: (element: BaseElement | FlowElement, type: 'base' | 'flow', specificOccurrence?: number) => void;
  deleteSequenceItem: (itemId: string) => void;
  updateNote: (itemId: string, note: string) => void;
  reorderSequence: (oldIndex: number, newIndex: number) => void;
}

export const useSongStore = create<SongStore>((set) => ({
  songs: [],
  selectedSong: null,

  setSongs: (songs) => set({ songs }),
  
  setSelectedSong: (selectedSong) => set({ selectedSong }),
  
  addSong: (title, key) => set((state) => ({
    songs: [...state.songs, {
      id: uuidv4(),
      title,
      key,
      sequence: []
    }]
  })),
  
  deleteSong: (id) => set((state) => ({
    songs: state.songs.filter(song => song.id !== id),
    selectedSong: state.selectedSong?.id === id ? null : state.selectedSong
  })),
  
  addSequenceItem: (element, type, specificOccurrence) => set((state) => {
    if (!state.selectedSong) return state;

    const sequence = [...state.selectedSong.sequence];
    const occurrences = sequence.filter(
      item => item.element === element && item.type === type
    ).length;

    const newItem: SequenceItem = {
      id: uuidv4(),
      element,
      type,
      order: sequence.length,
      occurrence: specificOccurrence ?? (occurrences + 1),
      note: ''
    };

    const updatedSong = {
      ...state.selectedSong,
      sequence: [...sequence, newItem]
    };

    return {
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === state.selectedSong?.id ? updatedSong : song
      )
    };
  }),
  
  deleteSequenceItem: (itemId) => set((state) => {
    if (!state.selectedSong) return state;

    const updatedSequence = state.selectedSong.sequence.filter(
      item => item.id !== itemId
    );

    const updatedSong = {
      ...state.selectedSong,
      sequence: updatedSequence
    };

    return {
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === state.selectedSong?.id ? updatedSong : song
      )
    };
  }),
  
  updateNote: (itemId, note) => set((state) => {
    if (!state.selectedSong) return state;

    const updatedSequence = state.selectedSong.sequence.map(item =>
      item.id === itemId ? { ...item, note } : item
    );

    const updatedSong = {
      ...state.selectedSong,
      sequence: updatedSequence
    };

    return {
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === state.selectedSong?.id ? updatedSong : song
      )
    };
  }),
  
  reorderSequence: (oldIndex, newIndex) => set((state) => {
    if (!state.selectedSong) return state;

    const sequence = [...state.selectedSong.sequence];
    const [removed] = sequence.splice(oldIndex, 1);
    sequence.splice(newIndex, 0, removed);

    const updatedSequence = sequence.map((item, index) => ({
      ...item,
      order: index
    }));

    const updatedSong = {
      ...state.selectedSong,
      sequence: updatedSequence
    };

    return {
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === state.selectedSong?.id ? updatedSong : song
      )
    };
  })
})); 
