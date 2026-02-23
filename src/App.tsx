import { useState, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useTheme } from './hooks/useTheme';
import { useMarkdown } from './hooks/useMarkdown';
import { useFileOpen } from './hooks/useFileOpen';
import { useFileWatcher } from './hooks/useFileWatcher';
import type { Tab } from './types';
import Toolbar from './components/Toolbar';
import TabBar from './components/TabBar';
import TableOfContents from './components/TableOfContents';
import MarkdownView from './components/MarkdownView';
import EmptyState from './components/EmptyState';

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tocVisible, setTocVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  const activeTab = tabs[activeIndex] || null;
  const { html, headings } = useMarkdown(activeTab?.content || '');

  const handleFileOpened = useCallback((path: string, content: string) => {
    setTabs((prev) => {
      const existing = prev.findIndex((t) => t.path === path);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], content };
        // Use setTimeout to avoid batching issues with setActiveIndex inside setTabs
        setTimeout(() => setActiveIndex(existing), 0);
        return updated;
      }
      const newTab: Tab = { path, name: path.split('/').pop()!, content };
      setTimeout(() => setActiveIndex(prev.length), 0);
      return [...prev, newTab];
    });
  }, []);

  const handleTabClose = useCallback((index: number) => {
    setTabs((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setActiveIndex((ai) => {
        if (next.length === 0) return 0;
        if (index < ai) return ai - 1;
        if (index === ai) return Math.min(ai, next.length - 1);
        return ai;
      });
      return next;
    });
  }, []);

  const handleFileChanged = useCallback(() => {
    if (!activeTab) return;
    invoke<string>('read_file', { path: activeTab.path }).then((content) => {
      setTabs((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((t) => t.path === activeTab.path);
        if (idx !== -1) updated[idx] = { ...updated[idx], content };
        return updated;
      });
    });
  }, [activeTab]);

  const { openFile } = useFileOpen(handleFileOpened);
  useFileWatcher(activeTab?.path || null, handleFileChanged);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'o') {
        e.preventDefault();
        openFile();
      } else if (e.metaKey && e.key === 'w') {
        e.preventDefault();
        if (tabs.length > 0) handleTabClose(activeIndex);
      } else if (e.metaKey && e.shiftKey && e.key === 't') {
        e.preventDefault();
        setTocVisible((v) => !v);
      } else if (e.metaKey && e.key === '1') {
        e.preventDefault();
        setTheme('light');
      } else if (e.metaKey && e.key === '2') {
        e.preventDefault();
        setTheme('dark');
      } else if (e.metaKey && e.key === '3') {
        e.preventDefault();
        setTheme('nord');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openFile, tabs.length, activeIndex, handleTabClose, setTheme]);

  return (
    <div className="app-container">
      <Toolbar
        title="Better MD"
        theme={theme}
        onThemeChange={setTheme}
        tocVisible={tocVisible}
        onToggleToc={() => setTocVisible((v) => !v)}
        onOpenFile={openFile}
      />
      {tabs.length > 0 && (
        <TabBar
          tabs={tabs}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onClose={handleTabClose}
        />
      )}
      <div className="content-area">
        <TableOfContents headings={headings} visible={tocVisible} />
        <main className="main-content">
          {activeTab ? <MarkdownView html={html} /> : <EmptyState />}
        </main>
      </div>
    </div>
  );
}
