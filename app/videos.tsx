import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { VIDEOS, VideoLecture } from '@/constants/VideoData';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function VideosScreen() {
  const isDark = useColorScheme() === 'dark';

  const openVideo = async (url: string) => {
    const supported = await Linking.canOpenURL(url).catch(() => false);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const renderItem = ({ item }: { item: VideoLecture }) => (
    <TouchableOpacity
      onPress={() => openVideo(item.url)}
      activeOpacity={0.8}
      className="mb-4 flex-row items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
    >
      <View className="w-14 h-14 rounded-2xl items-center justify-center mr-4 overflow-hidden" style={{ backgroundColor: '#8b5cf6' }}>
        {item.videoId ? (
          <Image
            source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
            contentFit="cover"
            style={{ width: 56, height: 56 }}
          />
        ) : (
          <Ionicons name="play" size={24} color="white" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-800 dark:text-gray-50">
          {item.title}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {item.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <Stack.Screen
        options={{
          title: 'Video Lectures',
          headerTintColor: isDark ? 'white' : '#1f2937',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: isDark ? '#030712' : 'white' },
          headerRight: () => <ThemeToggle />,
        }}
      />
      <View className="px-5 py-4">
        <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">
          Video Lectures
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          Curated study videos for every subject.
        </Text>
      </View>

      <FlatList
        data={VIDEOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Text className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
            Videos open in the YouTube app or your default browser.
          </Text>
        }
      />
    </SafeAreaView>
  );
}