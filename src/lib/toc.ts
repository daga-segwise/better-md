import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { slugify } from './markdown';
import type { Heading } from '../types';

const md = new MarkdownIt();
md.use(anchor, { slugify });

export function extractHeadings(content: string): Heading[] {
  const tokens = md.parse(content, {});
  const headings: Heading[] = [];
  const slugCounts = new Map<string, number>();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1), 10);
      if (level > 3) continue;
      const inline = tokens[i + 1];
      if (inline && inline.type === 'inline') {
        const text = inline.content;
        let id = slugify(text);
        const count = slugCounts.get(id) || 0;
        slugCounts.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;
        headings.push({ id, text, level });
      }
    }
  }

  return headings;
}
