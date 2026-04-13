import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#ffffff' : Colors.light.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: isDark ? '#030712' : '#ffffff' },
        tabBarStyle: {
          backgroundColor: isDark ? '#030712' : '#ffffff',
          borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Subjects',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bookmark.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
