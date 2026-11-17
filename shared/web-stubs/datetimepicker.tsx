import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export function DateTimePicker({ value, onChange, mode = 'date', ...props }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  const getFormattedValue = (val: any) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    if (mode === 'time') {
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const commitValue = (val: string) => {
    if (!onChange || !val) return;
    if (mode === 'time') {
      const [h, m] = val.split(':').map(Number);
      const d = value ? new Date(value) : new Date();
      if (!isNaN(h) && !isNaN(m)) {
        d.setHours(h, m, 0, 0);
        onChange({ type: 'set', nativeEvent: { timestamp: d.getTime() } }, d);
      }
    } else {
      const parts = val.split('-').map(Number);
      if (parts.length === 3 && parts[0] > 1000) {
        const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
        if (!isNaN(d.getTime())) {
          onChange({ type: 'set', nativeEvent: { timestamp: d.getTime() } }, d);
        }
      }
    }
  };

  const openPicker = () => {
    if (inputRef.current) {
      if (typeof (inputRef.current as any).showPicker === 'function') {
        try {
          (inputRef.current as any).showPicker();
          return;
        } catch {}
      }
      inputRef.current.focus();
      inputRef.current.click();
    }
  };

  React.useEffect(() => {
    openPicker();
  }, []);

  const isTime = mode === 'time';
  const icon = isTime ? '⏰' : '📅';
  const label = isTime ? 'Open Clock' : 'Open Calendar';

  return (
    <View style={styles.container}>
      {/* 
        The input is positioned offscreen so that the browser does NOT render 
        the inline editable number boxes (spinbuttons), and only displays the 
        native popup calendar / clock dialog when showPicker() is invoked.
      */}
      <input
        ref={inputRef}
        type={isTime ? 'time' : 'date'}
        defaultValue={getFormattedValue(value)}
        onChange={(e: any) => {
          const val = e?.target?.value;
          if (val) {
            commitValue(val);
          }
        }}
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          border: 'none',
          padding: 0,
          margin: 0,
          outline: 'none',
        }}
      />

      <TouchableOpacity style={styles.iconButton} onPress={openPicker} activeOpacity={0.7}>
        <Text style={styles.iconText}>{icon}</Text>
        <Text style={styles.btnLabel}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  iconText: {
    fontSize: 20,
  },
  btnLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default DateTimePicker;
