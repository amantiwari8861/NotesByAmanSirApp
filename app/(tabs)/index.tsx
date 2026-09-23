import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NOTES_DATA, Subject } from '@/constants/NotesData';
import { ProgressService } from '@/constants/ProgressService';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AppLogo } from '@/components/AppLogo';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTopics, setRecentTopics] = useState<{ topicId: string; lastViewedAt: number }[]>([]);
  const [viewedTopics, setViewedTopics] = useState<Set<string>>(new Set());
  const router = useRouter();

  const refreshProgress = useCallback(async () => {
    const recent = await ProgressService.getRecentlyViewed(5);
    setRecentTopics(recent);
    const progress = await ProgressService.getProgress();
    setViewedTopics(new Set(Object.keys(progress)));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshProgress();
    }, [refreshProgress])
  );

  const findTopic = (topicId: string) => {
    for (const subject of NOTES_DATA) {
      const topic = subject.topics.find((t) => t.id === topicId);
      if (topic) return { subject, topic };
    }
    return null;
  };

  const filteredData = NOTES_DATA.filter(subject =>
    subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderSubject = ({ item }: { item: Subject }) => {
    const viewedCount = item.topics.filter((t) => viewedTopics.has(t.id)).length;
    const total = item.topics.length;
    const percent = total > 0 ? Math.round((viewedCount / total) * 100) : 0;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/subject/${item.id}`)}
        activeOpacity={0.7}
        className="mb-4 flex-row items-center p-5 rounded-2xl shadow-sm dark:shadow-none"
        style={{ backgroundColor: item.color + '15', borderWidth: 1, borderColor: item.color + '30' }}
      >
        <View
          className="w-14 h-14 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: item.color }}
        >
          <Ionicons name={item.icon as any} size={28} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-300">
            {item.description.length > 50 ? item.description.slice(0, 50) + '…' : item.description}
          </Text>
          <View className="mt-2 flex-row items-center">
            <View className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <View
                className="h-1.5 rounded-full"
                style={{ width: `${percent}%`, backgroundColor: item.color }}
              />
            </View>
            <Text className="ml-2 text-xs font-bold text-gray-500 dark:text-gray-400">
              {viewedCount}/{total}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={item.color} />
      </TouchableOpacity>
    );
  };

  const renderRecent = ({ item }: { item: { topicId: string; lastViewedAt: number } }) => {
    const found = findTopic(item.topicId);
    if (!found) return null;
    return (
      <Pressable
        onPress={() => router.push(`/topic/${found.subject.id}/${found.topic.id}`)}
        className="mr-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
        style={({ pressed }) => [{ width: 150, opacity: pressed ? 0.8 : 1 }]}
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center mb-2"
          style={{ backgroundColor: found.subject.color + '22' }}
        >
          <Ionicons name="time" size={16} color={found.subject.color} />
        </View>
        <Text numberOfLines={1} className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {found.topic.title}
        </Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {found.subject.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <View className="px-5 pt-8 pb-4 flex-row items-center justify-between">
        <AppLogo size={42} />
        <ThemeToggle />
      </View>

      {/* Modern Search Bar */}
      <View className="px-5 mb-6">
        <View className="flex-row items-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search subjects or topics..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base text-gray-900 dark:text-gray-100"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Continue Learning */}
      {recentTopics.length > 0 && (
        <View className="mb-6 px-5">
          <Text className="text-lg font-extrabold text-gray-900 dark:text-gray-50 mb-3">
            Continue Learning
          </Text>
          <FlatList
            data={recentTopics}
            renderItem={renderRecent}
            keyExtractor={(item) => item.topicId}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderSubject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-lg font-extrabold text-gray-900 dark:text-gray-50 mb-3">
              Subjects
            </Text>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center p-10">
          <Ionicons name="search-outline" size={60} color="#9ca3af" style={{ opacity: 0.5, marginBottom: 15 }} />
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">No results found</Text>
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-2">
            Try searching for a different keyword or subject.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}