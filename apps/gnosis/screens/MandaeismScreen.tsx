import React from 'react';
import { GnosisCategoryList } from './GnosisCategoryList';
import { MANDAEISM_PRACTICES } from '../data/gnosisTraditions';

export function MandaeismScreen() {
  return (
    <GnosisCategoryList
      title="Mandaeism"
      emoji="🌙"
      subtitle="Living water & the World of Light"
      practices={MANDAEISM_PRACTICES}
    />
  );
}
