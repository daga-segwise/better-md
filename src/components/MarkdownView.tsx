import { useEffect, useRef } from 'react';
import { openUrl } from '@tauri-apps/plugin-opener';

interface Props {
  html: string;
}

export default function MarkdownView({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.href && anchor.href.startsWith('http')) {
        e.preventDefault();
        openUrl(anchor.href);
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="markdown-body"
      style={{ overflowY: 'auto', flex: 1 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
