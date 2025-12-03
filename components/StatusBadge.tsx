import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface StatusBadgeProps {
  variant: 'urgent' | 'dueSoon' | 'today';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  style,
  children,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'urgent':
        return { backgroundColor: theme.colors.urgent || '#FF4444' };
      case 'dueSoon':
        return { backgroundColor: theme.colors.dueSoon || '#FF9800' };
      case 'today':
        return { backgroundColor: theme.colors.accent.gold };
      default:
        return { backgroundColor: theme.colors.accent.blue };
    }
  };

  return (
    <View style={[styles.badge, getVariantStyle(), style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.full,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...theme.typography.small,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
  },
});

