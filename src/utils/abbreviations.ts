export const elementAbbreviations: Record<string, string> = {
  'Intro': 'Intro',
  'Verse': 'V',
  'Pre-Chorus': 'PC',
  'Chorus': 'C',
  'Bridge': 'B',
  'Instrumental': 'Inst',
  'Interlude': 'It',
  'Outro': 'Outro',
  'Tag': 'Tag',
  'Ending': 'E',
  'Drums': 'Drums',
  'Breakdown': 'Bd',
  'Build': 'Build',
  'Pause': 'Pause'
};

export const getAbbreviation = (element: string): string => {
  return elementAbbreviations[element] || element;
}; 
