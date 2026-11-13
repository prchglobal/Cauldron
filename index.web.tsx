import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import appJson from './app.json';
import ContentService from './shared/ContentService';

declare const document: any;

// Initiate background R2 content sync on web launch
ContentService.syncWithR2().catch((err) => {
  console.log('[Cauldron Web] Initial content sync skipped or offline:', err);
});

AppRegistry.registerComponent(appJson.name, () => App);

const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication(appJson.name, {
    rootTag,
  });
}
