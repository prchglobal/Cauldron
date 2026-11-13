/**
 * Re-export react-native-web with Android-specific primitives stubbed for web
 */
// @ts-ignore
import * as RNWeb from 'react-native-web';

export const PermissionsAndroid = {
  PERMISSIONS: {
    POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    NEVER_ASK_AGAIN: 'never_ask_again',
  },
  check: async (_permission: string) => true,
  request: async (_permission: string) => 'granted',
  requestMultiple: async (_permissions: string[]) => ({}),
};

export const ToastAndroid = {
  SHORT: 0,
  LONG: 1,
  BOTTOM: 0,
  CENTER: 1,
  TOP: 2,
  show: (message: string, _duration?: number) => {
    console.log('[ToastWeb]', message);
  },
  showWithGravity: (message: string, _duration?: number, _gravity?: number) => {
    console.log('[ToastWeb]', message);
  },
  showWithGravityAndOffset: (message: string, _duration?: number, _gravity?: number, _x?: number, _y?: number) => {
    console.log('[ToastWeb]', message);
  },
};

// @ts-ignore
export * from 'react-native-web';

const ReactNativeWebExtended = {
  ...RNWeb,
  PermissionsAndroid,
  ToastAndroid,
};

export default ReactNativeWebExtended;
