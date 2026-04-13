import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export const AppLogo = ({ size = 40 }: { size?: number }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row items-center">
      <View 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: size * 0.25,
          backgroundColor: isDark ? '#3b82f6' : '#2563eb',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5
        }}
      >
        <Ionicons name="code-slash" size={size * 0.6} color="white" />
      </View>
      <View className="ml-3">
        <Text className="text-xl font-black text-gray-900 dark:text-white leading-tight">
          NotesBy
        </Text>
        <Text 
          className="text-lg font-bold leading-tight"
          style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
        >
          AmanSir
        </Text>
      </View>
    </View>
  );
};
