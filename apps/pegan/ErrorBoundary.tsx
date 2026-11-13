import React from 'react';
import { View, Text, Button, StyleSheet, DevSettings } from 'react-native';

type State = {
  hasError: boolean;
  error?: any;
  info?: any;
};

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // You can log the error to an error reporting service here
    console.error('[ErrorBoundary] Caught error:', error, info);
    this.setState({ info });
  }

  handleReload = () => {
    try {
      DevSettings.reload();
    } catch (e) {
      // If DevSettings isn't available (release builds), fallback to noop
      console.warn('DevSettings.reload not available', e);
    }
    // reset local state as fallback
    this.setState({ hasError: false, error: undefined, info: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{String(this.state.error)}</Text>
          <Button title="Reload" onPress={this.handleReload} />
        </View>
      );
    }

    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  message: { marginBottom: 12, textAlign: 'center' },
});
