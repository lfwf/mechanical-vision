import { ShieldAlert, ShieldCheck } from "lucide-react";
import {
  getExperimentQuality,
  getExperimentQualityGate,
} from "../../data/experiments/qualityRecords";
import type { ExperimentId } from "../../types/experiment";

export function ExperimentQualityBadge({ experimentId }: { experimentId: ExperimentId }) {
  const record = getExperimentQuality(experimentId);
  const model = record.modelCard;
  const gate = getExperimentQualityGate(experimentId);

  return (
    <div
      className={`experiment-quality-badge ${gate.canRelease ? "is-ready" : "is-preview"}`}
      title={
        gate.canRelease
          ? "发布门禁已通过"
          : `当前仍有 ${gate.blockers.length} 个发布阻断项`
      }
    >
      {gate.canRelease ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
      <span>{model.precisionLevel} · {model.precisionLabel}</span>
      <strong>{gate.canRelease ? "已审核" : "预览版"}</strong>
    </div>
  );
}
