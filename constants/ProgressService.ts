import { DataService } from './DataService';

export interface TopicProgress {
  lastViewedAt: number;
  viewedCount: number;
}

const PROGRESS_FILE = 'progress';

export const ProgressService = {
  async recordView(topicId: string): Promise<void> {
    const progress = await DataService.read<Record<string, TopicProgress>>(PROGRESS_FILE, {});
    const current = progress[topicId] ?? { lastViewedAt: 0, viewedCount: 0 };
    progress[topicId] = { lastViewedAt: Date.now(), viewedCount: current.viewedCount + 1 };
    await DataService.write(PROGRESS_FILE, progress);
  },

  async getProgress(): Promise<Record<string, TopicProgress>> {
    return DataService.read<Record<string, TopicProgress>>(PROGRESS_FILE, {});
  },

  async getRecentlyViewed(limit = 5): Promise<{ topicId: string; lastViewedAt: number }[]> {
    const progress = await this.getProgress();
    return Object.entries(progress)
      .map(([topicId, value]) => ({ topicId, lastViewedAt: value.lastViewedAt }))
      .sort((a, b) => b.lastViewedAt - a.lastViewedAt)
      .slice(0, limit);
  },
};