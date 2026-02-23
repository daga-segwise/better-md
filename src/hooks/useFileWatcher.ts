import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

export function useFileWatcher(path: string | null, onChanged: () => void) {
  useEffect(() => {
    if (!path) return;

    let unlisten: (() => void) | null = null;

    invoke('watch_file', { path });

    listen<{ path: string }>('file-changed', (event) => {
      if (event.payload.path === path) {
        onChanged();
      }
    }).then((u) => {
      unlisten = u;
    });

    return () => {
      invoke('unwatch_file', { path });
      unlisten?.();
    };
  }, [path, onChanged]);
}
