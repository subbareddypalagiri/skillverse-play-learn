import apiClient from '@/lib/apiClient';

export interface AIToolItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  link: string;
  features: string[];
  isFree: boolean;
  source?: 'curated' | 'huggingface' | 'huggingface-space';
  isLatest?: boolean;
  pipeline?: string;
  author?: string;
  downloads?: number;
  lastSynced?: string;
}

export interface AIToolsMeta {
  total: number;
  curated: number;
  scraped: number;
  latest: number;
  lastSynced: string | null;
  syncInProgress: boolean;
}

export interface AIToolCategory {
  name: string;
  count: number;
}

export const fetchAITools = async (params?: {
  category?: string;
  search?: string;
  source?: string;
  latest?: boolean;
}): Promise<AIToolItem[]> => {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.source) query.set('source', params.source);
  if (params?.latest) query.set('latest', 'true');
  query.set('limit', '500');

  const res = await apiClient.get(`/ai-tools?${query.toString()}`);
  return res.data?.data?.tools ?? res.data?.tools ?? [];
};

export const fetchAIToolCategories = async (): Promise<AIToolCategory[]> => {
  const res = await apiClient.get('/ai-tools/categories');
  return res.data?.data?.categories ?? res.data?.categories ?? [];
};

export const fetchAIToolsMeta = async (): Promise<AIToolsMeta | null> => {
  const res = await apiClient.get('/ai-tools/meta');
  return res.data?.data ?? res.data ?? null;
};

export const syncAITools = async () => {
  const res = await apiClient.post('/ai-tools/sync');
  return res.data?.data ?? res.data;
};
