// FILE: src/mobile/components/ui/Input.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#A9A9A9"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 8,
  },
});
