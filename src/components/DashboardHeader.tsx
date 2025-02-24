'use client';

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSongStore } from "@/store/songStore";
import { SongList } from "./SongList";

export function DashboardHeader() {
  const { songs, selectedSong, setSelectedSong } = useSongStore();

  const handlePrevious = () => {
    if (!selectedSong) return;
    const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
    if (currentIndex > 0) {
      setSelectedSong(songs[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!selectedSong) return;
    const currentIndex = songs.findIndex(song => song.id === selectedSong.id);
    if (currentIndex < songs.length - 1) {
      setSelectedSong(songs[currentIndex + 1]);
    }
  };

  return (
    <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="block md:hidden text-white">
          <SongList variant="sheet" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!selectedSong || songs.indexOf(selectedSong) === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={!selectedSong || songs.indexOf(selectedSong) === songs.length - 1}
        >
          Next
        </Button>
      </div>
    </header>
  );
} 
