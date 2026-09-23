import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NOTES_DATA } from '@/constants/NotesData';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FlashcardsScreen() {
  const { subjectId, topicId } = useLocalSearchParams<{ subjectId: string; topicId: string }>();
  const isDark = useColorScheme() === 'dark';

  const cards = useMemo(() => {
    const subject = NOTES_DATA.find((s) => s.id === subjectId);
    const topic = subject?.topics.find((t) => t.id === topicId);
    return topic?.flashcards ?? [];
  }, [subjectId, topicId]);

  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipValue = useMemo(() => new Animated.Value(0), []);

  const flip = () => {
    Animated.timing(flipValue, {
      toValue: flipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const goTo = (index: number) => {
    setCurrent(index);
    setFlipped(false);
    flipValue.setValue(0);
  };

  const shuffle = () => {
    const random = [...order];
    for (let i = random.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [random[i], random[j]] = [random[j], random[i]];
    }
    setOrder(random);
    goTo(0);
  };

  if (cards.length === 0) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <View className="flex-1 items-center justify-center p-10">
          <Ionicons name="layers-outline" size={60} color="#9ca3af" />
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-4">
            No flashcards available
          </Text>
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-2">
            This topic has no flashcard deck yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const card = cards[order[current]];
  const frontInterpolate = flipValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipValue.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      <Stack.Screen options={{ title: 'Flashcards', headerBackTitle: 'Topic' }} />
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-sm font-bold text-gray-400 dark:text-gray-500">
            Card {current + 1} of {cards.length}
          </Text>
          <TouchableOpacity onPress={shuffle} activeOpacity={0.7} className="flex-row items-center">
            <Ionicons name="shuffle" size={16} color="#3b82f6" />
            <Text className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400">Shuffle</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center">
          <TouchableOpacity onPress={flip} activeOpacity={0.95}>
            <Animated.View
              style={{
                transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                backfaceVisibility: 'hidden',
              }}
            >
              <View
                className="justify-center rounded-3xl p-8 min-h-72"
                style={{
                  backgroundColor: isDark ? '#111827' : '#f3f4f6',
                  borderWidth: 1,
                  borderColor: isDark ? '#1f2937' : '#e5e7eb',
                  minHeight: 288,
                }}
              >
                <Text className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  QUESTION
                </Text>
                <Text className="text-center text-2xl font-bold text-gray-900 dark:text-white leading-9">
                  {card.front}
                </Text>
                <Text className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
                  Tap card to reveal answer
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                backfaceVisibility: 'hidden',
              }}
            >
              <View
                className="rounded-3xl p-8"
                style={{
                  backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
                  borderWidth: 1,
                  borderColor: isDark ? '#3b82f6' : '#bfdbfe',
                  minHeight: 288,
                  justifyContent: 'center',
                }}
              >
                <Text className="text-center text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                  ANSWER
                </Text>
                <Text className="text-center text-xl font-bold text-gray-900 dark:text-white leading-8">
                  {card.back}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-6">
          <TouchableOpacity
            onPress={() => goTo(Math.max(0, current - 1))}
            disabled={current === 0}
            activeOpacity={0.7}
            className="w-32 py-3 rounded-2xl items-center border border-gray-200 dark:border-gray-700"
            style={{ opacity: current === 0 ? 0.4 : 1 }}
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#e5e7eb' : '#374151'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goTo(current >= cards.length - 1 ? 0 : current + 1)}
            activeOpacity={0.7}
            className="w-32 py-3 rounded-2xl items-center bg-blue-600"
          >
            <Text className="text-white font-bold">
              {current >= cards.length - 1 ? 'Restart' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}