import { DataService } from './DataService';

const BOOKMARKS_FILE = 'bookmarks';

export const BookmarkService = {
  async getBookmarks(): Promise<string[]> {
    const bookmarks = await DataService.read<string[]>(BOOKMARKS_FILE, []);
    return Array.isArray(bookmarks) ? bookmarks : [];
  },

  async toggleBookmark(topicId: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks();
    const index = bookmarks.indexOf(topicId);

    let newBookmarks;
    let isBookmarked;

    if (index >= 0) {
      newBookmarks = bookmarks.filter((id) => id !== topicId);
      isBookmarked = false;
    } else {
      newBookmarks = [...bookmarks, topicId];
      isBookmarked = true;
    }

    await DataService.write(BOOKMARKS_FILE, newBookmarks);
    return isBookmarked;
  },

  async isBookmarked(topicId: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks();
    return bookmarks.includes(topicId);
  },
};