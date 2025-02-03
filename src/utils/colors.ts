export const elementColors: Record<string, { bg: string, hover: string, numeral: string }> = {
  'Intro': {
    bg: 'bg-cyan-900/50',
    hover: 'hover:bg-cyan-900/70',
    numeral: 'bg-cyan-900/30 hover:bg-cyan-900/50'
  },
  'Verse': {
    bg: 'bg-blue-900/50',
    hover: 'hover:bg-blue-900/70',
    numeral: 'bg-blue-900/30 hover:bg-blue-900/50'
  },
  'Pre-Chorus': {
    bg: 'bg-yellow-900/50',
    hover: 'hover:bg-yellow-900/70',
    numeral: 'bg-yellow-900/30 hover:bg-yellow-900/50'
  },
  'Chorus': {
    bg: 'bg-orange-900/50',
    hover: 'hover:bg-orange-900/70',
    numeral: 'bg-orange-900/30 hover:bg-orange-900/50'
  },
  'Tag': {
    bg: 'bg-green-900/50',
    hover: 'hover:bg-green-900/70',
    numeral: 'bg-green-900/30 hover:bg-green-900/50'
  },
  'Bridge': {
    bg: 'bg-red-900/50',
    hover: 'hover:bg-red-900/70',
    numeral: 'bg-red-900/30 hover:bg-red-900/50'
  }
};

export const getElementColors = (element: string) => {
  return elementColors[element] || {
    bg: 'bg-blue-900/50',
    hover: 'hover:bg-blue-900/70',
    numeral: 'bg-blue-900/30 hover:bg-blue-900/50'
  };
}; 
