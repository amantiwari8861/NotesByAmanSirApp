import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import RenderHtml from 'react-native-render-html';
// If the above fails, uncomment the following line and comment the above:
// import RenderHtml from 'react-native-render-html/lib/commonjs/index';
import { NOTES_DATA } from '@/constants/NotesData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useColorScheme } from 'nativewind';
import { BookmarkService } from '@/constants/BookmarkService';
import { useState, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

const MemoizedHtml = React.memo(({ source, width, isDark, baseStyle }: any) => {
  return (
    <RenderHtml
      contentWidth={width}
      source={source}
      baseStyle={baseStyle}
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.source.html === nextProps.source.html &&
    prevProps.width === nextProps.width &&
    prevProps.isDark === nextProps.isDark
  );
});

export default function TopicContentScreen() {
  const { subjectId, topicId } = useLocalSearchParams();
  const { width: windowWidth } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useMemo(() => new Animated.Value(0), []);

  const isDark = colorScheme === 'dark';

  const { subject, topic } = useMemo(() => {
    const s = NOTES_DATA.find((item) => item.id === subjectId);
    const t = s?.topics.find((item) => item.id === topicId);
    return { subject: s, topic: t };
  }, [subjectId, topicId]);

  const source = useMemo(() => {
    if (!topic) return { html: '' };
    return {
      html: `<div style="line-height: 24px;">${topic.content}</div>`
    };
  }, [topic]);

  const baseStyle = useMemo(() => ({
    color: isDark ? '#e5e7eb' : '#4b5563',
    fontSize: 16,
  }), [isDark]);

  const contentWidth = useMemo(() => windowWidth - 40, [windowWidth]);

  useEffect(() => {
    if (topicId) checkBookmark();
  }, [topicId]);

  const checkBookmark = async () => {
    const bookmarked = await BookmarkService.isBookmarked(topicId as string);
    setIsBookmarked(bookmarked);
  };

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

        <View className="mb-8">
          <MemoizedHtml
            source={source}
            width={contentWidth}
            isDark={isDark}
            baseStyle={baseStyle}
          />
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
    </SafeAreaView>
  );
}
