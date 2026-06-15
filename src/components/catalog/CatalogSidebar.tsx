import { ChevronRight, FlaskConical, Search } from "lucide-react";
import { useMemo } from "react";
import { labCatalog } from "../../data/catalog";

interface CatalogSidebarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function CatalogSidebar({ query, onQueryChange }: CatalogSidebarProps) {
  const categories = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return labCatalog;

    return labCatalog
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          `${item.title}${item.subtitle}`.toLowerCase().includes(keyword),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [query]);

  return (
    <aside className="catalog-sidebar">
      <div className="sidebar-heading">
        <div>
          <div className="eyebrow">知识目录</div>
          <h2>机械原理实验室</h2>
        </div>
        <div className="sidebar-count">01 / 09</div>
      </div>

      <label className="sidebar-search">
        <Search size={15} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="筛选实验"
        />
      </label>

      <div className="catalog-scroll">
        {categories.map((category) => (
          <section className="catalog-section" key={category.id}>
            <h3>{category.title}</h3>
            <div className="catalog-items">
              {category.items.map((item) => {
                const Icon = item.icon;
                const active = item.id === "gear-pair";

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`catalog-item ${active ? "is-active" : ""}`}
                    disabled={item.status === "planned"}
                    title={
                      item.status === "planned"
                        ? "该实验尚未进入模型与内容审核"
                        : item.title
                    }
                  >
                    <span className="catalog-item-icon">
                      <Icon size={18} />
                    </span>
                    <span className="catalog-item-copy">
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                    {item.status === "planned" && (
                      <span className="planned-badge">规划中</span>
                    )}
                    {item.status === "preview" && (
                      <span className="review-badge">审查中</span>
                    )}
                    {item.status === "released" && <ChevronRight size={16} />}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {categories.length === 0 && (
          <div className="empty-search">
            <FlaskConical size={24} />
            <p>没有匹配的实验</p>
          </div>
        )}
      </div>

      <div className="sidebar-footnote">
        <span className="status-dot status-dot-review" />
        当前齿轮实验为公开预览版。独立模型审核、内容审核和实体干涉扫描完成前，不标记为正式发布。
      </div>
    </aside>
  );
}
