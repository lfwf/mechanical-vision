import type { ExperimentDefinition } from "../../../types/experiment";
import { directionText, number, rackPitch } from "../definitionUtils";

export const transmissionDefinitions = {
  "gear-pair": {
    id: "gear-pair",
    index: 1,
    category: "传动机构",
    title: "外啮合直齿圆柱齿轮",
    subtitle: "齿数、转速与方向",
    sceneTip: "拖拽旋转 · 滚轮缩放 · 点击齿轮查看对应说明",
    precisionLevel: "L2",
    precisionLabel: "运动原理级",
    defaults: { speed: 120, primary: 24, secondary: 36, variant: 0, direction: -1 },
    controls: [],
    quickSummary: "两个平行轴外啮合齿轮以相反方向旋转，理想转速比由齿数比决定。",
    parts: [],
    knowledge: [],
    getMetrics: () => [],
    getConclusion: () => "",
  },
  "rack-pinion": {
    id: "rack-pinion",
    index: 2,
    category: "传动机构",
    title: "齿轮齿条机构",
    subtitle: "旋转运动转直线运动",
    sceneTip: "观察齿轮旋转一周对应的齿条位移，并调整齿数和转速",
    precisionLevel: "L2",
    precisionLabel: "运动原理级",
    defaults: { speed: 90, primary: 24, secondary: 0, variant: 0, direction: -1 },
    controls: [
      { key: "primary", label: "小齿轮齿数", min: 18, max: 40, step: 1, suffix: "齿" },
      { key: "speed", label: "输入转速", min: 10, max: 180, step: 5, suffix: "RPM" },
    ],
    quickSummary:
      "齿轮齿条机构把小齿轮的旋转运动转换为齿条的直线运动。理想条件下，齿条每移动一个圆周齿距，小齿轮恰好转过一个齿距角。",
    formula: "v = π · m · z · n / 60",
    parts: [
      { name: "小齿轮", role: "输入旋转运动，并通过齿面把切向运动传给齿条。" },
      { name: "齿条", role: "可视作节圆半径无限大的齿轮，沿导轨作直线运动。" },
      { name: "导轨", role: "限制齿条自由度，避免横向偏移和脱离啮合。" },
    ],
    knowledge: [
      {
        id: "principle",
        title: "运动关系",
        summary: "转角、节圆半径和直线位移之间存在直接关系。",
        items: [
          {
            title: "位移关系",
            description:
              "理想无滑动条件下，齿条位移等于小齿轮节圆弧长：s = r × θ。转一周时，位移为 πmz。",
            sourceIds: ["ISO-21771-2007"],
          },
          {
            title: "速度关系",
            description:
              "齿条线速度等于小齿轮节圆处切向速度。提高转速或增加齿数都会提高相同模数下的直线速度。",
            sourceIds: ["ISO-21771-2007"],
          },
        ],
      },
      {
        id: "engineering",
        title: "工程边界",
        summary: "真实机构还需要考虑导向、侧隙、润滑和齿面承载。",
        items: [
          {
            title: "常见用途",
            description:
              "常用于转向机构、直线执行机构、机床进给和自动门等需要旋转—直线转换的场景。",
            sourceIds: ["ISO-21771-2007"],
          },
          {
            title: "不能忽略的条件",
            description:
              "实际设计需要校核齿条支承刚度、安装平行度、啮合侧隙、齿面强度和润滑；本模型只展示几何与理想运动学。",
            sourceIds: ["ISO-6336-1-2019"],
          },
        ],
      },
    ],
    getMetrics: (values) => {
      const pitchRadius = (0.145 * values.primary) / 2;
      const speed = (Math.PI * 0.145 * values.primary * values.speed) / 60;
      return [
        { label: "节圆半径", value: `${number(pitchRadius, 3)}`, note: "场景单位" },
        { label: "齿条线速度", value: `${number(speed, 3)}`, note: "场景单位/秒" },
        { label: "每转位移", value: `${number(rackPitch * values.primary, 3)}`, note: "πmz" },
        { label: "运动方向", value: values.direction === -1 ? "向右" : "向左", note: "按当前观察方向" },
      ];
    },
    getConclusion: (values) =>
      `小齿轮以 ${number(values.speed, 0)} RPM ${directionText(values.direction)}旋转时，齿条以约 ${number((Math.PI * 0.145 * values.primary * values.speed) / 60, 3)} 场景单位/秒作直线运动。`,
  },
  "planetary-gear": {
    id: "planetary-gear",
    index: 3,
    category: "传动机构",
    title: "行星齿轮组",
    subtitle: "太阳轮、行星轮、齿圈与行星架",
    sceneTip: "切换固定构件，观察太阳轮、齿圈和行星架的速度关系",
    precisionLevel: "L2",
    precisionLabel: "运动关系级",
    defaults: { speed: 90, primary: 3, secondary: 0, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "输入转速", min: 10, max: 180, step: 5, suffix: "RPM" },
      { key: "primary", label: "行星轮数量", min: 3, max: 4, step: 1, suffix: "个" },
    ],
    variantLabel: "约束工况",
    variants: ["齿圈固定，太阳轮输入", "太阳轮固定，齿圈输入", "行星架固定，太阳轮输入"],
    quickSummary:
      "行星齿轮组通过太阳轮、行星轮、内齿圈和行星架的组合，在紧凑空间内形成多种传动比。改变被固定的构件，会改变输入与输出的关系。",
    formula: "(ωs − ωc) / (ωr − ωc) = −zr / zs",
    parts: [
      { name: "太阳轮", role: "位于中心，与所有行星轮外啮合。" },
      { name: "行星轮", role: "既绕自身轴旋转，又随行星架绕中心公转。" },
      { name: "内齿圈", role: "与行星轮内啮合，可作为固定件、输入件或输出件。" },
      { name: "行星架", role: "支承行星轮轴，并汇集行星轮的公转运动。" },
    ],
    knowledge: [
      {
        id: "kinematics",
        title: "Willis 速度关系",
        summary: "行星机构的核心不是单对齿轮比，而是三构件的相对速度关系。",
        items: [
          {
            title: "相对运动",
            description:
              "将所有角速度减去行星架角速度后，太阳轮与齿圈表现为一对方向相反、齿数比确定的相对运动。",
            sourceIds: ["ISO-21771-2007", "AGMA-6123-C16"],
          },
          {
            title: "齿数条件",
            description:
              "同模数简单行星机构通常满足齿圈齿数 zr = zs + 2zp，才能在同一中心距上同时满足太阳轮—行星轮外啮合和行星轮—齿圈内啮合。",
            sourceIds: ["ISO-21771-2007"],
          },
        ],
      },
      {
        id: "limits",
        title: "模型限制",
        summary: "运动学关系可以准确展示，但当前内齿圈齿根和装配细节仍为教学简化。",
        items: [
          {
            title: "载荷分配",
            description:
              "真实多行星机构的载荷是否均匀，受制造误差、浮动构件、支承刚度和行星轮相位影响，不能由理想动画判断。",
            sourceIds: ["AGMA-6123-C16"],
          },
        ],
      },
    ],
    getMetrics: (values) => {
      const zs = 18;
      const zr = 54;
      const input = values.speed * values.direction;
      let sun = 0;
      let ring = 0;
      let carrier = 0;
      if (values.variant === 0) {
        sun = input;
        carrier = (sun * zs) / (zs + zr);
      } else if (values.variant === 1) {
        ring = input;
        carrier = (ring * zr) / (zs + zr);
      } else {
        sun = input;
        ring = -(sun * zs) / zr;
      }
      return [
        { label: "太阳轮", value: `${number(Math.abs(sun), 1)} RPM`, note: sun === 0 ? "固定" : directionText(Math.sign(sun) as 1 | -1) },
        { label: "齿圈", value: `${number(Math.abs(ring), 1)} RPM`, note: ring === 0 ? "固定" : directionText(Math.sign(ring) as 1 | -1) },
        { label: "行星架", value: `${number(Math.abs(carrier), 1)} RPM`, note: carrier === 0 ? "固定" : directionText(Math.sign(carrier) as 1 | -1) },
        { label: "齿数组合", value: "18 / 18 / 54", note: "太阳 / 行星 / 齿圈" },
      ];
    },
    getConclusion: (values) => {
      const mode = ["齿圈固定", "太阳轮固定", "行星架固定"][values.variant] ?? "齿圈固定";
      return `${mode}工况下，各构件必须同时满足外啮合、内啮合和行星架相对速度约束。当前输入为 ${number(values.speed, 0)} RPM。`;
    },
  },
} satisfies Record<string, ExperimentDefinition>;
