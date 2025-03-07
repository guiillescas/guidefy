export interface Song {
  id: string;
  title: string;
  key?: string;
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
export type BaseElement =
  | 'Verse'
  | 'Pre-Chorus'
  | 'Chorus'
  | 'Bridge'
  | 'Instrumental'
  | 'Outro'
  | 'Intro'
  | 'Interlude'
  | 'Ending'
  | 'Tag';
export type FlowElement = 'Drums' | 'Breakdown' | 'Build' | 'Pause';
