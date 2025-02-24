'use client';

import { useSongStore } from '@/store/songStore';
import type { BaseElement, FlowElement } from '@/types';
import { getElementColors } from '@/utils/colors';

const baseElements: BaseElement[] = [
  'Intro',
  'Verse',
  'Pre-Chorus',
  'Chorus',
  'Bridge',
  'Instrumental',
  'Interlude',
  'Outro',
  'Tag',
  'Ending'
];

const flowElements: FlowElement[] = ['Drums', 'Breakdown', 'Build', 'Pause'];

export function ElementSelector() {
  const { addSequenceItem, selectedSong } = useSongStore();

  const getAvailableNumbers = (element: BaseElement): number[] => {
    if (!selectedSong) return [];

    const occurrences = selectedSong.sequence
      .filter(item => item.type === 'base' && item.element === element)
      .map(item => item.occurrence || 1);

    const maxOccurrence = Math.max(...occurrences, 0);
    // Se existem ocorrências, retorna um array com todos os números do 2 até maxOccurrence + 1
    return maxOccurrence > 0 ? Array.from({ length: maxOccurrence }, (_, i) => i + 2) : [];
  };

  return (
    <div className="w-64 border-l border-gray-800 p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3 hidden md:block">Base Elements</h3>
        <div className="space-y-2">
          {baseElements.map(element => (
            <div key={element}>
              <button
                onClick={() => addSequenceItem(element, 'base', 1)}
                className={`w-full p-3 text-left text-white rounded-lg ${getElementColors(element).bg} ${getElementColors(element).hover}`}
              >
                {element}
              </button>

              <div className="flex flex-wrap gap-2 mt-2 pl-4">
                {getAvailableNumbers(element).map(num => (
                  <button
                    key={num}
                    onClick={() => addSequenceItem(element, 'base', num)}
                    className={`w-8 h-8 flex items-center justify-center text-white rounded-lg ${getElementColors(element).numeral}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-bold mb-3">Flow Elements</h3>
        <div className="space-y-2">
          {flowElements.map(element => (
            <button
              key={element}
              onClick={() => addSequenceItem(element, 'flow')}
              className="w-full p-3 text-left text-white rounded-lg bg-purple-900/50 hover:bg-purple-900/70"
            >
              {element}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
