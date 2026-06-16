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
    requiredSystems: ["室内机外壳与气流", "过滤与空气处理", "制冷剂循环", "驱动与控制", "排水系统", "室外机外壳与气流", "安装与承载"],
    tupleParts: false,
  },
  {
    id: "washing-machine",
    definitionPath: "src/data/experiments/definitions/washingMachineDefinition.ts",
    partsPath: "src/data/experiments/parts/washingMachineParts.ts",
    scenePaths: [
      "src/components/experiments/washingMachine/assemblies/CabinetAssembly.tsx",
      "src/components/experiments/washingMachine/assemblies/DoorAssembly.tsx",
      "src/components/experiments/washingMachine/assemblies/WaterSystemAssembly.tsx",
      "src/components/experiments/washingMachine/assemblies/DrumDriveAssembly.tsx",
      "src/components/experiments/washingMachine/assemblies/SuspensionAssembly.tsx",
    ],
    partPrefix: "wm-",
    minimumParts: 30,
    requiredSystems: ["机壳与操作界面", "门组件", "进水与投放系统", "外筒与密封系统", "悬挂与减振系统", "驱动系统", "排水系统"],
    tupleParts: true,
  },
];

function matches(source, pattern) {
  return Array.from(source.matchAll(pattern), (match) => match[1]);
}

function assertNoDependencyCycle(graph, applianceId) {
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw new Error(`${applianceId} 拆装依赖存在循环：${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of graph.get(id) ?? []) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of graph.keys()) visit(id);
}

for (const appliance of appliances) {
  const definitionSource = await readFile(path.resolve(appliance.definitionPath), "utf8");
  const partsSource = await readFile(path.resolve(appliance.partsPath), "utf8");
  const sceneSource = (await Promise.all(appliance.scenePaths.map((scenePath) => readFile(path.resolve(scenePath), "utf8")))).join("\n");

  assert(definitionSource.includes("supportsPartAssembly: true"), `${appliance.id} 必须启用逐件拆装`);
  assert(definitionSource.includes("referenceModel:"), `${appliance.id} 必须登记参考实机`);
  assert(definitionSource.includes("partManuals:"), `${appliance.id} 必须挂载零件说明书`);

  const tupleLines = appliance.tupleParts
    ? partsSource.split("\n").filter((line) => /^\s*\["wm-/.test(line))
    : [];
  const ids = appliance.tupleParts
    ? tupleLines.map((line) => line.match(/^\s*\["(wm-[^"]+)"/)?.[1]).filter(Boolean)
    : matches(partsSource, new RegExp(`id:\\s*"(${appliance.partPrefix}[^"]+)"`, "g"));
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, ids.length, `${appliance.id} 存在重复零件 ID`);
  assert(ids.length >= appliance.minimumParts, `${appliance.id} 至少需要 ${appliance.minimumParts} 个零件，当前 ${ids.length}`);

  const partCodes = appliance.tupleParts
    ? tupleLines.map((line) => line.match(/^\s*\["wm-[^"]+",\s*"[^"]+",\s*"([^"]+)"/)?.[1]).filter(Boolean)
    : matches(partsSource, /partCode:\s*"([^"]+)"/g);
  assert.equal(partCodes.length, ids.length, `${appliance.id} 每个零件都必须有 partCode`);
  assert.equal(new Set(partCodes).size, partCodes.length, `${appliance.id} 存在重复 partCode`);

  for (const system of appliance.requiredSystems) {
    assert(partsSource.includes(`"${system}"`), `${appliance.id} 缺少系统分类：${system}`);
  }

  for (const partId of uniqueIds) {
    assert(sceneSource.includes(`id="${partId}"`), `${appliance.id} 零件 ${partId} 有说明书，但场景没有映射`);
  }

  const scenePartIds = matches(sceneSource, new RegExp(`id="(${appliance.partPrefix}[^"]+)"`, "g"));
  for (const scenePartId of new Set(scenePartIds)) {
    assert(uniqueIds.has(scenePartId), `${appliance.id} 场景零件 ${scenePartId} 没有对应说明书`);
  }

  if (appliance.tupleParts) {
    for (const field of ["removalPrerequisites:", "removalSteps:", "installChecks:", "commonFaults:", "faultSymptoms:", "warnings:", "sourceIds:", "evidenceStatus:", "precisionNote:"]) {
      assert(partsSource.includes(field), `${appliance.id} 缺少说明书字段生成：${field}`);
    }
    const graph = new Map();
    for (const line of tupleLines) {
      const tokens = matches(line, /"(wm-[^"]+)"/g);
      const [id, ...dependencies] = tokens;
      graph.set(id, dependencies);
      for (const dependency of dependencies) assert(uniqueIds.has(dependency), `${appliance.id} 零件 ${id} 引用了不存在的前置零件 ${dependency}`);
    }
    assertNoDependencyCycle(graph, appliance.id);
  }

  console.log(`[appliance] ${appliance.id}: ${ids.length} 个零件，ID、说明书、场景映射和依赖检查通过`);
}
