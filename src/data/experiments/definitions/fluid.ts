import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";

export const fluidDefinitions = {
  "centrifugal-pump": {
    id: "centrifugal-pump",
    index: 6,
    category: "流体机械",
    title: "单级端吸离心泵",
    subtitle: "叶轮、蜗壳与流体能量转换",
    sceneTip: "在工作原理与结构拆解之间切换；蓝色入口、叶轮加能、蜗壳汇集和红色出口按顺序显示",
    precisionLevel: "L1",
    precisionLabel: "结构与能量路径示意级",
    defaults: { speed: 1450, primary: 65, secondary: 55, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "叶轮转速", min: 300, max: 3000, step: 50, suffix: "RPM" },
      { key: "primary", label: "拆解进度", min: 0, max: 100, step: 5, suffix: "%", visibleWhenVariants: [1] },
      { key: "secondary", label: "泵壳透明度", min: 20, max: 85, step: 5, suffix: "%" },
    ],
    variantLabel: "观察模式",
    variants: ["工作原理", "结构拆解"],
    showDirectionControl: false,
    quickSummary: "液体先沿轴向进入叶轮眼；叶轮旋转对流体做功，使其获得速度和角动量；流体随后进入蜗壳，被汇集并把部分速度能转换为压力能，最后从出口排出。",
    formula: "H ∝ n²，Q ∝ n，P ∝ n³（相似条件下）",
    parts: [
      { name: "轴向入口与叶轮眼", role: "把低压液体送到叶轮中心，入口方向与泵轴近似一致。" },
      { name: "叶轮", role: "旋转叶片对液体做功，是机械能传给流体的核心部件。" },
      { name: "蜗壳", role: "沿周向收集叶轮出口流体，流道逐渐扩大并完成扩压。" },
      { name: "切向出口", role: "把较高压力的流体送往下游管路。" },
    ],
    knowledge: [
      {
        id: "energy",
        title: "四步工作路径",
        summary: "看清入口、加能、汇集扩压和出口，比只看粒子绕圈更重要。",
        items: [
          { title: "1. 轴向进入", description: "液体从吸入口沿泵轴方向进入叶轮眼。入口条件不充分会增加汽蚀风险。", sourceIds: ["ANSI-HI-14.3", "ANSI-HI-9.6.1"] },
          { title: "2. 叶轮加能", description: "叶片对流体做功，使其获得速度和角动量。动画用由蓝到橙的颜色变化表达能量增加，不是压力云图。", sourceIds: ["ANSI-HI-14.3", "KSB-CENTRIFUGAL-PUMP-LEXICON"] },
          { title: "3. 蜗壳汇集与扩压", description: "蜗壳收集周向流量，逐渐扩大的流道降低平均速度并提高静压。", sourceIds: ["ANSI-HI-14.3"] },
          { title: "4. 出口排出", description: "流体从切向出口进入管路。红色只表示相对更高能量状态，不代表实际温度。", sourceIds: ["ANSI-HI-14.3"] },
        ],
      },
      {
        id: "operation",
        title: "运行边界",
        summary: "实际运行需关注汽蚀、最小流量、效率区和轴封状态。",
        items: [
          { title: "相似定律边界", description: "Q、H、P 与转速的比例关系只在几何相似、流体性质和运行范围满足条件时近似成立，不能直接外推到任意工况。", sourceIds: ["ANSI-HI-14.3"] },
          { title: "模型不是 CFD", description: "粒子只沿预设路径运动，不计算真实三维速度、压力、湍流、回流或汽蚀。", sourceIds: ["ANSI-HI-14.3"] },
        ],
      },
    ],
    getMetrics: (values) => {
      const ratio = values.speed / 1450;
      return [
        { label: "当前模式", value: values.variant === 0 ? "工作原理" : "结构拆解", note: values.variant === 0 ? "显示四步流动路径" : `拆解 ${number(values.primary, 0)}%` },
        { label: "转速比例", value: number(ratio, 2), note: "相对 1450 RPM" },
        { label: "扬程比例", value: number(ratio ** 2, 2), note: "相似定律示意" },
        { label: "功率比例", value: number(ratio ** 3, 2), note: "相似定律示意" },
      ];
    },
    getConclusion: (values) =>
      values.variant === 0
        ? `当前以 ${number(values.speed, 0)} RPM 演示：轴向吸入 → 叶轮加能 → 蜗壳汇集扩压 → 切向出口。粒子不是 CFD 结果。`
        : `当前拆解进度 ${number(values.primary, 0)}%，入口、叶轮、蜗壳和出口沿各自装配方向分开，便于理解零件关系。`,
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
    quickSummary: "球阀、蝶阀和截止阀都能改变流路，但关闭件形状、运动方式、流阻、调节特性和密封结构不同。",
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
          { title: "球阀", description: "球体通常旋转约 90°完成开关。全通径结构可形成较直的流道，常用于快速切断。", sourceIds: ["ASME-B16.34", "API-608"] },
          { title: "蝶阀", description: "蝶板绕阀杆旋转，结构紧凑、质量较低，但蝶板在开启时仍位于流道内。", sourceIds: ["ASME-B16.34", "API-609"] },
          { title: "截止阀", description: "阀瓣沿阀杆方向升降，流体通常发生明显转向，适合需要较稳定节流特性的场景，但压降通常较大。", sourceIds: ["ASME-B16.34"] },
        ],
      },
      {
        id: "selection",
        title: "选型边界",
        summary: "实际选型受介质、压力温度、泄漏等级、操作频率和材料约束。",
        items: [
          { title: "开度不等于流量百分比", description: "阀门开度与流量通常不是线性关系，还取决于阀门固有流量特性和系统压差。本模型只显示几何开度。", sourceIds: ["IEC-60534-2-1"] },
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
