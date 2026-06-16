import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";

export const manufacturingDefinitions = {
  "injection-molding": {
    id: "injection-molding",
    index: 12,
    category: "制造过程",
    title: "注塑成型循环",
    subtitle: "合模、注射、保压、冷却、开模与顶出",
    sceneTip: "切换阶段或播放自动循环，观察螺杆、模具、熔体和顶针的协同动作",
    precisionLevel: "L2",
    precisionLabel: "工艺流程与运动关系级",
    defaults: { speed: 35, primary: 85, secondary: 35, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "循环速度", min: 10, max: 80, step: 5, suffix: "%" },
      { key: "primary", label: "注射压力", min: 40, max: 140, step: 5, suffix: "MPa" },
      { key: "secondary", label: "冷却占比", min: 20, max: 55, step: 5, suffix: "%" },
    ],
    variantLabel: "观察阶段",
    variants: ["自动循环", "合模", "注射", "保压", "冷却", "开模", "顶出"],
    showDirectionControl: false,
    quickSummary:
      "注塑成型通过螺杆塑化并推动熔融塑料，经喷嘴、主流道和浇口充入闭合模腔；随后保压补缩、冷却定型，模具打开并由顶针推出制品。",
    formula: "循环时间 = 合模 + 注射 + 保压 + 冷却 + 开模 + 顶出",
    parts: [
      { name: "料斗与加热料筒", role: "储存塑料颗粒，并在螺杆旋转、剪切和加热作用下完成塑化。" },
      { name: "往复螺杆", role: "塑化时旋转后退，注射时停止旋转并轴向前移，推动熔体进入模具。" },
      { name: "定模与动模", role: "闭合后形成模腔并承受注射压力，冷却后分开释放制品。" },
      { name: "浇注系统", role: "将喷嘴熔体经主流道、分流道和浇口引入模腔。" },
      { name: "冷却水路", role: "带走熔体热量，使制品达到可脱模刚度。" },
      { name: "顶出机构", role: "模具打开后推动顶针，将制品从动模侧脱离。" },
    ],
    knowledge: [
      {
        id: "cycle",
        title: "完整循环",
        summary: "各阶段必须按顺序协调，任何阶段不足都会传递为制品缺陷。",
        items: [
          {
            title: "注射与保压不同",
            description:
              "注射阶段主要完成快速充模；保压阶段在浇口冻结前补充收缩体积，降低缩痕和内部空洞。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          },
          {
            title: "冷却通常占比最高",
            description:
              "多数热塑性注塑循环中，冷却时间是周期的主要组成部分。冷却不足会造成变形、粘模或顶出损伤。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          }
        ]
      },
      {
        id: "quality",
        title: "参数与缺陷",
        summary: "压力、速度、温度、保压切换和冷却共同决定成型质量。",
        items: [
          {
            title: "欠注与飞边",
            description:
              "充模能力不足可能造成欠注；锁模力不足、模具间隙或压力过高可能造成飞边。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          },
          {
            title: "教学边界",
            description:
              "当前动画只表达流程、方向和相对运动，不计算真实熔体流变、模腔压力、温度场、翘曲或锁模力。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          }
        ]
      }
    ],
    getMetrics: (values) => {
      const cycleSeconds = 30 - values.speed * 0.22;
      const coolingSeconds = cycleSeconds * values.secondary / 100;
      return [
        { label: "估算循环时间", value: `${number(cycleSeconds, 1)} s`, note: "教学比例" },
        { label: "冷却时间", value: `${number(coolingSeconds, 1)} s`, note: `${number(values.secondary, 0)}% 周期` },
        { label: "注射压力", value: `${number(values.primary, 0)} MPa`, note: "参数示意" },
        { label: "当前阶段", value: ["自动循环", "合模", "注射", "保压", "冷却", "开模", "顶出"][values.variant] ?? "自动循环", note: "可手动观察" },
      ];
    },
    getConclusion: (values) =>
      `当前以 ${number(values.primary, 0)} MPa 的教学压力参数演示注射，冷却约占循环的 ${number(values.secondary, 0)}%。该模型用于理解阶段顺序和机构协同，不替代模流分析或真实工艺设定。`,
  },
} satisfies Record<string, ExperimentDefinition>;
