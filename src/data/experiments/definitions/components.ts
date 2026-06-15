import type { ExperimentDefinition } from "../../../types/experiment";
import { directionText, number } from "../definitionUtils";

export const componentsDefinitions = {
  bearing: {
    id: "bearing",
    index: 8,
    category: "通用零部件",
    title: "深沟球轴承",
    subtitle: "套圈、滚动体、保持架与载荷路径",
    sceneTip: "调节内圈转速和载荷显示，观察滚动体公转与套圈相对运动",
    precisionLevel: "L2",
    precisionLabel: "结构与运动原理级",
    defaults: { speed: 600, primary: 60, secondary: 0, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "内圈转速", min: 50, max: 1800, step: 50, suffix: "RPM" },
      { key: "primary", label: "径向载荷显示", min: 0, max: 100, step: 5, suffix: "%" },
    ],
    quickSummary:
      "深沟球轴承利用内外圈滚道与钢球之间的滚动接触支承轴。保持架分隔滚动体，但不直接承担主要外部载荷。",
    parts: [
      { name: "内圈", role: "通常与轴配合，随轴旋转。" },
      { name: "外圈", role: "通常安装在轴承座中，形成外滚道。" },
      { name: "钢球", role: "在内外滚道之间传递载荷并减小滑动。" },
      { name: "保持架", role: "分隔和引导滚动体，避免钢球相互接触。" },
    ],
    knowledge: [
      {
        id: "motion",
        title: "滚动与滑动并存",
        summary: "轴承不是所有接触点都绝对纯滚动。",
        items: [
          {
            title: "运动关系",
            description:
              "内圈转动时，滚动体既绕自身轴旋转，又随保持架绕轴承中心公转。实际速度受接触角、滚道曲率和滑移影响。",
            sourceIds: ["SKF-BEARING-FUNDAMENTALS"],
          },
          {
            title: "载荷区",
            description:
              "径向载荷下，并非所有滚动体均匀承载；靠近载荷方向的滚动体通常形成主要载荷区。",
            sourceIds: ["ISO-281-2007", "SKF-BEARING-FUNDAMENTALS"],
          },
        ],
      },
      {
        id: "life",
        title: "寿命与失效",
        summary: "额定寿命是统计量，不能仅凭转速动画判断。",
        items: [
          {
            title: "额定寿命",
            description:
              "ISO 281 的基本额定寿命基于动态载荷额定值、等效动载荷和可靠度等条件。实际寿命还受润滑、污染、安装和材料状态影响。",
            sourceIds: ["ISO-281-2007"],
          },
          {
            title: "常见问题",
            description:
              "润滑不足、污染、安装偏斜、配合不当和电蚀都可能造成噪声、温升、磨损或表面疲劳。",
            sourceIds: ["SKF-BEARING-FUNDAMENTALS"],
          },
        ],
      },
    ],
    getMetrics: (values) => [
      { label: "内圈转速", value: `${number(values.speed, 0)} RPM`, note: directionText(values.direction) },
      { label: "保持架公转", value: `${number(values.speed * 0.42, 0)} RPM`, note: "仅为教学近似" },
      { label: "滚动体数量", value: "12", note: "演示模型固定" },
      { label: "载荷显示", value: `${number(values.primary, 0)}%`, note: "非实际载荷值" },
    ],
    getConclusion: (values) =>
      `内圈以 ${number(values.speed, 0)} RPM 旋转。载荷箭头和滚动体高亮只表示径向载荷区，不用于计算接触应力或额定寿命。`,
  },
  seal: {
    id: "seal",
    index: 9,
    category: "通用零部件",
    title: "单端面机械密封",
    subtitle: "动环、静环、弹簧与密封界面",
    sceneTip: "调整轴转速和剖视程度，观察旋转件、静止件与端面接触关系",
    precisionLevel: "L1",
    precisionLabel: "结构与功能示意级",
    defaults: { speed: 900, primary: 65, secondary: 55, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "轴转速", min: 100, max: 3000, step: 50, suffix: "RPM" },
      { key: "primary", label: "剖视展开", min: 0, max: 100, step: 5, suffix: "%" },
      { key: "secondary", label: "流体腔透明度", min: 20, max: 85, step: 5, suffix: "%" },
    ],
    quickSummary:
      "机械密封通过随轴旋转的动环与固定静环形成端面密封副。弹簧力和介质压力维持端面闭合，极薄流体膜承担润滑、冷却和泄漏控制作用。",
    parts: [
      { name: "动环", role: "随轴旋转，与静环形成主密封端面。" },
      { name: "静环", role: "固定在压盖或泵壳中，与动环相对滑动。" },
      { name: "弹簧与推环", role: "在停机和压力不足时提供闭合力并补偿磨损。" },
      { name: "辅助密封", role: "限制动环、静环与轴或壳体配合处的泄漏。" },
    ],
    knowledge: [
      {
        id: "interface",
        title: "端面密封界面",
        summary: "机械密封依赖受控的端面状态，而不是绝对零间隙。",
        items: [
          {
            title: "流体膜",
            description:
              "实际运行时端面之间通常存在极薄流体膜，以降低摩擦和带走热量。膜厚、端面变形和泄漏需要专门的热流体与接触分析。",
            sourceIds: ["API-682-4", "ISO-21049-2004"],
          },
          {
            title: "闭合力与开启力",
            description:
              "弹簧力、介质压力和端面液膜压力共同决定端面受力平衡。当前动画不计算平衡直径、比压和热变形。",
            sourceIds: ["API-682-4", "ISO-21049-2004"],
          },
        ],
      },
      {
        id: "failure",
        title: "运行与失效",
        summary: "干运转、污染、振动和热变形都可能破坏密封端面。",
        items: [
          {
            title: "禁止干运转",
            description:
              "缺少合适液膜时，端面摩擦热可能快速升高并损伤密封面。具体启停要求必须遵循设备和密封制造商说明。",
            sourceIds: ["API-682-4"],
          },
          {
            title: "泄漏判断",
            description:
              "可见泄漏、温升或振动异常需要结合介质、冲洗方案、端面材料、轴跳动和安装状态分析，不能仅凭结构动画诊断。",
            sourceIds: ["API-682-4", "ISO-21049-2004"],
          },
        ],
      },
    ],
    getMetrics: (values) => [
      { label: "轴转速", value: `${number(values.speed, 0)} RPM`, note: directionText(values.direction) },
      { label: "剖视展开", value: `${number(values.primary, 0)}%`, note: "仅改变可视位置" },
      { label: "腔体透明度", value: `${number(values.secondary, 0)}%`, note: "仅用于观察" },
      { label: "密封形式", value: "单端面", note: "教学简化结构" },
    ],
    getConclusion: (values) =>
      `轴以 ${number(values.speed, 0)} RPM 旋转时，动环随轴转动而静环保持固定。剖视展开是观察工具，不代表真实端面间隙。`,
  },
} satisfies Record<string, ExperimentDefinition>;
