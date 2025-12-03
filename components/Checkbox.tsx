import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  size = 24,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, { width: size, height: size }, style]}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderRadius: size / 6,
          },
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && (
          <View
            style={[
              styles.checkmark,
              {
                width: size * 0.5,
                height: size * 0.3,
                borderWidth: size * 0.08,
                marginTop: -size * 0.1,
              },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: theme.colors.accent.gold,
    backgroundColor: theme.colors.accent.gold,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#111217',
    transform: [{ rotate: '-45deg' }],
  },
});

