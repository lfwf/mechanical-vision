import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { experimentDefinitions } from "../src/data/experiments/experimentRegistry.ts";
import type { ExperimentId, PartManualDefinition } from "../src/types/experiment.ts";

const applianceExperiments: Array<{
  id: ExperimentId;
  scenePath: string;
  minimumParts: number;
  requiredSystems: string[];
}> = [
  {
    id: "air-conditioner",
    scenePath: "src/components/experiments/AirConditionerScene.tsx",
    minimumParts: 16,
    requiredSystems: [
      "室内机外壳与气流",
      "制冷剂循环",
      "驱动与控制",
      "排水系统",
      "室外机外壳与气流",
    ],
  },
  {
    id: "washing-machine",
    scenePath: "src/components/experiments/WashingMachineScene.tsx",
    minimumParts: 15,
    requiredSystems: [
      "机壳与操作界面",
      "进水与投放系统",
      "外筒与密封系统",
      "悬挂与减振系统",
      "驱动系统",
      "排水系统",
    ],
  },
];

function assertText(value: string, label: string): void {
  assert(value.trim().length > 0, `${label} 不能为空`);
}

function validateManual(part: PartManualDefinition, experimentId: string): void {
  const prefix = `${experimentId}/${part.id}`;
  assertText(part.id, `${prefix} id`);
  assertText(part.name, `${prefix} name`);
  assertText(part.partCode, `${prefix} partCode`);
  assertText(part.system, `${prefix} system`);
  assertText(part.location, `${prefix} location`);
  assertText(part.function, `${prefix} function`);
  assert(Number.isInteger(part.removalOrder) && part.removalOrder > 0, `${prefix} removalOrder 必须为正整数`);

  for (const [field, values] of Object.entries({
    connections: part.connections,
    removalPrerequisites: part.removalPrerequisites,
    removalSteps: part.removalSteps,
    installChecks: part.installChecks,
    warnings: part.warnings,
    sourceIds: part.sourceIds,
  })) {
    assert(values.length > 0, `${prefix} ${field} 不能为空`);
    values.forEach((value, index) => assertText(value, `${prefix} ${field}[${index}]`));
  }
}

for (const appliance of applianceExperiments) {
  const definition = experimentDefinitions[appliance.id];
  const manuals = definition.partManuals ?? [];
  assert(definition.supportsPartAssembly === true, `${appliance.id} 必须启用逐件拆装`);
  assert(definition.referenceModel, `${appliance.id} 必须登记参考实机`);
  assert(
    manuals.length >= appliance.minimumParts,
    `${appliance.id} 至少需要 ${appliance.minimumParts} 个零件说明书，当前 ${manuals.length}`,
  );

  const ids = new Set<string>();
  const codes = new Set<string>();
  const ordersBySystem = new Map<string, Set<number>>();

  for (const part of manuals) {
    validateManual(part, appliance.id);
    assert(!ids.has(part.id), `${appliance.id} 存在重复零件 id: ${part.id}`);
    assert(!codes.has(part.partCode), `${appliance.id} 存在重复零件编码: ${part.partCode}`);
    ids.add(part.id);
    codes.add(part.partCode);

    const orders = ordersBySystem.get(part.system) ?? new Set<number>();
    assert(!orders.has(part.removalOrder), `${appliance.id}/${part.system} 拆卸序号重复: ${part.removalOrder}`);
    orders.add(part.removalOrder);
    ordersBySystem.set(part.system, orders);
  }

  for (const system of appliance.requiredSystems) {
    assert(
      manuals.some((part) => part.system === system),
      `${appliance.id} 缺少系统分类: ${system}`,
    );
  }

  const sceneSource = await readFile(path.resolve(appliance.scenePath), "utf8");
  for (const partId of ids) {
    assert(
      sceneSource.includes(`id=\"${partId}\"`),
      `${appliance.id} 零件 ${partId} 已有说明书，但场景中没有 ExplodablePart 映射`,
    );
  }

  const variantCount = definition.variants?.length ?? 0;
  for (const variant of definition.assemblyVariants ?? []) {
    assert(
      Number.isInteger(variant) && variant >= 0 && variant < variantCount,
      `${appliance.id} assemblyVariants 包含无效下标 ${variant}`,
    );
  }

  console.log(
    `[appliance] ${appliance.id}: ${manuals.length} 个零件、${ordersBySystem.size} 个系统分类，说明书与场景映射通过`,
  );
}
