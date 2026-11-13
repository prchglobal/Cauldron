import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

export function PagerView({ children, style, initialPage = 0, onPageSelected, ...props }: any) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PagerView;
