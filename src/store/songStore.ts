import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Song, BaseElement, FlowElement, SequenceItem } from '@/types';

// Variável para armazenar o timeout do debounce
let saveTimeout: NodeJS.Timeout;

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
  loadSongs: () => Promise<void>;
  saveSong: (song: Song) => Promise<void>;
  updateSongInDB: (song: Song) => Promise<void>;
  deleteSongFromDB: (id: string) => Promise<void>;
  debounceSave: (song: Song) => Promise<void>;
  updateSong: (id: string, title: string, key: string) => Promise<void>;
}

export const useSongStore = create<SongStore>((set, get) => ({
  songs: [],
  selectedSong: null,

  setSongs: (songs) => set({ songs }),
  
  setSelectedSong: (selectedSong) => set({ selectedSong }),
  
  addSong: async (title, key) => {
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          key,
          sequence: []
        })
      });

      if (!response.ok) throw new Error('Failed to create song');
      
      const newSong = await response.json();
      
      set(state => ({
        songs: [...state.songs, newSong],
        selectedSong: newSong
      }));
    } catch (error) {
      console.error('Error creating song:', error);
    }
  },
  
  deleteSong: async (id) => {
    await get().deleteSongFromDB(id);
  },
  
  addSequenceItem: async (element, type, specificOccurrence) => {
    const selectedSong = get().selectedSong;
    if (!selectedSong) return;

    const newItem: SequenceItem = {
      id: uuidv4(),
      type,
      element,
      order: selectedSong.sequence.length,
      ...(type === 'base' && { occurrence: specificOccurrence })
    };

    const updatedSong = {
      ...selectedSong,
      sequence: [...selectedSong.sequence, newItem]
    };

    // Atualiza o estado local imediatamente
    set(state => ({
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === updatedSong.id ? updatedSong : song
      )
    }));

    // Inicia o debounce para salvar no banco
    await get().debounceSave(updatedSong);
  },
  
  deleteSequenceItem: async (itemId) => {
    const selectedSong = get().selectedSong;
    if (!selectedSong) return;

    const updatedSong = {
      ...selectedSong,
      sequence: selectedSong.sequence.filter(item => item.id !== itemId)
    };

    // Atualiza o estado local imediatamente
    set(state => ({
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === updatedSong.id ? updatedSong : song
      )
    }));

    // Inicia o debounce para salvar no banco
    await get().debounceSave(updatedSong);
  },
  
  updateNote: async (itemId, note) => {
    const selectedSong = get().selectedSong;
    if (!selectedSong) return;

    const updatedSong = {
      ...selectedSong,
      sequence: selectedSong.sequence.map(item =>
        item.id === itemId ? { ...item, note } : item
      )
    };

    // Atualiza o estado local imediatamente
    set(state => ({
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === updatedSong.id ? updatedSong : song
      )
    }));

    // Inicia o debounce para salvar no banco
    await get().debounceSave(updatedSong);
  },
  
  reorderSequence: async (oldIndex, newIndex) => {
    const selectedSong = get().selectedSong;
    if (!selectedSong) return;

    const updatedSequence = [...selectedSong.sequence];
    const [movedItem] = updatedSequence.splice(oldIndex, 1);
    updatedSequence.splice(newIndex, 0, movedItem);

    const updatedSong = {
      ...selectedSong,
      sequence: updatedSequence
    };

    // Atualiza o estado local imediatamente
    set(state => ({
      selectedSong: updatedSong,
      songs: state.songs.map(song => 
        song.id === updatedSong.id ? updatedSong : song
      )
    }));

    // Inicia o debounce para salvar no banco
    await get().debounceSave(updatedSong);
  },

  loadSongs: async () => {
    try {
      const response = await fetch('/api/songs');
      console.log({response});
      if (!response.ok) throw new Error('Failed to load songs');
      const songs = await response.json();
      set({ songs });
    } catch (error) {
      console.log({error});
      console.error('Error loading songs:', error);
    }
  },

  saveSong: async (song: Song) => {
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      });
      
      if (!response.ok) throw new Error('Failed to save song');
      const savedSong = await response.json();
      set(state => ({
        songs: [...state.songs, savedSong]
      }));
    } catch (error) {
      console.error('Error saving song:', error);
    }
  },

  updateSongInDB: async (song: Song) => {
    try {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      });
      
      if (!response.ok) throw new Error('Failed to update song');
    } catch (error) {
      console.error('Error updating song:', error);
    }
  },

  deleteSongFromDB: async (id: string) => {
    try {
      const response = await fetch(`/api/songs/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete song');
      set(state => ({
        songs: state.songs.filter(song => song.id !== id),
        selectedSong: state.selectedSong?.id === id ? null : state.selectedSong
      }));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  },

  // Função auxiliar para salvar com debounce
  debounceSave: async (song: Song) => {
    // Limpa o timeout anterior se existir
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Cria um novo timeout
    saveTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/songs/${song.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(song)
        });

        if (!response.ok) throw new Error('Failed to update song');
        console.log('Sequence saved to database'); // Feedback opcional
      } catch (error) {
        console.error('Error saving sequence:', error);
      }
    }, 5000); // 5 segundos de delay
  },

  updateSong: async (id: string, title: string, key: string) => {
    try {
      const response = await fetch(`/api/songs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          key,
          sequence: get().selectedSong?.sequence || []
        })
      });

      if (!response.ok) throw new Error('Failed to update song');
      
      const updatedSong = await response.json();
      
      set(state => ({
        songs: state.songs.map(song => 
          song.id === id ? updatedSong : song
        ),
        selectedSong: state.selectedSong?.id === id ? updatedSong : state.selectedSong
      }));
    } catch (error) {
      console.error('Error updating song:', error);
    }
  }
})); 
