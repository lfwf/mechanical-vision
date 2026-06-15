import { BadgeCheck, Search } from "lucide-react";

interface AppHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function AppHeader({ query, onQueryChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-gear">⚙</span>
        </div>
        <div>
          <div className="brand-title">机械视界</div>
          <div className="brand-subtitle">互动式 3D 机械原理百科</div>
        </div>
      </div>

      <label className="header-search" role="search">
        <Search size={17} />
        <input
          aria-label="搜索机械原理"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜索机构、零件或工作原理"
        />
        <kbd>目录</kbd>
      </label>

      <div className="header-actions">
        <span className="version-badge">
          <BadgeCheck size={16} />
          基础框架 v0.1
        </span>
      </div>
    </header>
  );
}
