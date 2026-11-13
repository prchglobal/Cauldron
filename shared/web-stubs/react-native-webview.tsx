import React from 'react';
import { View, StyleSheet } from 'react-native';

export function WebView({ source, style, ...props }: any) {
  const uri = source?.uri || '';
  const html = source?.html;

  if (html) {
    return (
      <View style={[styles.container, style]}>
        <iframe
          srcDoc={html}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="webview"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <iframe
        src={uri}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="webview"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default WebView;
