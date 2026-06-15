import { Activity, BookOpen, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AnalysisView } from "./AnalysisView";
import { KnowledgeView } from "./KnowledgeView";
import { QualityView } from "./QualityView";

type InfoView = "analysis" | "knowledge" | "quality";

const infoTabs: Array<{
  id: InfoView;
  label: string;
  icon: typeof Activity;
}> = [
  { id: "analysis", label: "实验", icon: Activity },
  { id: "knowledge", label: "知识", icon: BookOpen },
  { id: "quality", label: "质量", icon: ShieldCheck },
];

const viewHeadings: Record<InfoView, { eyebrow: string; title: string }> = {
  analysis: { eyebrow: "实时分析", title: "传动结果" },
  knowledge: { eyebrow: "结构化知识", title: "原理与工程边界" },
  quality: { eyebrow: "可信度档案", title: "模型与内容审查" },
};

export function InfoPanel() {
  const [activeView, setActiveView] = useState<InfoView>("analysis");
  const heading = viewHeadings[activeView];

  return (
    <aside className="info-panel">
      <div className="info-panel-head">
        <div>
          <div className="eyebrow">{heading.eyebrow}</div>
          <h2>{heading.title}</h2>
        </div>
        <span className={`live-badge ${activeView === "quality" ? "is-review" : ""}`}>
          <span />
          {activeView === "quality" ? "PREVIEW" : "LIVE"}
        </span>
      </div>

      <nav className="info-view-tabs" aria-label="信息面板视图">
        {infoTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={activeView === tab.id ? "is-active" : ""}
              onClick={() => setActiveView(tab.id)}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeView === "analysis" && <AnalysisView />}
      {activeView === "knowledge" && <KnowledgeView />}
      {activeView === "quality" && <QualityView />}
    </aside>
  );
}
