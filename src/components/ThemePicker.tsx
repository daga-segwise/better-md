import type { Theme } from '../types';

interface Props {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

const themes: { value: Theme; color: string; border?: string }[] = [
  { value: 'light', color: '#ffffff', border: '1px solid #ccc' },
  { value: 'dark', color: '#1e1e1e' },
  { value: 'nord', color: '#2e3440' },
];

export default function ThemePicker({ theme, onThemeChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {themes.map((t) => (
        <button
          key={t.value}
          title={t.value}
          onClick={() => onThemeChange(t.value)}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: t.color,
            border: t.border || 'none',
            cursor: 'pointer',
            boxShadow: theme === t.value
              ? t.value === 'nord'
                ? '0 0 0 2px #88c0d0'
                : '0 0 0 2px var(--accent, #4a9eff)'
              : 'none',
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}
