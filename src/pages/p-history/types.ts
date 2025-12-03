

export interface HistoryItem {
  id: string;
  contentId: string;
  title: string;
  description: string;
  emotion: string;
  time: string;
  thumbnail: string;
  isCollected: boolean;
}

export type SortOrder = 'desc' | 'asc';

export type DateRange = '' | 'today' | 'week' | 'month' | 'quarter';

