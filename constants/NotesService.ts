import { DataService } from './DataService';

const NOTES_FILE = 'personal-notes';

export const NotesService = {
  async getNote(topicId: string): Promise<string> {
    const notes = await DataService.read<Record<string, string>>(NOTES_FILE, {});
    return notes[topicId] ?? '';
  },

  async saveNote(topicId: string, text: string): Promise<void> {
    const notes = await DataService.read<Record<string, string>>(NOTES_FILE, {});
    notes[topicId] = text;
    await DataService.write(NOTES_FILE, notes);
  },
};