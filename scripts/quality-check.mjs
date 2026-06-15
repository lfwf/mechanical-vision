import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const qualityDirectory = path.resolve("src/data/experiments");
const files = (await readdir(qualityDirectory)).filter((file) =>
  file.endsWith(".quality.json"),
);

if (files.length === 0) {
  console.error("[quality] 未发现任何 *.quality.json 质量档案");
  process.exit(1);
}

let hasStructuralError = false;

for (const file of files) {
  const fullPath = path.join(qualityDirectory, file);
  const record = JSON.parse(await readFile(fullPath, "utf8"));
  const errors = [];
  const blockers = [];

  for (const field of [
    "experimentId",
    "title",
    "version",
    "releaseStage",
    "modelCard",
    "contentCard",
    "sources",
    "claims",
    "verification",
    "reviews",
  ]) {
    if (record[field] === undefined || record[field] === null) {
      errors.push(`缺少字段 ${field}`);
    }
  }

  if (errors.length === 0) {
    const sourceIds = new Set(record.sources.map((source) => source.id));
    const authoritativeSources = record.sources.filter((source) =>
      ["A", "B"].includes(source.evidenceLevel),
    );

    if (authoritativeSources.length === 0) {
      blockers.push("缺少 A/B 级权威来源");
    }

    if (!record.modelCard.intendedUses?.length) {
      blockers.push("模型卡缺少适用用途");
    }
    if (!record.modelCard.prohibitedUses?.length) {
      blockers.push("模型卡缺少禁止用途");
    }
    if (!record.modelCard.knownLimitations?.length) {
      blockers.push("模型卡缺少已知限制");
    }

    for (const claim of record.claims) {
      if (!claim.sourceIds?.length) {
        blockers.push(`关键结论 ${claim.id} 未绑定来源`);
        continue;
      }
      for (const sourceId of claim.sourceIds) {
        if (!sourceIds.has(sourceId)) {
          errors.push(`关键结论 ${claim.id} 引用不存在的来源 ${sourceId}`);
        }
      }
    }

    for (const item of record.verification) {
      if (item.critical && item.status !== "pass" && item.status !== "not-applicable") {
        blockers.push(`关键验证未通过：${item.title}`);
      }
    }

    for (const area of ["model", "content", "integration"]) {
      const approved = record.reviews.some(
        (review) =>
          review.area === area &&
          review.decision === "approved" &&
          (area === "integration" || review.independent === true),
      );
      if (!approved) blockers.push(`${area} 审核未通过`);
    }

    if (record.releaseStage === "released" && blockers.length > 0) {
      errors.push(`已标记 released，但仍存在 ${blockers.length} 个发布阻断项`);
    }

    if (record.releaseStage !== "released" && blockers.length === 0) {
      console.warn(`[quality] ${record.experimentId}: 门禁已满足，但尚未标记 released`);
    }
  }

  if (errors.length > 0) {
    hasStructuralError = true;
    console.error(`\n[quality] ${file} 检查失败：`);
    errors.forEach((error) => console.error(`  - ${error}`));
  } else {
    console.log(`\n[quality] ${record.experimentId} 结构检查通过`);
    console.log(`  阶段：${record.releaseStage}`);
    console.log(`  精度：${record.modelCard.precisionLevel} · ${record.modelCard.precisionLabel}`);
    if (blockers.length > 0) {
      console.log(`  发布阻断项：${blockers.length}`);
      blockers.forEach((blocker) => console.log(`    - ${blocker}`));
    } else {
      console.log("  发布门禁：通过");
    }
  }
}

if (hasStructuralError) process.exit(1);
