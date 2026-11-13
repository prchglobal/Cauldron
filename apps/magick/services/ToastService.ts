import { ToastAndroid, Platform, Alert } from 'react-native';

export class ToastService {
  static show(message: string, duration: 'short' | 'long' = 'short'): void {
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        message,
        duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG
      );
    } else {
      // For iOS, use Alert without buttons for a toast-like appearance
      Alert.alert('', message, [{ text: 'OK', onPress: () => {} }], {
        cancelable: true,
      });
    }
  }
}
