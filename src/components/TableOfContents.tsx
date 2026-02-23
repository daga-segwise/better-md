import { useEffect, useRef, useState } from 'react';
import type { Heading } from '../types';

interface Props {
  headings: Heading[];
  visible: boolean;
}

export default function TableOfContents({ headings, visible }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0.1 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`toc-sidebar ${visible ? 'visible' : ''}`}>
      <div className="toc-title">Contents</div>
      <nav>
        {headings.map((h, i) => (
          <a
            key={`${h.id}-${i}`}
            href={`#${h.id}`}
            data-level={h.level}
            className={`toc-link toc-level-${h.level}${activeId === h.id ? ' active' : ''}`}
            onClick={(e) => handleClick(e, h.id)}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
