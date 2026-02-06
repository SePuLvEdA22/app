import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ServiceStatus } from '@/types';
import { SERVICE_STATUS, SERVICE_STATUS_COLORS } from '@/utils/constants';

interface StatusBadgeProps {
  status: ServiceStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeStyles = {
    sm: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 10,
    },
    md: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 12,
    },
    lg: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 14,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: SERVICE_STATUS_COLORS[status],
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
          },
        ]}
      >
        {SERVICE_STATUS[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;