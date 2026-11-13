/**
 * Help house - Cauldron master app.
 * A single settings/help screen: theme, daily-horoscope notifications, help
 * links, and about. New house (not derived from a source app); uses the shared
 * theme + banner contexts directly.
 */

import React from 'react';
import { HelpHomeScreen } from './screens/HelpHomeScreen';

export default function HelpSection() {
  return <HelpHomeScreen />;
}
