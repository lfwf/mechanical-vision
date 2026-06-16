import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const appliances = [
  {
    id: "air-conditioner",
    definitionPath: "src/data/experiments/definitions/airConditionerDefinition.ts",
    partsPath: "src/data/experiments/parts/airConditionerParts.ts",
    scenePaths: [
      "src/components/experiments/airConditioner/IndoorUnit.tsx",
      "src/components/experiments/airConditioner/OutdoorUnit.tsx",
    ],
    partPrefix: "ac-",
    minimumParts: 27,
    requiredSystems: [
      "室内机外壳与气流",
      "过滤与空气处理",
      "制冷剂循环",
      "驱动与控制",
      "排水系统",
      "室外机外壳与气流",
      "安装与承载",
    ],
  },
  {
    id: "washing-machine",
    definitionPath: "src/data/experiments/definitions/household.ts",
    partsPath: "src/data/experiments/definitions/household.ts",
    scenePaths: ["src/components/experiments/WashingMachineScene.tsx"],
    partPrefix: "wm-",
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

function matches(source, pattern) {
  return Array.from(source.matchAll(pattern), (match) => match[1]);
}

function count(source, token) {
  return source.split(token).length - 1;
}

for (const appliance of appliances) {
  const definitionSource = await readFile(path.resolve(appliance.definitionPath), "utf8");
  const partsSource = await readFile(path.resolve(appliance.partsPath), "utf8");
  const sceneSource = (
    await Promise.all(appliance.scenePaths.map((scenePath) => readFile(path.resolve(scenePath), "utf8")))
  ).join("\n");

  assert(definitionSource.includes("supportsPartAssembly: true"), `${appliance.id} 必须启用逐件拆装`);
  assert(definitionSource.includes("referenceModel:"), `${appliance.id} 必须登记参考实机`);
  assert(definitionSource.includes("partManuals:"), `${appliance.id} 必须向实验定义挂载零件说明书`);

  const ids = matches(partsSource, new RegExp(`id:\\s*"(${appliance.partPrefix}[^"]+)"`, "g"));
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length, `${appliance.id} 存在重复零件 ID`);
  assert(ids.length >= appliance.minimumParts, `${appliance.id} 至少需要 ${appliance.minimumParts} 个零件，当前 ${ids.length}`);

  const partCodes = matches(partsSource, /partCode:\s*"([^"]+)"/g);
  assert.equal(partCodes.length, ids.length, `${appliance.id} 每个零件都必须有 partCode`);
  assert.equal(new Set(partCodes).size, partCodes.length, `${appliance.id} 存在重复 partCode`);

  for (const field of [
    "system:",
    "location:",
    "function:",
    "connections:",
    "removalOrder:",
    "removalPrerequisites:",
    "removalSteps:",
    "installChecks:",
    "warnings:",
    "sourceIds:",
  ]) {
    assert(count(partsSource, field) >= ids.length, `${appliance.id} 字段 ${field} 数量不足，零件说明书可能不完整`);
  }

  for (const system of appliance.requiredSystems) {
    assert(partsSource.includes(`system: "${system}"`), `${appliance.id} 缺少系统分类：${system}`);
  }

  for (const partId of uniqueIds) {
    assert(sceneSource.includes(`id="${partId}"`), `${appliance.id} 零件 ${partId} 已有说明书，但场景中没有 ExplodablePart 映射`);
  }

  const scenePartIds = matches(sceneSource, new RegExp(`id="(${appliance.partPrefix}[^"]+)"`, "g"));
  for (const scenePartId of new Set(scenePartIds)) {
    assert(uniqueIds.has(scenePartId), `${appliance.id} 场景零件 ${scenePartId} 没有对应说明书`);
  }

  console.log(`[appliance] ${appliance.id}: ${ids.length} 个零件，说明书与场景映射检查通过`);
}
