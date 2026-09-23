import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NOTES_DATA } from '@/constants/NotesData';
import { DataService } from '@/constants/DataService';
import { useColorScheme } from '@/hooks/use-color-scheme';

const RESULTS_FILE = 'quiz-results';

type Result = {
  question: string;
  options: string[];
  selected: number;
  correct: number;
  explanation: string;
};

export default function QuizScreen() {
  const { subjectId, topicId } = useLocalSearchParams<{ subjectId: string; topicId: string }>();
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  const quiz = useMemo(() => {
    const subject = NOTES_DATA.find((s) => s.id === subjectId);
    const topic = subject?.topics.find((t) => t.id === topicId);
    return topic?.quiz ?? [];
  }, [subjectId, topicId]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const question = quiz[current];
  const total = quiz.length;

  const finish = async () => {
    setFinished(true);
    const all = DataService.read<Record<string, number>>(RESULTS_FILE, {});
    const stored = await all;
    const previous = stored[topicId!] ?? score;
    const best = Math.max(previous, score);
    stored[topicId!] = best;
    await DataService.write(RESULTS_FILE, stored);
    setBestScore(best);
  };

  const selectOption = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === question.answerIndex;
    if (correct) setScore((s) => s + 1);
    setResults((r) => [
      ...r,
      {
        question: question.question,
        options: question.options,
        selected: index,
        correct: question.answerIndex,
        explanation: question.explanation,
      },
    ]);
  };

  const next = () => {
    if (current + 1 >= total) {
      finish();
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setResults([]);
    setFinished(false);
  };

  if (total === 0) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <View className="flex-1 items-center justify-center p-10">
          <Ionicons name="help-circle-outline" size={60} color="#9ca3af" />
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-4">
            No quiz available
          </Text>
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-2">
            This topic does not have practice questions yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    const percentage = Math.round((score / total) * 100);
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <Stack.Screen options={{ title: 'Quiz Results', headerBackTitle: 'Topic' }} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          <View className="items-center py-6">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: percentage >= 60 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444' }}
            >
              <Text className="text-3xl font-bold text-white">{percentage}%</Text>
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {score} / {total} correct
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-1">
              {bestScore !== null ? `Best score: ${bestScore} / ${total}` : 'Keep practicing!'}
            </Text>
          </View>

          <View className="mb-6">
            {results.map((r, i) => {
              const isCorrect = r.selected === r.correct;
              return (
                <View
                  key={i}
                  className="mb-3 p-4 rounded-xl border"
                  style={{
                    backgroundColor: isCorrect ? '#10b98122' : '#ef444420',
                    borderColor: isCorrect ? '#10b98144' : '#ef444444',
                  }}
                >
                  <Text className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {i + 1}. {r.question}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-300">
                    Your answer: {r.selected < r.options.length ? r.options[r.selected] : '-'}{' '}
                    {isCorrect ? '✓' : '✗'}
                  </Text>
                  {!isCorrect && (
                    <Text className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Correct: {r.correct < r.options.length ? r.options[r.correct] : '-'}
                    </Text>
                  )}
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">{r.explanation}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={restart}
            className="bg-blue-600 py-4 rounded-2xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Retake Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-4 rounded-2xl items-center mt-3 border border-gray-200 dark:border-gray-700"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 dark:text-gray-200 font-bold text-lg">Back to Topic</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      <Stack.Screen options={{ title: 'Practice Quiz', headerBackTitle: 'Topic' }} />
      <View className="flex-1 p-5">
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-bold text-gray-400 dark:text-gray-500">
              Question {current + 1} of {total}
            </Text>
            <Text className="text-sm font-bold text-gray-400 dark:text-gray-500">Score: {score}</Text>
          </View>
          <View className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <View
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${((current + (selected !== null ? 1 : 0)) / total) * 100}%` }}
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-7">
            {question.question}
          </Text>

          {question.options.map((option, index) => {
            let bg = isDark ? '#1f2937' : '#f3f4f6';
            let text = isDark ? '#e5e7eb' : '#374151';
            let border = 'transparent';
            if (selected !== null) {
              if (index === question.answerIndex) {
                bg = isDark ? '#065f46' : '#d1fae5';
                text = isDark ? '#d1fae5' : '#065f46';
                border = '#10b981';
              } else if (index === selected) {
                bg = isDark ? '#7f1d1d' : '#fee2e2';
                text = isDark ? '#fecaca' : '#991b1b';
                border = '#ef4444';
              } else {
                bg = isDark ? '#1f2937' : '#f3f4f6';
                text = isDark ? '#6b7280' : '#9ca3af';
              }
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => selectOption(index)}
                disabled={selected !== null}
                activeOpacity={0.8}
                className="mb-3 p-4 rounded-2xl border"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: bg, borderWidth: 1, borderColor: text }}
                  >
                    <Text className="font-bold" style={{ color: text }}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text className="flex-1 text-base font-medium" style={{ color: text }}>
                    {option}
                  </Text>
                  {selected !== null && index === question.answerIndex && (
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  )}
                  {selected !== null && index === selected && index !== question.answerIndex && (
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {selected !== null && (
            <View className="mb-6 p-4 rounded-xl" style={{ backgroundColor: isDark ? '#111827' : '#f9fafb', borderWidth: 1, borderColor: isDark ? '#1f2937' : '#e5e7eb' }}>
              <Text className="text-green-600 dark:text-green-400 font-bold mb-1">
                {selected === question.answerIndex ? 'Correct!' : 'Not quite.'}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300 leading-5">
                {question.explanation}
              </Text>
            </View>
          )}
        </ScrollView>

        {selected !== null && (
          <TouchableOpacity
            onPress={next}
            className="bg-blue-600 py-4 rounded-2xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">
              {current + 1 >= total ? 'See Results' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}