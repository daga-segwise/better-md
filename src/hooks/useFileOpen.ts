import { useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';

const MD_EXTENSIONS = ['.md', '.markdown', '.mdx'];

function isMarkdownFile(path: string): boolean {
  return MD_EXTENSIONS.some((ext) => path.toLowerCase().endsWith(ext));
}

export function useFileOpen(onFileOpened: (path: string, content: string) => void) {
  useEffect(() => {
    const unlisteners: (() => void)[] = [];

    listen<{ paths: string[] }>('file-opened', async (event) => {
      for (const path of event.payload.paths) {
        const content = await invoke<string>('read_file', { path });
        onFileOpened(path, content);
      }
    }).then((u) => unlisteners.push(u));

    listen<{ paths: string[] }>('tauri://drag-drop', async (event) => {
      const mdPaths = event.payload.paths.filter(isMarkdownFile);
      for (const path of mdPaths) {
        const content = await invoke<string>('read_file', { path });
        onFileOpened(path, content);
      }
    }).then((u) => unlisteners.push(u));

    return () => {
      unlisteners.forEach((u) => u());
    };
  }, [onFileOpened]);

  const openFile = useCallback(async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'mdx'] }],
    });
    if (selected) {
      const path = typeof selected === 'string' ? selected : selected;
      const content = await invoke<string>('read_file', { path });
      onFileOpened(path as string, content);
    }
  }, [onFileOpened]);

  return { openFile };
}
