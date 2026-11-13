import React from 'react';
import { GnosisCategoryList } from './GnosisCategoryList';
import { ZOROASTRIAN_PRACTICES } from '../data/gnosisTraditions';

export function ZoroastrianismScreen() {
  return (
    <GnosisCategoryList
      title="Zoroastrianism"
      emoji="🔥"
      subtitle="Good Thoughts, Good Words, Good Deeds"
      practices={ZOROASTRIAN_PRACTICES}
    />
  );
}
