import { Activity, BookOpen, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getExperimentDefinition } from "../../data/experiments/experimentRegistry";
import {
  getExperimentQuality,
  getExperimentQualityGate,
} from "../../data/experiments/qualityRecords";
import type { ExperimentId } from "../../types/experiment";
import { AnalysisView } from "./AnalysisView";
import { GenericAnalysisView } from "./GenericAnalysisView";
import { GenericKnowledgeView } from "./GenericKnowledgeView";
import { KnowledgeView } from "./KnowledgeView";
import { PartManualView } from "./PartManualView";
import { QualityView } from "./QualityView";

type InfoView = "analysis" | "parts" | "knowledge" | "quality";

export function InfoPanel({ experimentId }: { experimentId: ExperimentId }) {
  const [activeView, setActiveView] = useState<InfoView>("analysis");
  const scrollRef = useRef<HTMLDivElement>(null);
  const definition = getExperimentDefinition(experimentId);
  const quality = getExperimentQuality(experimentId);
  const gate = getExperimentQualityGate(experimentId);
  const hasPartManuals = (definition.partManuals?.length ?? 0) > 0;
  const infoTabs = [
    { id: "analysis" as const, label: "实验", icon: Activity },
    ...(hasPartManuals
      ? [{ id: "parts" as const, label: "零件", icon: Wrench }]
      : []),
    { id: "knowledge" as const, label: "知识", icon: BookOpen },
    { id: "quality" as const, label: "质量", icon: ShieldCheck },
  ];

  const heading =
    activeView === "analysis"
      ? { eyebrow: "实时分析", title: definition.title }
      : activeView === "parts"
        ? { eyebrow: "零件说明书", title: "选择、拆解与组装" }
        : activeView === "knowledge"
          ? { eyebrow: "结构化知识", title: "原理与工程边界" }
          : { eyebrow: "可信度档案", title: "模型与内容审查" };

  useEffect(() => {
    setActiveView("analysis");
  }, [experimentId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeView, experimentId]);

  return (
    <aside className="info-panel">
      <div className="info-panel-fixed">
        <div className="info-panel-head">
          <div>
            <div className="eyebrow">{heading.eyebrow}</div>
            <h2>{heading.title}</h2>
          </div>
          <span className={`live-badge ${activeView === "quality" ? "is-review" : ""}`}>
            <span />
            {gate.canRelease ? "RELEASED" : "PREVIEW"}
          </span>
        </div>

        <nav
          className={`info-view-tabs info-view-tabs-${infoTabs.length}`}
          aria-label="信息面板视图"
        >
          {infoTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={activeView === tab.id ? "is-active" : ""}
                onClick={() => setActiveView(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="info-panel-scroll" ref={scrollRef}>
        {activeView === "analysis" &&
          (experimentId === "gear-pair" ? (
            <AnalysisView />
          ) : (
            <GenericAnalysisView experimentId={experimentId} />
          ))}
        {activeView === "parts" && hasPartManuals && (
          <PartManualView experimentId={experimentId} />
        )}
        {activeView === "knowledge" &&
          (experimentId === "gear-pair" ? (
            <KnowledgeView />
          ) : (
            <GenericKnowledgeView experimentId={experimentId} />
          ))}
        {activeView === "quality" && <QualityView record={quality} gate={gate} />}
      </div>
    </aside>
  );
}
