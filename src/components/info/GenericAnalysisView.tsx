import { Boxes, Calculator, Info, Wrench } from "lucide-react";
import { getExperimentDefinition } from "../../data/experiments/experimentRegistry";
import { useExperimentStore } from "../../store/useExperimentStore";
import type { ExperimentId } from "../../types/experiment";

export function GenericAnalysisView({ experimentId }: { experimentId: ExperimentId }) {
  const speed = useExperimentStore((state) => state.speed);
  const primary = useExperimentStore((state) => state.primary);
  const secondary = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const direction = useExperimentStore((state) => state.direction);
  const definition = getExperimentDefinition(experimentId);
  const values = { speed, primary, secondary, variant, direction };
  const metrics = definition.getMetrics(values);

  return (
    <>
      <div className="metric-grid generic-metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <Info size={18} />
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </article>
        ))}
      </div>

      <section className="teaching-summary">
        <div className="section-title-row">
          <Info size={17} />
          <h3>当前观察结论</h3>
        </div>
        <p>{definition.getConclusion(values)}</p>
        <p className="scope-warning">
          当前实验等级为 {definition.precisionLevel} · {definition.precisionLabel}。页面只在已声明范围内解释结构和运动，不替代设计、选型、强度或安全判断。
        </p>
      </section>

      <section className="generic-parts-section">
        <div className="section-title-row">
          <Boxes size={17} />
          <h3>组成与作用</h3>
        </div>
        <div className="generic-parts-list">
          {definition.parts.map((part) => (
            <article key={part.name}>
              <strong>{part.name}</strong>
              <p>{part.role}</p>
            </article>
          ))}
        </div>
      </section>

      {definition.formula && (
        <section className="formula-card">
          <div className="section-title-row">
            <Calculator size={16} />
            <span>核心关系</span>
          </div>
          <div className="formula-line">
            <strong>{definition.formula}</strong>
          </div>
          <small>公式只适用于本页说明的理想条件与变量定义。</small>
        </section>
      )}

      <section className="preview-disclaimer">
        <Wrench size={16} />
        <p>该实验仍处于预览和审查阶段。已知简化、来源和待完成验证请查看“质量”页签。</p>
      </section>
    </>
  );
}
