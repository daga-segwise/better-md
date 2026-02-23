import type { Theme } from '../types';
import ThemePicker from './ThemePicker';

interface Props {
  title: string;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  tocVisible: boolean;
  onToggleToc: () => void;
  onOpenFile: () => void;
}

export default function Toolbar({ title, theme, onThemeChange, tocVisible, onToggleToc, onOpenFile }: Props) {
  return (
    <div className="toolbar">
      <div className="toolbar-title">{title}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <ThemePicker theme={theme} onThemeChange={onThemeChange} />
        <button
          className={`toolbar-btn${tocVisible ? ' active' : ''}`}
          onClick={onToggleToc}
          title="Toggle Table of Contents"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="13" y2="6" />
            <line x1="3" y1="12" x2="13" y2="12" />
            <line x1="3" y1="18" x2="13" y2="18" />
            <line x1="17" y1="6" x2="21" y2="6" />
            <line x1="17" y1="12" x2="21" y2="12" />
            <line x1="17" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button className="toolbar-btn" onClick={onOpenFile} title="Open File">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
