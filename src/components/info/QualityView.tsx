import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  FileWarning,
  ShieldAlert,
} from "lucide-react";
import type { ExperimentQualityRecord, QualityGateResult } from "../../types/quality";

const statusLabels = {
  pass: "通过",
  fail: "失败",
  pending: "待完成",
  "not-applicable": "不适用",
} as const;

const decisionLabels = {
  approved: "已批准",
  "changes-requested": "需修改",
  pending: "待审核",
} as const;

export function QualityView({
  record,
  gate,
}: {
  record: ExperimentQualityRecord;
  gate: QualityGateResult;
}) {
  const completedVerifications = record.verification.filter(
    (item) => item.status === "pass" || item.status === "not-applicable",
  ).length;

  return (
    <div className="quality-view">
      <section className={`release-gate-card ${gate.canRelease ? "is-ready" : "is-blocked"}`}>
        <div>
          {gate.canRelease ? <BadgeCheck size={20} /> : <ShieldAlert size={20} />}
          <span>发布门禁</span>
        </div>
        <strong>{gate.canRelease ? "允许正式发布" : "仅允许预览"}</strong>
        <p>
          {gate.canRelease
            ? "模型、内容、验证和独立审核均满足发布条件。"
            : `仍有 ${gate.blockers.length} 个阻断项，页面不得标记为正式发布。`}
        </p>
      </section>

      <section className="quality-section">
        <div className="section-title-row">
          <ClipboardCheck size={17} />
          <h3>模型身份证</h3>
        </div>
        <dl className="quality-definition-list">
          <div><dt>模型编号</dt><dd>{record.modelCard.modelId}</dd></div>
          <div><dt>版本</dt><dd>{record.modelCard.version}</dd></div>
          <div><dt>精度等级</dt><dd>{record.modelCard.precisionLevel} · {record.modelCard.precisionLabel}</dd></div>
          <div><dt>建模方法</dt><dd>{record.modelCard.generationMethod}</dd></div>
          <div><dt>坐标系</dt><dd>{record.modelCard.coordinateSystem}</dd></div>
        </dl>
      </section>

      <section className="quality-section">
        <h3>适用与禁止用途</h3>
        <div className="quality-two-column">
          <div>
            <span className="quality-list-label is-allowed">适用</span>
            <ul>{record.modelCard.intendedUses.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <span className="quality-list-label is-prohibited">禁止</span>
            <ul>{record.modelCard.prohibitedUses.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="quality-section limitation-card">
        <div className="section-title-row">
          <FileWarning size={17} />
          <h3>简化与已知限制</h3>
        </div>
        <ul>
          {[...record.modelCard.simplifications, ...record.modelCard.knownLimitations].map(
            (item) => <li key={item}>{item}</li>,
          )}
        </ul>
      </section>

      <section className="quality-section">
        <div className="verification-heading">
          <h3>验证记录</h3>
          <span>{completedVerifications} / {record.verification.length}</span>
        </div>
        <div className="verification-list">
          {record.verification.map((item) => (
            <article className={`verification-item status-${item.status}`} key={item.id}>
              <div>
                {item.status === "pass" && <CheckCircle2 size={16} />}
                {item.status === "pending" && <CircleDashed size={16} />}
                {item.status === "fail" && <AlertTriangle size={16} />}
                {item.status === "not-applicable" && <CircleDashed size={16} />}
                <strong>{item.title}</strong>
              </div>
              <span>{statusLabels[item.status]}{item.critical ? " · 关键" : ""}</span>
              <p>{item.method}</p>
              {item.evidence && <small>证据：{item.evidence}</small>}
              {item.notes && <small>说明：{item.notes}</small>}
            </article>
          ))}
        </div>
      </section>

      <section className="quality-section">
        <h3>审核记录</h3>
        <div className="review-list">
          {record.reviews.map((review) => (
            <article key={review.id}>
              <div>
                <strong>{review.reviewerRole}</strong>
                <span className={`review-decision decision-${review.decision}`}>
                  {decisionLabels[review.decision]}
                </span>
              </div>
              <p>{review.notes}</p>
              <small>
                {review.reviewer ?? "尚未指定审核人"}
                {review.reviewedAt ? ` · ${review.reviewedAt}` : ""}
                {review.independent ? " · 独立审核" : " · 内部检查"}
              </small>
            </article>
          ))}
        </div>
      </section>

      {!gate.canRelease && (
        <section className="quality-section blocker-card">
          <h3>当前阻断项</h3>
          <ul>{gate.blockers.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}
    </div>
  );
}
