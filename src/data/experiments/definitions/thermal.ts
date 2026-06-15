import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";

export const thermalDefinitions = {
  "air-conditioner": {
    id: "air-conditioner",
    index: 10,
    category: "热力设备",
    title: "分体式空调拆解与制冷循环",
    subtitle: "室内机、室外机、制冷剂循环与拆装",
    sceneTip: "切换工作原理、拆解观察和组合演示；拖动拆装进度查看部件装配关系",
    precisionLevel: "L1",
    precisionLabel: "系统结构与能量路径示意级",
    defaults: { speed: 65, primary: 65, secondary: 55, variant: 0, direction: 1 },
    controls: [
      { key: "speed", label: "系统运行速度", min: 20, max: 100, step: 5, suffix: "%" },
      { key: "primary", label: "拆装进度", min: 0, max: 100, step: 5, suffix: "%", visibleWhenVariants: [1, 2] },
      { key: "secondary", label: "外壳透明度", min: 20, max: 85, step: 5, suffix: "%" },
    ],
    variantLabel: "观察模式",
    variants: ["工作原理", "拆解观察", "组合演示"],
    showDirectionControl: false,
    quickSummary: "制冷模式下，压缩机把低压制冷剂蒸气压缩为高压高温气体；室外冷凝器向室外放热并使其冷凝；节流元件降低压力；室内蒸发器吸收室内空气热量，制冷剂蒸发后回到压缩机。",
    formula: "Qout = Qin + Wcompressor",
    parts: [
      { name: "室内蒸发器与贯流风机", role: "蒸发器从室内空气吸热，贯流风机推动空气经过换热器并送回房间。" },
      { name: "压缩机", role: "提高制冷剂蒸气的压力和温度，并维持循环流动。" },
      { name: "室外冷凝器与轴流风机", role: "把制冷剂携带的热量和压缩机输入功向室外空气释放。" },
      { name: "节流元件", role: "使高压液态制冷剂降压，形成适合进入蒸发器的低压状态。" },
      { name: "过滤网、外壳与排水盘", role: "过滤回风、组织气流、保护部件并收集蒸发器表面的冷凝水。" },
    ],
    knowledge: [
      {
        id: "cycle",
        title: "四步制冷循环",
        summary: "空调不是制造冷量，而是借助压缩机把室内热量搬到室外。",
        items: [
          { title: "1. 压缩", description: "低压蒸气进入压缩机后压力和温度升高。压缩机消耗电功，是循环的驱动部件。", sourceIds: ["ASHRAE-HANDBOOK-FUNDAMENTALS"] },
          { title: "2. 冷凝放热", description: "高压高温制冷剂在室外换热器向室外空气放热并冷凝。室外机排出的热量包含室内吸收的热量与压缩机输入功。", sourceIds: ["ASHRAE-HANDBOOK-FUNDAMENTALS"] },
          { title: "3. 节流降压", description: "制冷剂通过节流元件后压力下降，部分液体闪蒸，进入低温低压两相状态。", sourceIds: ["ASHRAE-HANDBOOK-FUNDAMENTALS"] },
          { title: "4. 蒸发吸热", description: "低压制冷剂在室内蒸发器中吸收空气热量并蒸发，空气温度下降，表面温度低于露点时还会产生冷凝水。", sourceIds: ["ASHRAE-HANDBOOK-FUNDAMENTALS"] },
        ],
      },
      {
        id: "assembly",
        title: "拆解与组合逻辑",
        summary: "拆解不是把零件随意散开，而是沿真实维护方向展示层级。",
        items: [
          { title: "室内机层级", description: "前面板和过滤网从正面取出，蒸发器位于回风侧，贯流风机位于下部送风通道，排水盘位于蒸发器下方。", sourceIds: ["DAIKIN-SPLIT-AC-SERVICE-MANUAL"] },
          { title: "室外机层级", description: "前护网和风扇位于换热器前方，压缩机通常位于机箱下部，冷凝器沿机箱外周布置。具体产品结构以制造商手册为准。", sourceIds: ["DAIKIN-SPLIT-AC-SERVICE-MANUAL"] },
        ],
      },
      {
        id: "limits",
        title: "安全和模型边界",
        summary: "制冷系统涉及压力、电气和制冷剂，动画不能替代维修程序。",
        items: [
          { title: "禁止自行拆冷媒系统", description: "实际维修需要断电、回收制冷剂、检漏、抽真空和按规定充注。未经培训不得打开制冷剂管路或电气系统。", sourceIds: ["ISO-5149-1"] },
          { title: "颜色只是状态提示", description: "红、橙、蓝、青只表示循环中的相对状态与流程段，不是实际温度、压力或相态计算结果。", sourceIds: ["ASHRAE-HANDBOOK-FUNDAMENTALS"] },
        ],
      },
    ],
    getMetrics: (values) => {
      const mode = ["工作原理", "拆解观察", "组合演示"][values.variant] ?? "工作原理";
      const assemblyNote =
        values.variant === 1
          ? `已拆解 ${number(values.primary, 0)}%`
          : values.variant === 2
            ? `已组合 ${number(values.primary, 0)}%`
            : "显示制冷剂循环";
      return [
        { label: "当前模式", value: mode, note: assemblyNote },
        { label: "运行速度", value: `${number(values.speed, 0)}%`, note: "仅控制动画节奏" },
        { label: "室内侧", value: "蒸发吸热", note: "贯流风机送风" },
        { label: "室外侧", value: "冷凝放热", note: "轴流风机排热" },
      ];
    },
    getConclusion: (values) => {
      if (values.variant === 0) {
        return "空调通过压缩、冷凝、节流和蒸发把室内热量搬到室外；室外放热量等于室内吸热量加压缩机输入功。";
      }
      if (values.variant === 1) {
        return `当前拆解进度 ${number(values.primary, 0)}%，外壳、过滤网、换热器、风机和压缩机沿维护方向分离。`;
      }
      return `当前组合进度 ${number(values.primary, 0)}%，零件按室内机与室外机的装配层级回到工作位置。`;
    },
  },
} satisfies Record<string, ExperimentDefinition>;
