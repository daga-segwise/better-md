import type { Tab } from '../types';

interface Props {
  tabs: Tab[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onClose: (index: number) => void;
}

export default function TabBar({ tabs, activeIndex, onSelect, onClose }: Props) {
  if (tabs.length === 0) return null;

  return (
    <div className="tab-bar">
      {tabs.map((tab, i) => (
        <div
          key={tab.path}
          className={`tab ${i === activeIndex ? 'active' : ''}`}
          onClick={() => onSelect(i)}
        >
          <span>{tab.name}</span>
          <button
            className="tab-close"
            onClick={(e) => { e.stopPropagation(); onClose(i); }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
