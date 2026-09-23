import * as FileSystem from 'expo-file-system/legacy';

const DOCUMENT_DIR = `${FileSystem.documentDirectory}`;

const filePath = (name: string) => `${DOCUMENT_DIR}${name}.json`;

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
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
    await FileSystem.writeAsStringAsync(filePath(name), JSON.stringify(value));
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