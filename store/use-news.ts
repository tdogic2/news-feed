import { create } from "zustand";

export type ArticleType = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
};

export type NewsType = {
  articles: ArticleType[];
  addArticles: (articles: ArticleType[]) => void;
};

export const useNews = create<NewsType, []>(
  (set): NewsType => ({
    articles: [],
    addArticles: (articles: ArticleType[]) => set({ articles }),
  })
);
