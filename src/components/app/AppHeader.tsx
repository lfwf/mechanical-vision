import { BadgeCheck, Clock3, FlaskConical, Palette, Search, Sparkles } from "lucide-react";

export type AppSection = "mechanics" | "city" | "time-travel" | "shader-gallery";

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
        <div><div className="brand-title">机械视界</div><div className="brand-subtitle">互动原理实验与沉浸式数字作品</div></div>
      </div>
      <nav className="app-section-tabs" aria-label="主功能导航">
        <button type="button" className={activeSection === "mechanics" ? "is-active" : ""} onClick={() => onSectionChange("mechanics")}><FlaskConical size={16} />机械实验室</button>
        <button type="button" className={activeSection === "city" ? "is-active" : ""} onClick={() => onSectionChange("city")}><Sparkles size={16} />SENJER 六幕梦境</button>
        <button type="button" className={activeSection === "time-travel" ? "is-active" : ""} onClick={() => onSectionChange("time-travel")}><Clock3 size={16} />时间旅行浏览器</button>
        <button type="button" className={activeSection === "shader-gallery" ? "is-active" : ""} onClick={() => onSectionChange("shader-gallery")}><Palette size={16} />Shader 展厅</button>
      </nav>
      {mechanicsActive ? (
        <label className="header-search" role="search"><Search size={17} /><input aria-label="搜索机械原理" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索机构、零件或工作原理" /><kbd>目录</kbd></label>
      ) : activeSection === "city" ? (
        <div className="city-header-summary" aria-label="梦境章节状态"><span className="city-header-energy"><i /> 第一幕开放</span><strong>1 / 6</strong><span>梦境章节</span></div>
      ) : activeSection === "time-travel" ? (
        <div className="city-header-summary" aria-label="时间旅行范围"><span className="city-header-energy"><i /> 河谷城</span><strong>800–2080</strong><span>时间范围</span></div>
      ) : (
        <div className="city-header-summary" aria-label="Shader 作品数量"><span className="city-header-energy"><i /> 实时渲染</span><strong>4</strong><span>件作品</span></div>
      )}
      <div className="header-actions"><span className="version-badge"><BadgeCheck size={16} />可信模型框架 v0.3</span></div>
    </header>
  );
}
