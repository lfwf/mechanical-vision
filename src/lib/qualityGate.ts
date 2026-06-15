import type {
  ExperimentQualityRecord,
  QualityGateResult,
  ReviewArea,
} from "../types/quality";

const REQUIRED_REVIEW_AREAS: ReviewArea[] = ["model", "content", "integration"];

export function evaluateQualityGate(
  record: ExperimentQualityRecord,
): QualityGateResult {
  const passedChecks: string[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const sourceIds = new Set(record.sources.map((source) => source.id));

  if (record.modelCard.intendedUses.length > 0) {
    passedChecks.push("已声明模型用途");
  } else {
    blockers.push("模型卡缺少适用用途");
  }

  if (record.modelCard.prohibitedUses.length > 0) {
    passedChecks.push("已声明禁止用途");
  } else {
    blockers.push("模型卡缺少禁止用途");
  }

  if (record.modelCard.knownLimitations.length > 0) {
    passedChecks.push("已公开已知限制");
  } else {
    blockers.push("模型卡缺少已知限制");
  }

  const authoritativeSources = record.sources.filter((source) =>
    source.evidenceLevel === "A" || source.evidenceLevel === "B",
  );
  if (authoritativeSources.length > 0) {
    passedChecks.push("包含 A/B 级权威来源");
  } else {
    blockers.push("没有 A/B 级权威来源");
  }

  for (const claim of record.claims) {
    if (claim.sourceIds.length === 0) {
      blockers.push(`关键结论 ${claim.id} 没有关联来源`);
      continue;
    }

    const missingSources = claim.sourceIds.filter((sourceId) => !sourceIds.has(sourceId));
    if (missingSources.length > 0) {
      blockers.push(
        `关键结论 ${claim.id} 引用了不存在的来源：${missingSources.join("、")}`,
      );
    }
  }

  if (record.claims.length > 0 && blockers.every((item) => !item.includes("关键结论"))) {
    passedChecks.push("关键结论已完成来源映射");
  }

  const failedCriticalChecks = record.verification.filter(
    (item) => item.critical && item.status === "fail",
  );
  const pendingCriticalChecks = record.verification.filter(
    (item) => item.critical && item.status === "pending",
  );

  failedCriticalChecks.forEach((item) => {
    blockers.push(`关键验证失败：${item.title}`);
  });
  pendingCriticalChecks.forEach((item) => {
    blockers.push(`关键验证待完成：${item.title}`);
  });

  if (failedCriticalChecks.length === 0 && pendingCriticalChecks.length === 0) {
    passedChecks.push("关键验证项全部通过");
  }

  for (const area of REQUIRED_REVIEW_AREAS) {
    const approvedIndependentReview = record.reviews.some(
      (review) =>
        review.area === area &&
        review.decision === "approved" &&
        (area === "integration" || review.independent),
    );

    if (approvedIndependentReview) {
      passedChecks.push(`${getReviewAreaLabel(area)}审核已通过`);
    } else {
      blockers.push(`${getReviewAreaLabel(area)}审核尚未由合格审核人批准`);
    }
  }

  const nonCriticalFailures = record.verification.filter(
    (item) => !item.critical && item.status === "fail",
  );
  nonCriticalFailures.forEach((item) => {
    warnings.push(`非关键验证失败：${item.title}`);
  });

  if (record.releaseStage === "released" && blockers.length > 0) {
    blockers.unshift("记录被标记为 released，但发布门禁未通过");
  }

  return {
    canRelease: blockers.length === 0,
    passedChecks,
    blockers,
    warnings,
  };
}

function getReviewAreaLabel(area: ReviewArea): string {
  if (area === "model") return "模型";
  if (area === "content") return "内容";
  return "集成";
}
