import React from 'react';
import { View, StyleSheet } from 'react-native';

export function DateTimePicker({ value, onChange, mode = 'date', ...props }: any) {
  const formatted = value ? new Date(value).toISOString().slice(0, 10) : '';

  return (
    <View style={styles.container}>
      <input
        type={mode === 'time' ? 'time' : 'date'}
        value={formatted}
        onChange={(e: any) => {
          const val = e?.target?.value;
          if (onChange && val) {
            onChange({ type: 'set', nativeEvent: { timestamp: new Date(val).getTime() } }, new Date(val));
          }
        }}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #444',
          background: '#222',
          color: '#fff',
          fontSize: '16px',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DateTimePicker;
