'use client';

import { useState, useEffect } from 'react';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { useSongStore } from '@/store/songStore';
import { AddSongModal } from './AddSongModal';

export function SongList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { songs, selectedSong, setSelectedSong, deleteSong, loadSongs } = useSongStore();

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <div className="w-80 h-full border-r border-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Songs</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <IoAdd className="text-white text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`p-4 rounded-lg mb-2 cursor-pointer ${
              selectedSong?.id === song.id
                ? 'bg-white/20'
                : 'hover:bg-white/10'
            }`}
            onClick={() => setSelectedSong(song)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{song.title}</h3>
                <p className="text-gray-400 text-sm">Key: {song.key}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSong(song.id);
                }}
                className="text-red-500 hover:text-red-400 p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <IoTrash className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddSongModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 
