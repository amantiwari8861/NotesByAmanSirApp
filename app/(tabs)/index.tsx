import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NOTES_DATA, Subject } from '@/constants/NotesData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AppLogo } from '@/components/AppLogo';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredData = NOTES_DATA.filter(subject => 
    subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderSubject = ({ item }: { item: Subject }) => (
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
        <Text className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={item.color} />
    </TouchableOpacity>
  );

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

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderSubject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
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
