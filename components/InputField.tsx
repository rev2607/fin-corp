import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(theme.colors.border.default);
  const labelScale = useSharedValue(1);

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderColor.value,
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: labelScale.value }],
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(theme.colors.border.focus, {
      duration: theme.animation.normal,
    });
    labelScale.value = withTiming(1.05, { duration: theme.animation.normal });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(theme.colors.border.default, {
      duration: theme.animation.normal,
    });
    labelScale.value = withTiming(1, { duration: theme.animation.normal });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.label, animatedLabelStyle]}>
        {label}
      </Animated.Text>
      <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            error && styles.inputError,
          ]}
          placeholderTextColor={theme.colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    minHeight: 44,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.typography.small,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

