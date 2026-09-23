import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NOTES_DATA } from '@/constants/NotesData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const subject = NOTES_DATA.find((s) => s.id === id);

  if (!subject) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-gray-950">
        <Text className="dark:text-white">Subject not found</Text>
      </View>
    );
  }

  const renderTopic = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/topic/${subject.id}/${item.id}`)}
      activeOpacity={0.7}
      className="mb-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex-row items-center border border-gray-100 dark:border-gray-800"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: subject.color + '20' }}
      >
        <Text className="font-bold" style={{ color: subject.color }}>
          {item.title[0]}
        </Text>
      </View>
      <Text className="flex-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {item.title}
      </Text>
        <View className="flex-row items-center">
          {item.quiz?.length ? (
            <View className="mr-2 w-7 h-7 rounded-full items-center justify-center" style={{ backgroundColor: subject.color + '22' }}>
              <Ionicons name="help-circle" size={16} color={subject.color} />
            </View>
          ) : null}
          {item.flashcards?.length ? (
            <View className="mr-2 w-7 h-7 rounded-full items-center justify-center" style={{ backgroundColor: subject.color + '22' }}>
              <Ionicons name="layers" size={16} color={subject.color} />
            </View>
          ) : null}
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </View>
    </TouchableOpacity>
  );

  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <Stack.Screen 
        options={{ 
          title: subject.title,
          headerTintColor: isDark ? 'white' : subject.color,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: isDark ? '#030712' : 'white' },
          headerRight: () => <ThemeToggle />
        }} 
      />
      
      <View className="px-5 py-4">
        <Text className="text-sm uppercase tracking-widest font-bold mb-1" style={{ color: subject.color }}>
          Learning Path
        </Text>
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          All Topics
        </Text>
      </View>

      <FlatList
        data={subject.topics}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
