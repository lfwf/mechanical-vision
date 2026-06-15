import { ChevronRight, FlaskConical, Search } from "lucide-react";
import { useMemo } from "react";
import { labCatalog } from "../../data/catalog";
import { useExperimentStore } from "../../store/useExperimentStore";

interface CatalogSidebarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function CatalogSidebar({ query, onQueryChange }: CatalogSidebarProps) {
  const activeExperimentId = useExperimentStore((state) => state.activeExperimentId);
  const selectExperiment = useExperimentStore((state) => state.selectExperiment);
  const allItems = labCatalog.flatMap((category) => category.items);
  const activeIndex = allItems.findIndex((item) => item.id === activeExperimentId) + 1;

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
        <div className="sidebar-count">
          {String(activeIndex).padStart(2, "0")} / {String(allItems.length).padStart(2, "0")}
        </div>
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
                const active = item.id === activeExperimentId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`catalog-item ${active ? "is-active" : ""}`}
                    onClick={() => selectExperiment(item.id)}
                    title={`${item.title} · ${item.status === "released" ? "已发布" : "预览审查中"}`}
                  >
                    <span className="catalog-item-icon">
                      <Icon size={18} />
                    </span>
                    <span className="catalog-item-copy">
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                    {item.status === "preview" && (
                      <span className="review-badge">预览</span>
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
        9 个实验均可交互查看。未完成独立模型与内容审核的实验统一标记为预览版，不作为工程设计依据。
      </div>
    </aside>
  );
}
