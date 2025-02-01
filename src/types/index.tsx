export interface Song {
  id: string;
  title: string;
  sequence: SequenceItem[];
}

export interface SequenceItem {
  id: string;
  type: SequenceType;
  element: BaseElement | FlowElement;
  order: number;
  occurrence?: number;
  note?: string;
}

export type SequenceType = 'base' | 'flow';
export type BaseElement = 'Verse' | 'Chorus' | 'Bridge' | 'Instrumental' | 'Outro' | 'Intro' | 'Interlude';
export type FlowElement = 'Drums' | 'Breakdown' | 'Build' | 'Pause';
