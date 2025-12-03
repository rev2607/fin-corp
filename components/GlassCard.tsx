import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../theme';

interface GlassCardProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'hover';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  ...props
}) => {
  const cardStyle = [
    styles.card,
    variant === 'hover' && styles.cardHover,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.md,
  },
  cardHover: {
    backgroundColor: theme.colors.background.cardHover,
  },
});

