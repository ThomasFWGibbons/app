// FILE: src/mobile/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  style?: ViewStyle;
}

export default function Button({ title, onPress, loading = false, disabled = false, variant = 'default', style }: ButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        buttonStyles[variant].container,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={buttonStyles[variant].textColor} />
      ) : (
        <Text style={[styles.text, { color: buttonStyles[variant].textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
});

const buttonStyles = {
    default: {
        container: { backgroundColor: '#007AFF' },
        textColor: '#FFFFFF',
    },
    destructive: {
        container: { backgroundColor: '#FF3B30' },
        textColor: '#FFFFFF',
    },
    outline: {
        container: { borderWidth: 1, borderColor: '#007AFF', backgroundColor: 'transparent' },
        textColor: '#007AFF',
    },
    secondary: {
        container: { backgroundColor: '#E5E5EA' },
        textColor: '#000000',
    },
    ghost: {
        container: { backgroundColor: 'transparent' },
        textColor: '#007AFF',
    },
    link: {
        container: { backgroundColor: 'transparent', paddingVertical: 4 },
        textColor: '#007AFF',
    }
};
