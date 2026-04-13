import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookmarkService } from '@/constants/BookmarkService';
import { NOTES_DATA } from '@/constants/NotesData';

export default function BookmarksScreen() {
  const [bookmarkedTopics, setBookmarkedTopics] = useState<any[]>([]);
  const router = useRouter();

  // Refresh bookmarks whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async () => {
    const ids = await BookmarkService.getBookmarks();
    const allTopics: any[] = [];
    
    // Find matching topics across all subjects
    NOTES_DATA.forEach(subject => {
      subject.topics.forEach(topic => {
        if (ids.includes(topic.id)) {
          allTopics.push({ ...topic, subjectId: subject.id, subjectColor: subject.color });
        }
      });
    });
    
    setBookmarkedTopics(allTopics);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/topic/${item.subjectId}/${item.id}`)}
      activeOpacity={0.7}
      className="mb-4 flex-row items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: item.subjectColor + '20' }}
      >
        <Ionicons name="document-text" size={20} color={item.subjectColor} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {item.title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <View className="px-5 pt-8 pb-4">
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
          Bookmarks
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          Your saved technical documentation
        </Text>
      </View>
      
      {bookmarkedTopics.length > 0 ? (
        <FlatList
          data={bookmarkedTopics}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-10">
          <View className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full items-center justify-center mb-4 border border-gray-100 dark:border-gray-800">
            <Ionicons name="bookmark-outline" size={40} color="#9ca3af" />
          </View>
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No bookmarks yet
          </Text>
          <Text className="text-center text-gray-500 dark:text-gray-400 leading-6">
            Topics you bookmark will appear here for quick access offline.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
