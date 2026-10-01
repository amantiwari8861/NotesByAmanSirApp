import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const DOCUMENT_DIR = FileSystem.documentDirectory ?? '';

const filePath = (name: string) => `${DOCUMENT_DIR}${name}.json`;

let memoryStorage: Record<string, string> | null = null;

function webStorage(): { get(key: string): string | null; set(key: string, value: string): void } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        get: (key) => window.localStorage.getItem(key),
        set: (key, value) => window.localStorage.setItem(key, value),
      };
    }
  } catch {
    // localStorage unavailable, fall through to in-memory
  }
  if (!memoryStorage) {
    memoryStorage = {};
  }
  return {
    get: (key) => memoryStorage?.[key] ?? null,
    set: (key, value) => {
      if (memoryStorage) {
        memoryStorage[key] = value;
      }
    },
  };
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    if (Platform.OS === 'web') {
      const value = webStorage().get(name);
      return value ? (JSON.parse(value) as T) : fallback;
    }
    const fileInfo = await FileSystem.getInfoAsync(filePath(name));
    if (!fileInfo.exists) {
      return fallback;
    }
    const content = await FileSystem.readAsStringAsync(filePath(name));
    return JSON.parse(content) as T;
  } catch (e) {
    console.error(`Failed to read ${name}`, e);
    return fallback;
  }
}

async function writeJson(name: string, value: unknown): Promise<void> {
  try {
    const content = JSON.stringify(value);
    if (Platform.OS === 'web') {
      webStorage().set(name, content);
      return;
    }
    await FileSystem.writeAsStringAsync(filePath(name), content);
  } catch (e) {
    console.error(`Failed to write ${name}`, e);
  }
}

export const DataService = {
  read<T>(name: string, fallback: T): Promise<T> {
    return readJson(name, fallback);
  },
  write(name: string, value: unknown): Promise<void> {
    return writeJson(name, value);
  },
};