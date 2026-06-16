import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";

export const manufacturingDefinitions = {
  "injection-molding": {
    id: "injection-molding",
    index: 12,
    category: "制造过程",
    title: "注塑成型循环",
    subtitle: "单机生产 S、E、N、J、E、R 并完成流水线组字",
    sceneTip: "播放自动循环，观察注塑、取件、输送、定位和整批完成",
    precisionLevel: "L2",
    precisionLabel: "工艺流程与运动关系级",
    defaults: { speed: 35, primary: 85, secondary: 35, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "循环速度", min: 10, max: 80, step: 5, suffix: "%" },
      { key: "primary", label: "注射压力", min: 40, max: 140, step: 5, suffix: "MPa" },
      { key: "secondary", label: "冷却占比", min: 20, max: 55, step: 5, suffix: "%" },
    ],
    showDirectionControl: false,
    quickSummary:
      "一台教学级注塑机依次生产 S、E、N、J、E、R 六个独立字母制品。每个字母完成合模、注射、保压、冷却、开模和顶出后，由取件机构送入输送线，并放入对应定位槽，最终组成 SENJER 后清场并进入下一批次。",
    formula: "单件节拍 = 注塑循环 + 取件 + 输送 + 定位；整批节拍 = 6 × 单件节拍 + 展示",
    parts: [
      { name: "料斗与加热料筒", role: "储存塑料颗粒，并在螺杆旋转、剪切和加热作用下完成塑化。" },
      { name: "往复螺杆", role: "塑化时旋转，注射时轴向前移，推动熔体进入当前字母模腔。" },
      { name: "定模与动模", role: "闭合后形成当前字母模腔，冷却后分开释放字母制品。" },
      { name: "取件机构", role: "从开模位置抓取字母制品，并送到输送线起点。" },
      { name: "输送线", role: "把字母制品送到组字工位。" },
      { name: "SENJER 装配台", role: "按 S、E、N、J、E、R 顺序定位六个制品，并显示整批完成状态。" },
    ],
    knowledge: [
      {
        id: "cycle",
        title: "完整循环",
        summary: "注塑阶段和产线阶段按顺序执行，前一动作未完成时不得进入下一动作。",
        items: [
          {
            title: "注射与保压不同",
            description:
              "注射阶段主要完成快速充模；保压阶段在浇口冻结前补充收缩体积，降低缩痕和内部空洞。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          },
          {
            title: "单模六次生产",
            description:
              "SENJER 由六个独立字母制品组成，其中 E 的几何定义复用两次。模型表达单机按生产序列循环，而不是六台注塑机同时工作。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          }
        ]
      },
      {
        id: "quality",
        title: "参数与边界",
        summary: "压力、速度、冷却和搬运节拍共同影响流程，但当前模型不进行真实工艺计算。",
        items: [
          {
            title: "冷却通常占比最高",
            description:
              "多数热塑性注塑循环中，冷却时间是周期的主要组成部分。冷却不足会造成变形、粘模或顶出损伤。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          },
          {
            title: "教学边界",
            description:
              "字母模腔、机械手和输送线为教学级简化；不计算真实熔体流变、模腔压力、温度场、锁模力、收缩、翘曲或机器人节拍。",
            sourceIds: ["INJECTION-MOLDING-ENGINEERING"]
          }
        ]
      }
    ],
    getMetrics: (values) => {
      const cycleSeconds = 30 - values.speed * 0.22;
      const coolingSeconds = cycleSeconds * values.secondary / 100;
      const batchSeconds = cycleSeconds * 6 + 2.2;
      return [
        { label: "估算单件节拍", value: `${number(cycleSeconds, 1)} s`, note: "教学比例" },
        { label: "估算整批节拍", value: `${number(batchSeconds, 1)} s`, note: "6 件 + 完成展示" },
        { label: "冷却时间", value: `${number(coolingSeconds, 1)} s`, note: `${number(values.secondary, 0)}% 周期` },
        { label: "注射压力", value: `${number(values.primary, 0)} MPa`, note: "参数示意" },
      ];
    },
    getConclusion: (values) =>
      `当前以 ${number(values.primary, 0)} MPa 的教学压力参数循环生产 S、E、N、J、E、R，冷却约占单件周期的 ${number(values.secondary, 0)}%。六件定位完成后展示 SENJER，再自动进入下一批次。`,
  },
} satisfies Record<string, ExperimentDefinition>;
