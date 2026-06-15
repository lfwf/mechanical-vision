import {
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  Info,
  MoveRight,
  Ratio,
  ScanLine,
} from "lucide-react";
import { partContent } from "../../data/partContent";
import { analyzeGearPair, formatNumber } from "../../lib/gearMath";
import { useGearLabStore } from "../../store/useGearLabStore";
import type { GearPartId } from "../../types/lab";

const partTabs: Array<{ id: GearPartId; label: string }> = [
  { id: "mesh", label: "啮合" },
  { id: "driver", label: "主动轮" },
  { id: "driven", label: "从动轮" },
  { id: "shaft", label: "轴" },
];

export function AnalysisView() {
  const driverTeeth = useGearLabStore((state) => state.driverTeeth);
  const drivenTeeth = useGearLabStore((state) => state.drivenTeeth);
  const inputRpm = useGearLabStore((state) => state.inputRpm);
  const inputDirection = useGearLabStore((state) => state.inputDirection);
  const selectedPartId = useGearLabStore((state) => state.selectedPartId);
  const selectPart = useGearLabStore((state) => state.selectPart);

  const analysis = analyzeGearPair(
    inputRpm,
    inputDirection,
    driverTeeth,
    drivenTeeth,
  );
  const content = partContent[selectedPartId];
  const speedIncreases = analysis.speedChangePercent > 0;
  const turnsPerDriverRevolution = driverTeeth / drivenTeeth;

  return (
    <>
      <div className="metric-grid">
        <article className="metric-card">
          <Ratio size={18} />
          <span>传动比 i</span>
          <strong>{formatNumber(analysis.ratio, 3)}</strong>
          <small>z₂ ÷ z₁</small>
        </article>
        <article className="metric-card">
          <Gauge size={18} />
          <span>输出转速</span>
          <strong>{formatNumber(Math.abs(analysis.drivenRpm), 1)}</strong>
          <small>RPM</small>
        </article>
        <article className="metric-card">
          <ScanLine size={18} />
          <span>端面重合度</span>
          <strong>{formatNumber(analysis.contactRatio, 3)}</strong>
          <small>理论值，仅几何模型</small>
        </article>
        <article className="metric-card">
          {speedIncreases ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          <span>速度变化</span>
          <strong>
            {analysis.speedChangePercent >= 0 ? "+" : ""}
            {formatNumber(analysis.speedChangePercent, 1)}%
          </strong>
          <small>理想扭矩比例 × {formatNumber(analysis.torqueFactor, 2)}</small>
        </article>
      </div>

      <section className="direction-flow">
        <div className="direction-node driver-node">
          <span>主动轮</span>
          <strong>{analysis.driverDirection}</strong>
          <small>{inputRpm} RPM</small>
        </div>
        <div className="direction-link">
          <MoveRight size={22} />
          <small>外啮合反向</small>
        </div>
        <div className="direction-node driven-node">
          <span>从动轮</span>
          <strong>{analysis.drivenDirection}</strong>
          <small>{formatNumber(Math.abs(analysis.drivenRpm), 1)} RPM</small>
        </div>
      </section>

      <section className="teaching-summary">
        <div className="section-title-row">
          <Info size={17} />
          <h3>当前结论</h3>
        </div>
        <p>
          主动轮为 <strong>{driverTeeth} 齿</strong>，从动轮为 <strong>{drivenTeeth} 齿</strong>。
          主动轮每转 1 圈，从动轮反向转动 <strong>{formatNumber(turnsPerDriverRevolution, 3)} 圈</strong>。
          {analysis.conclusion}
        </p>
        <p className="scope-warning">
          以上结果属于理想刚体运动学，不代表实际效率、承载能力、寿命或可制造性。
        </p>
      </section>

      <div className="part-tabs" role="tablist" aria-label="零件说明">
        {partTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selectedPartId === tab.id}
            className={selectedPartId === tab.id ? "is-active" : ""}
            onClick={() => selectPart(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="part-explanation">
        <span>{content.eyebrow}</span>
        <h3>{content.title}</h3>
        <p>{content.description}</p>
        <ul>
          {content.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="formula-card">
        <span>理想外啮合关系</span>
        <div className="formula-line">
          <strong>n₁ · z₁ = −n₂ · z₂</strong>
        </div>
        <small>负号表示两个齿轮旋转方向相反。</small>
      </section>
    </>
  );
}
