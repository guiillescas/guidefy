import { useEffect, useState } from 'react';

import { animate } from 'framer-motion';

export function useCountUp(end: number, duration: number = 2) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, end, {
      duration,
      onUpdate: value => {
        setValue(value);
      },
      ease: 'easeOut'
    });

    return () => controls.stop();
  }, [end, duration]);

  return value;
}
