import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";

export const fluidDefinitions = {
  "centrifugal-pump": {
    id: "centrifugal-pump",
    index: 6,
    category: "流体机械",
    title: "单级端吸离心泵",
    subtitle: "叶轮、蜗壳与流体能量转换",
    sceneTip: "调节叶轮转速与流动演示速度，观察轴向吸入和径向排出路径",
    precisionLevel: "L1",
    precisionLabel: "结构与能量路径示意级",
    defaults: { speed: 1450, primary: 65, secondary: 55, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "叶轮转速", min: 300, max: 3000, step: 50, suffix: "RPM" },
      { key: "primary", label: "流动演示速度", min: 10, max: 100, step: 5, suffix: "%" },
      { key: "secondary", label: "泵壳透明度", min: 20, max: 85, step: 5, suffix: "%" },
    ],
    quickSummary:
      "离心泵让液体从叶轮眼轴向进入，随叶轮旋转获得角动量，并在叶轮出口和蜗壳中把部分速度能转换为压力能。",
    formula: "H ∝ n²，Q ∝ n，P ∝ n³（相似条件下）",
    parts: [
      { name: "叶轮", role: "通过叶片对液体做功，是主要能量传递部件。" },
      { name: "叶轮眼", role: "液体进入叶轮的低半径区域。" },
      { name: "蜗壳", role: "收集叶轮出口流体并逐步扩大流道。" },
      { name: "泵轴与密封", role: "传递扭矩并限制轴穿出处泄漏。" },
    ],
    knowledge: [
      {
        id: "energy",
        title: "能量转换",
        summary: "泵增加的是流体机械能，不是简单把水“甩出去”。",
        items: [
          {
            title: "叶轮做功",
            description:
              "叶片使流体获得速度和角动量。泵产生的扬程与叶轮出口速度三角形、直径、转速和滑移等因素有关。",
            sourceIds: ["ANSI-HI-14.3", "KSB-CENTRIFUGAL-PUMP-LEXICON"],
          },
          {
            title: "蜗壳作用",
            description:
              "蜗壳汇集流量并通过扩散作用降低平均流速、提高静压。当前粒子只表示路径，不是 CFD 结果。",
            sourceIds: ["ANSI-HI-14.3", "KSB-CENTRIFUGAL-PUMP-LEXICON"],
          },
        ],
      },
      {
        id: "operation",
        title: "运行边界",
        summary: "实际运行需关注汽蚀、最小流量、效率区和轴封状态。",
        items: [
          {
            title: "汽蚀风险",
            description:
              "入口可用净正吸入压头不足时，局部压力可能降至液体饱和蒸气压附近并产生汽蚀。动画不计算 NPSH。",
            sourceIds: ["ANSI-HI-9.6.1"],
          },
          {
            title: "相似定律边界",
            description:
              "Q、H、P 与转速的比例关系只在几何相似、流体性质和运行范围满足条件时近似成立，不能直接外推到任意工况。",
            sourceIds: ["ANSI-HI-14.3"],
          },
        ],
      },
    ],
    getMetrics: (values) => {
      const ratio = values.speed / 1450;
      return [
        { label: "转速比例", value: number(ratio, 2), note: "相对 1450 RPM" },
        { label: "流量比例", value: number(ratio, 2), note: "相似定律示意" },
        { label: "扬程比例", value: number(ratio ** 2, 2), note: "相似定律示意" },
        { label: "功率比例", value: number(ratio ** 3, 2), note: "相似定律示意" },
      ];
    },
    getConclusion: (values) =>
      `当前叶轮转速为 ${number(values.speed, 0)} RPM。粒子动画只表达“轴向吸入—叶轮加能—径向汇集—出口排出”的路径，不代表真实速度场或压力场。`,
  },
  valves: {
    id: "valves",
    index: 7,
    category: "流体机械",
    title: "工业阀门结构对比",
    subtitle: "球阀、蝶阀与截止阀",
    sceneTip: "切换阀门类型并调整开度，观察关闭件与流道的相对位置",
    precisionLevel: "L1",
    precisionLabel: "结构与功能示意级",
    defaults: { speed: 0, primary: 75, secondary: 55, variant: 0, direction: 1 },
    controls: [
      { key: "primary", label: "阀门开度", min: 0, max: 100, step: 5, suffix: "%" },
      { key: "secondary", label: "阀体透明度", min: 20, max: 85, step: 5, suffix: "%" },
    ],
    variantLabel: "阀门类型",
    variants: ["球阀", "蝶阀", "截止阀"],
    quickSummary:
      "球阀、蝶阀和截止阀都能改变流路，但关闭件形状、运动方式、流阻、调节特性和密封结构不同。",
    parts: [
      { name: "阀体", role: "形成承压边界并连接上、下游管道。" },
      { name: "关闭件", role: "球体、蝶板或阀瓣通过旋转或升降改变通流面积。" },
      { name: "阀座", role: "与关闭件接触形成密封副。" },
      { name: "阀杆", role: "把外部操作力矩或推力传给关闭件。" },
    ],
    knowledge: [
      {
        id: "comparison",
        title: "结构差异",
        summary: "不同阀型不能只按外观比较，应看运动方式和使用任务。",
        items: [
          {
            title: "球阀",
            description:
              "球体通常旋转约 90°完成开关。全通径结构可形成较直的流道，常用于快速切断。",
            sourceIds: ["ASME-B16.34", "API-608"],
          },
          {
            title: "蝶阀",
            description:
              "蝶板绕阀杆旋转，结构紧凑、质量较低，但蝶板在开启时仍位于流道内。",
            sourceIds: ["ASME-B16.34", "API-609"],
          },
          {
            title: "截止阀",
            description:
              "阀瓣沿阀杆方向升降，流体通常发生明显转向，适合需要较稳定节流特性的场景，但压降通常较大。",
            sourceIds: ["ASME-B16.34"],
          },
        ],
      },
      {
        id: "selection",
        title: "选型边界",
        summary: "实际选型受介质、压力温度、泄漏等级、操作频率和材料约束。",
        items: [
          {
            title: "开度不等于流量百分比",
            description:
              "阀门开度与流量通常不是线性关系，还取决于阀门固有流量特性和系统压差。本模型只显示几何开度。",
            sourceIds: ["IEC-60534-2-1"],
          },
        ],
      },
    ],
    getMetrics: (values) => {
      const names = ["球阀", "蝶阀", "截止阀"];
      const motion = ["旋转 90°", "旋转 90°", "轴向升降"];
      return [
        { label: "当前阀型", value: names[values.variant] ?? names[0], note: motion[values.variant] ?? motion[0] },
        { label: "几何开度", value: `${number(values.primary, 0)}%`, note: "不等同于流量百分比" },
        { label: "阀体透明度", value: `${number(values.secondary, 0)}%`, note: "仅用于结构观察" },
        { label: "主要任务", value: values.variant === 2 ? "调节 / 切断" : "快速切断", note: "仍需按工况选型" },
      ];
    },
    getConclusion: (values) =>
      `${["球阀", "蝶阀", "截止阀"][values.variant] ?? "球阀"}当前几何开度为 ${number(values.primary, 0)}%。页面不把开度换算为实际流量，因为系统压差和阀门流量特性尚未建模。`,
  },
} satisfies Record<string, ExperimentDefinition>;
