import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme(): 'light' | 'dark' {
  return useNativewindColorScheme().colorScheme ?? 'light';
}