import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookmarkService } from '@/constants/BookmarkService';
import { NOTES_DATA } from '@/constants/NotesData';
import { ProgressService } from '@/constants/ProgressService';
import { NotesService } from '@/constants/NotesService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function TopicContentScreen() {
  const { subjectId, topicId } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [myNote, setMyNote] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [noteEditorVisible, setNoteEditorVisible] = useState(false);
  const toastOpacity = useMemo(() => new Animated.Value(0), []);

  const isDark = colorScheme === 'dark';

  const { subject, topic } = useMemo(() => {
    const s = NOTES_DATA.find((item) => item.id === subjectId);
    const t = s?.topics.find((item) => item.id === topicId);
    return { subject: s, topic: t };
  }, [subjectId, topicId]);

  const baseStyle = useMemo(() => ({
    color: isDark ? '#e5e7eb' : '#4b5563',
    fontSize: 16,
  }), [isDark]);

  useEffect(() => {
    let active = true;
    if (topicId) {
      BookmarkService.isBookmarked(topicId as string).then((bookmarked) => {
        if (active) setIsBookmarked(bookmarked);
      });
      NotesService.getNote(topicId as string).then((note) => {
        if (active) setMyNote(note);
      });
      ProgressService.recordView(topicId as string);
    }
    return () => {
      active = false;
    };
  }, [topicId]);

  const showCustomToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const toggleBookmark = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await BookmarkService.toggleBookmark(topicId as string);
    setIsBookmarked(result);
    showCustomToast(result ? 'Added to Bookmarks' : 'Removed from Bookmarks');
  };

  if (!subject || !topic) {
    return (
      <View className="flex-1 items-center justify-center dark:bg-gray-950">
        <Text className="dark:text-white">Topic not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <Stack.Screen
        options={{
          title: topic.title,
          headerBackTitle: 'Topics',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: isDark ? '#030712' : 'white' },
          headerTintColor: isDark ? 'white' : '#1f2937',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={toggleBookmark} style={{ marginRight: 15 }}>
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={isBookmarked ? (isDark ? '#fbbf24' : '#f59e0b') : (isDark ? '#e5e7eb' : '#4b5563')}
                />
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          )
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          {topic.title}
        </Text>

        {(topic.quiz?.length || 0) > 0 || (topic.flashcards?.length || 0) > 0 ? (
          <View className="flex-row gap-3 mb-8">
            {(topic.quiz?.length || 0) > 0 && (
              <TouchableOpacity
                onPress={() => router.push(`/quiz/${subject.id}/${topic.id}` as Href)}
                activeOpacity={0.8}
                className="flex-1 flex-row items-center justify-center py-3 rounded-2xl bg-blue-600"
              >
                <Ionicons name="help-circle" size={18} color="white" />
                <Text className="text-white font-bold ml-2">Practice Quiz</Text>
              </TouchableOpacity>
            )}
            {(topic.flashcards?.length || 0) > 0 && (
              <TouchableOpacity
                onPress={() => router.push(`/flashcards/${subject.id}/${topic.id}` as Href)}
                activeOpacity={0.8}
                className="flex-1 flex-row items-center justify-center py-3 rounded-2xl bg-violet-600"
              >
                <Ionicons name="layers" size={18} color="white" />
                <Text className="text-white font-bold ml-2">Flashcards</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        <View className="mb-8">
          <Text style={{ ...baseStyle, lineHeight: 24 }}>{topic.content}</Text>
        </View>

        {topic.code && (
          <View className="mb-8">
            <Text className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Code Snippet
            </Text>
            <View className="bg-gray-900 dark:bg-black rounded-2xl p-4 border border-gray-800 dark:border-gray-700">
              <Text className="text-green-400 font-mono text-sm leading-6">
                {topic.code}
              </Text>
            </View>
          </View>
        )}

        {topic.images && topic.images.length > 0 && (
          <View className="mb-8">
            <Text className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Diagrams
            </Text>
            <Text className="italic text-gray-400 dark:text-gray-500">Diagrams available for this topic.</Text>
          </View>
        )}

        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              My Notes
            </Text>
            <TouchableOpacity
              onPress={() => {
                setNoteDraft(myNote);
                setNoteEditorVisible(true);
              }}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Ionicons name="create-outline" size={16} color="#3b82f6" />
              <Text className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400">
                {myNote ? 'Edit' : 'Add note'}
              </Text>
            </TouchableOpacity>
          </View>
          {myNote ? (
            <View
              className="p-4 rounded-2xl"
              style={{ backgroundColor: isDark ? '#111827' : '#f9fafb', borderWidth: 1, borderColor: isDark ? '#1f2937' : '#e5e7eb' }}
            >
              <Text className="text-gray-700 dark:text-gray-200 leading-6">{myNote}</Text>
            </View>
          ) : (
            <Text className="text-gray-400 dark:text-gray-600 italic">
              No personal note yet. Tap “Add note” to jot down your own summary.
            </Text>
          )}
        </View>
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={{
          opacity: toastOpacity,
          position: 'absolute',
          bottom: 100,
          left: '10%',
          right: '10%',
          backgroundColor: isDark ? '#1f2937' : '#111827',
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 20,
          zIndex: 9999
        }}
      >
        <Ionicons
          name={toastMessage.includes('Added') ? "checkmark-circle" : "trash-outline"}
          size={20}
          color="#10b981"
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          {toastMessage}
        </Text>
      </Animated.View>

      <Modal
        visible={noteEditorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteEditorVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: '#00000088' }}>
          <View
            className="rounded-t-3xl p-5"
            style={{ backgroundColor: isDark ? '#030712' : 'white' }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                My Note
              </Text>
              <TouchableOpacity onPress={() => setNoteEditorVisible(false)} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={28} color={isDark ? '#e5e7eb' : '#4b5563'} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={noteDraft}
              onChangeText={setNoteDraft}
              multiline
              placeholder="Write your own summary, doubts, or key points..."
              placeholderTextColor="#9ca3af"
              className="min-h-40 p-4 rounded-2xl text-base text-gray-900 dark:text-gray-100"
              style={{
                backgroundColor: isDark ? '#111827' : '#f3f4f6',
                textAlignVertical: 'top',
                minHeight: 160,
              }}
            />
            <TouchableOpacity
              onPress={async () => {
                const text = noteDraft.trim();
                await NotesService.saveNote(topicId as string, text);
                setMyNote(text);
                setNoteEditorVisible(false);
                showCustomToast(text ? 'Note saved' : 'Note cleared');
              }}
              activeOpacity={0.8}
              className="bg-blue-600 py-4 rounded-2xl items-center mt-4"
            >
              <Text className="text-white font-bold text-lg">Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
