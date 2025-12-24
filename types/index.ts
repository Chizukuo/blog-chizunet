export interface User {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface Post {
  id: number;
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  labels: Label[];
  user: User;
  html_url: string;
  slug: string;
  description?: string;
  coverImage?: string;
  lang?: Locale;
}

export type Locale = 'zh' | 'en' | 'ja';
