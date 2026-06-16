import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";
import { airConditionerParts } from "../parts/airConditionerParts";

/**
 * 空调实验的元数据和界面配置。
 *
 * 三维几何体放在 components/experiments/airConditioner 下，
 * 本文件只定义标题、控制项、模式名称、知识说明、指标和结论。
 */
const daikinSource = "DAIKIN-PERFERA-ECPEN20-007";
const ashraeSource = "ASHRAE-HANDBOOK-FUNDAMENTALS";
const safetySource = "ISO-5149-1";

// variant 的索引必须与场景组件中的判断保持一致：0 制冷、1 送风、2 排水、3 拆装。
const modes = ["制冷循环", "送风路径", "排水路径", "零件拆装"];

export const airConditionerDefinition = {
  "air-conditioner": {
    id: "air-conditioner",
    index: 10,
    category: "家用设备",
    title: "Daikin Perfera 分体式空调拆解",
    subtitle: "FTXM35R / RXM35R 参考结构、气流路径与制冷循环",
    sceneTip: "运行模式自动打开剖视结构；零件拆装模式可调整外壳剖视程度并逐件拆装",
    precisionLevel: "L2",
    precisionLabel: "实机比例、结构拓扑与装配层级级",

    // 进入实验时的默认运行参数。
    defaults: { speed: 60, primary: 0, secondary: 0, variant: 0, direction: 1 },

    // speed 只影响三个运行动画；外壳剖视程度只在零件拆装模式显示。
    controls: [
      { key: "speed", label: "流动与风扇速度", min: 20, max: 100, step: 5, suffix: "%", visibleWhenVariants: [0, 1, 2] },
      { key: "secondary", label: "外壳剖视程度", min: 0, max: 100, step: 5, suffix: "%", visibleWhenVariants: [3] },
    ],

    variantLabel: "演示模式",
    variants: modes,
    showDirectionControl: false,

    // 只有 variant=3 时启用单零件拆下、装回、全部展开等操作。
    supportsPartAssembly: true,
    assemblyVariants: [3],

    referenceModel: {
      manufacturer: "Daikin",
      model: "Perfera FTXM35R + RXM35R",
      productType: "壁挂式室内机与单联室外热泵机组",
      accuracyStatement: "外壳比例依据公开目录中的 299×998×292 mm 室内机和 550×765×285 mm 室外机尺寸。模型拆分为室内机 15 个、室外机 12 个主要组件，重点保证进风、过滤、换热、送风、排水、制冷剂循环和承载关系正确；不声称复刻原厂专有 CAD、紧固件数量、线束长度或维修尺寸。",
    },

    // 零件说明书由 airConditionerParts 统一维护，场景中的零件 id 必须与说明书 id 一致。
    partManuals: airConditionerParts,
    quickSummary: "室内空气依次经过进风格栅、主过滤网、功能滤网和室内换热器，再由贯流风轮从导风机构送回房间；冷凝水进入接水盘并经排水管排出。制冷剂在变频压缩机、室外换热器、电子膨胀阀和室内换热器之间循环，四通阀用于冷暖换向。",
    formula: "Qout = Qin + Wcompressor",
    parts: airConditionerParts.map((part) => ({ name: part.name, role: part.function })),

    // 信息面板中的知识章节。
    knowledge: [
      {
        id: "reference",
        title: "参考实机与建模边界",
        summary: "先固定具体型号和公开尺寸，再区分已确认结构、工程拓扑与原厂未公开细节。",
        items: [
          { title: "室内机比例", description: "FTXM35R 规格段公开尺寸为高 299 mm、宽 998 mm、深 292 mm。模型据此表现进风格栅、过滤层、折弯换热器、贯流风轮、排水盘、导风机构和右侧电控区。", sourceIds: [daikinSource] },
          { title: "室外机比例", description: "RXM35R 规格段公开尺寸为高 550 mm、宽 765 mm、深 285 mm。模型据此表现前置三叶轴流风扇、后侧 L 形换热器、压缩机舱、逆变电控和服务阀区域。", sourceIds: [daikinSource] },
          { title: "细节边界", description: "管路弯曲半径、翅片数量、线束固定点、卡扣和螺钉为教学级简化，不能替代服务手册。", sourceIds: [daikinSource, safetySource] },
        ],
      },
      {
        id: "air-water-path",
        title: "空气路径与冷凝水",
        summary: "空气、制冷剂和冷凝水是三条不同路径。",
        items: [
          { title: "室内空气", description: "空气从上部进入，依次经过过滤网和室内换热器；贯流风轮建立压差，处理后的空气经垂直叶片和水平导风板送出。", sourceIds: [daikinSource] },
          { title: "室外空气", description: "轴流风扇从后侧和左侧吸入空气，使其穿过 L 形换热器并从正面格栅排出。", sourceIds: [daikinSource] },
          { title: "冷凝水", description: "制冷时水蒸气在低温换热器表面凝结，滴入接水盘后依靠安装坡度排出。反坡、堵塞或接水盘错位会导致漏水。", sourceIds: [daikinSource] },
        ],
      },
      {
        id: "cycle",
        title: "制冷剂循环",
        summary: "空调通过压差和相变搬运热量。",
        items: [
          { title: "压缩", description: "压缩机把低压蒸气压缩为高温高压蒸气，并消耗电功。", sourceIds: [ashraeSource] },
          { title: "室外放热", description: "高压制冷剂在室外换热器放热并冷凝，轴流风扇强化换热。", sourceIds: [ashraeSource, daikinSource] },
          { title: "节流", description: "电子膨胀阀调节流量并产生压降。", sourceIds: [ashraeSource] },
          { title: "室内吸热", description: "低压制冷剂在室内换热器吸热蒸发，再返回压缩机；四通阀可在制热时改变流向。", sourceIds: [ashraeSource] },
        ],
      },
      {
        id: "assembly",
        title: "拆装层级与安全",
        summary: "拆装顺序由遮挡、连接、承载和危险能量共同决定。",
        items: [
          { title: "室内机", description: "先处理前面板、格栅和过滤件，再处理导风、电控、传感器、排水和配管，最后接近换热器、风轮、后壳和墙板。", sourceIds: [daikinSource] },
          { title: "室外机", description: "先移除顶盖、右侧板和前格栅，再处理风扇、电机与电控；阀件、压缩机和换热器属于制冷剂回路。", sourceIds: [daikinSource, safetySource] },
          { title: "安全边界", description: "实机存在高压制冷剂、逆变直流母线、锐利翅片、重型组件和高处安装风险，模型只用于结构学习。", sourceIds: [safetySource] },
        ],
      },
    ],

    // 右侧指标卡根据当前模式动态生成。
    getMetrics: (values) => [
      { label: "参考机型", value: "FTXM35R / RXM35R", note: "Daikin Perfera" },
      {
        label: "当前模式",
        value: modes[values.variant] ?? modes[0],
        note: values.variant === 0
          ? "压缩→室外放热→节流→室内吸热"
          : values.variant === 1
            ? "室内回风与送风 / 室外换热气流"
            : values.variant === 2
              ? "换热器凝水→接水盘→重力排水"
              : "27 个主要组件可独立拆装",
      },
      { label: "室内机", value: "15 个组件", note: "299×998×292 mm 比例" },
      { label: "室外机", value: "12 个组件", note: values.variant === 3 ? `550×765×285 mm 比例 · 外壳剖视 ${number(values.secondary, 0)}%` : "550×765×285 mm 比例" },
    ],

    // 结论区按 variant 索引取对应说明。
    getConclusion: (values) => [
      "当前显示制冷工况：红色表示压缩后的高温气体，橙色表示室外放热后的高压液体，蓝色表示节流后的低温混合物，青色表示室内吸热后的低压回气。",
      "当前显示送风路径：室内空气从顶部进入，经过过滤和换热后由贯流风轮向前下方送出；室外空气从后侧与左侧穿过换热器，再由三叶轴流风扇从正面排出。",
      "当前显示排水路径：水蒸气先在室内换热器翅片上凝结，水滴落入接水盘并汇集到排水口，最后依靠排水管持续下坡排到室外。",
      "当前进入零件拆装模式。27 个主要组件均可选择、单独拆下、装回、全部展开或全部组装；展开方向用于表达层级，不等同于原厂维修动作。",
    ][values.variant] ?? "当前显示 Daikin Perfera 空调结构。",
  },
} satisfies Record<string, ExperimentDefinition>;
