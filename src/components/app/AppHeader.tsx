import { BadgeCheck, FlaskConical, Search, Sparkles } from "lucide-react";

export type AppSection = "mechanics" | "city";

interface AppHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

export function AppHeader({ query, onQueryChange, activeSection, onSectionChange }: AppHeaderProps) {
  const mechanicsActive = activeSection === "mechanics";

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true"><span className="brand-gear">⚙</span></div>
        <div>
          <div className="brand-title">机械视界</div>
          <div className="brand-subtitle">互动原理实验与沉浸式数字作品</div>
        </div>
      </div>

      <nav className="app-section-tabs" aria-label="主功能导航">
        <button type="button" className={mechanicsActive ? "is-active" : ""} onClick={() => onSectionChange("mechanics") }>
          <FlaskConical size={16} />机械实验室
        </button>
        <button type="button" className={!mechanicsActive ? "is-active" : ""} onClick={() => onSectionChange("city") }>
          <Sparkles size={16} />SENJER 六幕梦境
        </button>
      </nav>

      {mechanicsActive ? (
        <label className="header-search" role="search">
          <Search size={17} />
          <input aria-label="搜索机械原理" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索机构、零件或工作原理" />
          <kbd>目录</kbd>
        </label>
      ) : (
        <div className="city-header-summary" aria-label="梦境章节状态">
          <span className="city-header-energy"><i /> 第一幕开放</span>
          <strong>1 / 6</strong>
          <span>梦境章节</span>
        </div>
      )}

      <div className="header-actions">
        <span className="version-badge"><BadgeCheck size={16} />可信模型框架 v0.3</span>
      </div>
    </header>
  );
}
