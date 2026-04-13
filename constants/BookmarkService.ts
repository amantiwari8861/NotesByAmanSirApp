import * as FileSystem from 'expo-file-system/legacy';

const BOOKMARKS_FILE = `${FileSystem.documentDirectory}bookmarks.json`;

export const BookmarkService = {
  async getBookmarks(): Promise<string[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(BOOKMARKS_FILE);
      if (!fileInfo.exists) {
        return [];
      }
      const content = await FileSystem.readAsStringAsync(BOOKMARKS_FILE);
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to load bookmarks', e);
      return [];
    }
  },

  async toggleBookmark(topicId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      const index = bookmarks.indexOf(topicId);
      
      let newBookmarks;
      let isBookmarked;
      
      if (index >= 0) {
        newBookmarks = bookmarks.filter(id => id !== topicId);
        isBookmarked = false;
      } else {
        newBookmarks = [...bookmarks, topicId];
        isBookmarked = true;
      }
      
      await FileSystem.writeAsStringAsync(BOOKMARKS_FILE, JSON.stringify(newBookmarks));
      return isBookmarked;
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
      return false;
    }
  },

  async isBookmarked(topicId: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks();
    return bookmarks.includes(topicId);
  }
};
