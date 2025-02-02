'use client';

import { useSongStore } from '@/store/songStore';
import type { BaseElement, FlowElement } from '@/types';

const baseElements: BaseElement[] = [
  'Verse',
  'Pre-Chorus',
  'Chorus',
  'Bridge',
  'Instrumental',
  'Intro',
  'Interlude',
  'Outro',
  'Ending',
  'Tag'
];

const flowElements: FlowElement[] = [
  'Drums',
  'Breakdown',
  'Build',
  'Pause'
];

export function ElementSelector() {
  const { addSequenceItem } = useSongStore();

  return (
    <div className="w-64 border-l border-gray-800 p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3">Base Elements</h3>
        <div className="space-y-2">
          {baseElements.map((element) => (
            <button
              key={element}
              onClick={() => addSequenceItem(element, 'base')}
              className="w-full p-3 text-left text-white rounded-lg bg-blue-900/50 hover:bg-blue-900/70"
            >
              {element}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-bold mb-3">Flow Elements</h3>
        <div className="space-y-2">
          {flowElements.map((element) => (
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
