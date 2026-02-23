import { useMemo } from 'react';
import { renderMarkdown } from '../lib/markdown';
import { extractHeadings } from '../lib/toc';

export function useMarkdown(content: string) {
  const html = useMemo(() => renderMarkdown(content), [content]);
  const headings = useMemo(() => extractHeadings(content), [content]);

  return { html, headings };
}
