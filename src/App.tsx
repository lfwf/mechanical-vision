import { lazy, Suspense, useState } from "react";
import { AppHeader } from "./components/app/AppHeader";
import { CatalogSidebar } from "./components/catalog/CatalogSidebar";
import { GearControlPanel } from "./components/controls/GearControlPanel";
import { InfoPanel } from "./components/info/InfoPanel";
import { ExperimentQualityBadge } from "./components/quality/ExperimentQualityBadge";

const GearScene = lazy(async () => {
  const module = await import("./components/gear/GearScene");
  return { default: module.GearScene };
});

export function App() {
  const [catalogQuery, setCatalogQuery] = useState("");

  return (
    <div className="app-shell">
      <AppHeader query={catalogQuery} onQueryChange={setCatalogQuery} />
      <main className="workspace">
        <CatalogSidebar query={catalogQuery} onQueryChange={setCatalogQuery} />

        <section className="lab-stage">
          <div className="lab-toolbar">
            <div>
              <span className="lab-index">实验 01 · 传动机构</span>
              <h1>外啮合直齿圆柱齿轮</h1>
            </div>
            <div className="lab-toolbar-actions">
              <ExperimentQualityBadge />
              <div className="lab-mode">
                <span className="lab-mode-dot" />
                交互实验模式
              </div>
            </div>
          </div>

          <div className="scene-shell">
            <Suspense
              fallback={
                <div className="scene-loading">
                  <span />
                  正在加载 3D 实验室…
                </div>
              }
            >
              <GearScene />
            </Suspense>
            <div className="scene-tip">
              拖拽旋转 · 滚轮缩放 · 点击齿轮查看对应说明
            </div>
          </div>

          <GearControlPanel />
        </section>

        <InfoPanel />
      </main>
    </div>
  );
}
