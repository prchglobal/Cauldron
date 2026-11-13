import React from 'react';
import { GnosisCategoryList } from './GnosisCategoryList';
import { MANICHAEAN_PRACTICES } from '../data/gnosisTraditions';

export function ManichaeanScreen() {
  return (
    <GnosisCategoryList
      title="Manichaean"
      emoji="☯️"
      subtitle="The Religion of Light & the trapped spark"
      practices={MANICHAEAN_PRACTICES}
    />
  );
}
