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
                      item.status === "planned" ? "该实验将在后续版本开放" : item.title
                    }
                  >
                    <span className="catalog-item-icon">
                      <Icon size={18} />
                    </span>
                    <span className="catalog-item-copy">
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                    {item.status === "planned" ? (
                      <span className="planned-badge">规划中</span>
                    ) : (
                      <ChevronRight size={16} />
                    )}
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
        <span className="status-dot" />
        当前为基础框架版本，可继续接入 GLB 模型、动画与课程内容。
      </div>
    </aside>
  );
}
