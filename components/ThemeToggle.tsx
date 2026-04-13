import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
      activeOpacity={0.7}
    >
      <Ionicons
        name={colorScheme === 'dark' ? 'sunny' : 'moon'}
        size={20}
        color={colorScheme === 'dark' ? '#fbbf24' : '#4b5563'}
      />
    </TouchableOpacity>
  );
}
