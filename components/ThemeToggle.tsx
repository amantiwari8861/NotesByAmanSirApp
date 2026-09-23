import { TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function ThemeToggle() {
  const systemColorScheme = useColorScheme();
  const { colorScheme, toggleColorScheme } = useNativewindColorScheme();

  // Use nativewind's colorScheme which can be toggled manually,
  // fall back to system scheme on first render
  const isDark = colorScheme ? colorScheme === 'dark' : systemColorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={20}
        color={isDark ? '#fbbf24' : '#4b5563'}
      />
    </TouchableOpacity>
  );
}
