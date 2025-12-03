import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface ProfilePictureProps {
  name?: string;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  style?: ViewStyle;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 40;
    case 'medium':
      return 48;
    case 'large':
      return 64;
    default:
      return 48;
  }
};

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  name = 'Client',
  size = 'medium',
  active = false,
  style,
}) => {
  const sizeValue = getSize(size);
  const initials = getInitials(name);

  // Generate a consistent color based on name
  const colors = [
    '#D4AF37',
    '#5B9BD5',
    '#51CF66',
    '#E8C547',
    '#7BB3E0',
    '#FF9800',
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];

  return (
    <View style={[styles.container, { width: sizeValue, height: sizeValue }, style]}>
      <View
        style={[
          styles.circle,
          {
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue / 2,
            backgroundColor,
          },
          active && styles.active,
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              fontSize: sizeValue * 0.4,
            },
          ]}
        >
          {initials}
        </Text>
      </View>
      {active && (
        <View
          style={[
            styles.activeBorder,
            {
              width: sizeValue + 4,
              height: sizeValue + 4,
              borderRadius: (sizeValue + 4) / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  active: {
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
  },
  activeBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
  },
});

