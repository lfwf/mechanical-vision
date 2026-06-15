import type { ExperimentDefinition } from "../../../types/experiment";
import { directionText, number } from "../definitionUtils";

export const motionDefinitions = {
  "slider-crank": {
    id: "slider-crank",
    index: 4,
    category: "运动机构",
    title: "曲柄滑块机构",
    subtitle: "旋转运动与往复直线运动转换",
    sceneTip: "调整曲柄半径和连杆长度，观察行程与速度不均匀性",
    precisionLevel: "L2",
    precisionLabel: "运动原理级",
    defaults: { speed: 60, primary: 1, secondary: 3, variant: 0, direction: -1 },
    controls: [
      { key: "primary", label: "曲柄半径", min: 0.7, max: 1.4, step: 0.1, suffix: "" },
      { key: "secondary", label: "连杆/曲柄比", min: 2.5, max: 5, step: 0.1, suffix: "" },
      { key: "speed", label: "曲柄转速", min: 10, max: 150, step: 5, suffix: "RPM" },
    ],
    quickSummary:
      "曲柄滑块机构用曲柄、连杆和受导轨约束的滑块，把连续旋转变为往复直线运动，或反向把往复运动变为旋转。",
    formula: "x = r cosθ + √(l² − r² sin²θ)",
    parts: [
      { name: "曲柄", role: "绕固定轴旋转，曲柄半径决定滑块总行程的一半。" },
      { name: "连杆", role: "连接曲柄销和滑块销，在运动中同时平移和摆动。" },
      { name: "滑块", role: "受导轨约束，只允许沿一条直线往复。" },
      { name: "导轨", role: "承受侧向反力并限制滑块姿态。" },
    ],
    knowledge: [
      {
        id: "motion",
        title: "位移与速度",
        summary: "滑块不是匀速往复，连杆有限长度会造成运动不对称。",
        items: [
          {
            title: "行程",
            description:
              "无偏置曲柄滑块的理论行程为曲柄直径，即 2r。连杆长度改变侧向摆角和速度曲线，但不改变总行程。",
            sourceIds: ["NORTON-DESIGN-MACHINERY"],
          },
          {
            title: "死点",
            description:
              "曲柄、连杆和滑块轴线共线时形成内、外死点，滑块瞬时速度为零并改变运动方向。",
            sourceIds: ["NORTON-DESIGN-MACHINERY"],
          },
        ],
      },
      {
        id: "engineering",
        title: "工程应用",
        summary: "常见于发动机、压缩机、往复泵和冲压机构。",
        items: [
          {
            title: "侧向力",
            description:
              "连杆倾角会给滑块和导轨带来侧向反力。缩小曲柄半径与连杆长度之比通常可减小最大摆角，但会增加机构尺寸。",
            sourceIds: ["NORTON-DESIGN-MACHINERY"],
          },
        ],
      },
    ],
    getMetrics: (values) => {
      const r = values.primary;
      const l = r * values.secondary;
      const meanPistonSpeed = (4 * r * values.speed) / 60;
      return [
        { label: "理论行程", value: number(2 * r, 2), note: "2r" },
        { label: "连杆长度", value: number(l, 2), note: "l = λr" },
        { label: "平均往复速度", value: number(meanPistonSpeed, 2), note: "4rn / 60" },
        { label: "最大连杆角", value: `${number((Math.asin(1 / values.secondary) * 180) / Math.PI, 1)}°`, note: "无偏置近似" },
      ];
    },
    getConclusion: (values) =>
      `曲柄半径 ${number(values.primary, 1)} 对应理论行程 ${number(values.primary * 2, 1)}；连杆/曲柄比为 ${number(values.secondary, 1)}，比值越大，连杆摆角和滑块侧向作用通常越小。`,
  },
  cam: {
    id: "cam",
    index: 5,
    category: "运动机构",
    title: "偏心圆盘凸轮",
    subtitle: "轮廓驱动从动件周期位移",
    sceneTip: "改变偏心量，观察滚子从动件的升程和回程",
    precisionLevel: "L2",
    precisionLabel: "运动原理级",
    defaults: { speed: 50, primary: 0.45, secondary: 0.28, variant: 0, direction: -1 },
    controls: [
      { key: "primary", label: "凸轮偏心量", min: 0.15, max: 0.7, step: 0.05, suffix: "" },
      { key: "secondary", label: "滚子半径", min: 0.18, max: 0.42, step: 0.02, suffix: "" },
      { key: "speed", label: "凸轮转速", min: 10, max: 120, step: 5, suffix: "RPM" },
    ],
    quickSummary:
      "偏心圆盘凸轮是圆盘中心与转轴中心不重合的特殊凸轮。圆盘转动时，轮廓推动滚子从动件周期升降。",
    formula: "y = zc + √(R² − xc²) + rr",
    parts: [
      { name: "凸轮", role: "以偏心圆轮廓把连续旋转转换为周期位移。" },
      { name: "滚子从动件", role: "与凸轮保持接触，降低接触处滑动摩擦。" },
      { name: "导向套", role: "限制从动杆只沿竖直方向移动。" },
      { name: "回位弹簧", role: "在非正约束机构中维持从动件与凸轮接触。" },
    ],
    knowledge: [
      {
        id: "profile",
        title: "轮廓决定运动规律",
        summary: "一般凸轮需要根据位移、速度、加速度和跃度要求反求轮廓。",
        items: [
          {
            title: "偏心圆凸轮",
            description:
              "当前示例只展示偏心圆盘。其升程由偏心量主导，结构直观，但不能代表所有盘形凸轮的运动规律。",
            sourceIds: ["NORTON-DESIGN-MACHINERY"],
          },
          {
            title: "压力角",
            description:
              "真实设计需要限制压力角，避免从动件侧向力过大、摩擦增加或发生运动失真。",
            sourceIds: ["NORTON-DESIGN-MACHINERY"],
          },
        ],
      },
      {
        id: "limits",
        title: "接触条件",
        summary: "高速时还要考虑弹簧、惯性、接触应力和轮廓曲率。",
        items: [
          {
            title: "防止跳动",
            description:
              "从动件惯性力超过弹簧和外载提供的压紧力时，可能脱离凸轮。网页动画假定始终保持接触。",
            sourceIds: ["NORTON-DESIGN-MACHINERY"],
          },
        ],
      },
    ],
    getMetrics: (values) => [
      { label: "理论总升程", value: number(values.primary * 2, 2), note: "偏心圆近似 2e" },
      { label: "滚子半径", value: number(values.secondary, 2), note: "视觉与接触参数" },
      { label: "凸轮转速", value: `${number(values.speed, 0)} RPM`, note: directionText(values.direction) },
      { label: "循环频率", value: `${number(values.speed / 60, 2)} Hz`, note: "每转一个循环" },
    ],
    getConclusion: (values) =>
      `偏心量增至 ${number(values.primary, 2)} 后，偏心圆凸轮的理论总升程约为 ${number(values.primary * 2, 2)}。本示例假定滚子始终与凸轮接触。`,
  },
} satisfies Record<string, ExperimentDefinition>;
