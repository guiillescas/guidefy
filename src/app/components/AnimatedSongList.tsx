'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music4 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  annotation: string;
  isTyping: boolean;
  customTransition: boolean;
}

export default function AnimatedSongList() {
  const initialSongs: Song[] = [
    {
      id: 'verse',
      title: 'Verse 1',
      annotation: '',
      isTyping: false,
      customTransition: false,
    },
    {
      id: 'chorus',
      title: 'Chorus',
      annotation: 'The whole band coming on strong',
      isTyping: false,
      customTransition: false,
    },
    {
      id: 'bridge',
      title: 'Bridge',
      annotation: '',
      isTyping: false,
      customTransition: false,
    },
  ];

  const [songs, setSongs] = useState<Song[]>(initialSongs);

  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let typeInterval: NodeJS.Timeout;

    if (phase === 0) {
      timer = setTimeout(() => {
        setPhase(1);
      }, 2000);
    } else if (phase === 1) {
      setSongs((prevSongs) => {
        const newSongs = [...prevSongs];

        newSongs[1] = {
          ...newSongs[1],
          customTransition: true,
        };

        newSongs[2] = {
          ...newSongs[2],
          customTransition: true,
        };

        const temp = newSongs[1];
        newSongs[1] = newSongs[2];
        newSongs[2] = temp;

        return newSongs;
      });

      timer = setTimeout(() => {
        setPhase(2);
      }, 3000);
    } else if (phase === 2) {
      setSongs((prevSongs) =>
        prevSongs.map((song) => {
          if (song.id === 'bridge') {
            return { ...song, isTyping: true, annotation: '' };
          }
          return { ...song, isTyping: false };
        })
      );

      const textToType = 'Drums only';
      let charIndex = 0;

      typeInterval = setInterval(() => {
        charIndex++;

        const currentText = textToType.slice(0, charIndex);

        setSongs((prevSongs) =>
          prevSongs.map((song) => {
            if (song.id === 'bridge' && song.isTyping) {
              return { ...song, annotation: currentText };
            }
            return song;
          })
        );

        if (charIndex >= textToType.length) {
          clearInterval(typeInterval);
          timer = setTimeout(() => {
            setPhase(3);
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    } else if (phase === 3) {
      setSongs((prevSongs) => {
        const newSongs = [...prevSongs];

        newSongs[1] = {
          ...newSongs[1],
          customTransition: true,
          isTyping: false,
          annotation: '',
        };

        newSongs[2] = {
          ...newSongs[2],
          customTransition: true,
        };

        const temp = newSongs[1];
        newSongs[1] = newSongs[2];
        newSongs[2] = temp;

        return newSongs.map((song) => {
          if (song.id === 'chorus') {
            return { ...song, annotation: 'The whole band coming on strong' };
          }
          return song;
        });
      });

      timer = setTimeout(() => {
        setPhase(4);
      }, 2000);
    } else if (phase === 4) {
      setSongs((prevSongs) =>
        prevSongs.map((song) => {
          if (song.id === 'chorus') {
            return {
              ...song,
              annotation: 'The whole band coming on strong',
              customTransition: false,
              isTyping: false,
            };
          }
          return {
            ...song,
            annotation: '',
            customTransition: false,
            isTyping: false,
          };
        })
      );

      timer = setTimeout(() => {
        setPhase(0);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="mt-8 space-y-4">
      {songs.map((song) => {
        const transition = song.customTransition
          ? { type: 'spring', stiffness: 50, damping: 10 }
          : { type: 'spring', stiffness: 300, damping: 30 };

        return (
          <motion.div
            key={song.id}
            layout
            transition={transition}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col p-4 rounded-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600"
          >
            <div className="flex items-center gap-3">
              <Music4 className="h-5 w-5 text-blue-400" />
              <span className="text-gray-200">{song.title}</span>
            </div>

            {song.annotation && (
              <div className="mt-1 text-xs text-gray-400">
                {song.annotation}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
} 
