export interface Tab {
  path: string;
  name: string;
  content: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export type Theme = 'light' | 'dark' | 'nord';
