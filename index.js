/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register for both 'cauldron' (from app.json) and native iOS target 'PocketMystic'
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('PocketMystic', () => App);
