import { lazy, Suspense, useState } from "react";
import { AppHeader, type AppSection } from "./components/app/AppHeader";
import { CatalogSidebar } from "./components/catalog/CatalogSidebar";
import { SenjerCityPage } from "./components/city/SenjerCityPage";
import { ExperimentControlPanel } from "./components/controls/ExperimentControlPanel";
import { GearControlPanel } from "./components/controls/GearControlPanel";
import { ExperimentSceneRouter } from "./components/experiments/ExperimentSceneRouter";
import { InfoPanel } from "./components/info/InfoPanel";
import { ExperimentQualityBadge } from "./components/quality/ExperimentQualityBadge";
import { TimeTravelPage } from "./components/timeTravel/TimeTravelPage";
import { getExperimentDefinition } from "./data/experiments/experimentRegistry";
import { useExperimentStore } from "./store/useExperimentStore";

const GearScene = lazy(async () => {
  const module = await import("./components/gear/GearScene");
  return { default: module.GearScene };
});

export function App() {
  const [catalogQuery, setCatalogQuery] = useState("");
  const [activeSection, setActiveSection] = useState<AppSection>("mechanics");
  const activeExperimentId = useExperimentStore((state) => state.activeExperimentId);
  const definition = getExperimentDefinition(activeExperimentId);

  return (
    <div className={activeSection === "mechanics" ? "app-shell" : "app-shell city-app-shell"}>
      <AppHeader query={catalogQuery} onQueryChange={setCatalogQuery} activeSection={activeSection} onSectionChange={setActiveSection} />

      {activeSection === "city" ? (
        <SenjerCityPage />
      ) : activeSection === "time-travel" ? (
        <TimeTravelPage />
      ) : (
        <main className="workspace">
          <CatalogSidebar query={catalogQuery} onQueryChange={setCatalogQuery} />
          <section className="lab-stage">
            <div className="lab-toolbar">
              <div><span className="lab-index">实验 {String(definition.index).padStart(2, "0")} · {definition.category}</span><h1>{definition.title}</h1></div>
              <div className="lab-toolbar-actions"><ExperimentQualityBadge experimentId={activeExperimentId} /><div className="lab-mode"><span className="lab-mode-dot" />交互实验模式</div></div>
            </div>
            <div className="scene-shell">
              {activeExperimentId === "gear-pair" ? (
                <Suspense fallback={<div className="scene-loading"><span />正在加载 3D 实验室…</div>}><GearScene /></Suspense>
              ) : (
                <ExperimentSceneRouter id={activeExperimentId} />
              )}
              <div className="scene-tip">{definition.sceneTip}</div>
            </div>
            {activeExperimentId === "gear-pair" ? <GearControlPanel /> : <ExperimentControlPanel />}
          </section>
          <InfoPanel experimentId={activeExperimentId} />
        </main>
      )}
    </div>
  );
}
