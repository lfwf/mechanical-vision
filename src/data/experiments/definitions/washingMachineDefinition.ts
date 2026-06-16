import type { ExperimentDefinition } from "../../../types/experiment";
import { number } from "../definitionUtils";
import { washingMachineParts } from "../parts/washingMachineParts";
import { WashingMachineMode, washingMachineModeLabels } from "../washingMachineModes";

const PRODUCT = "LG-WM4000HWA-PRODUCT";
const SUPPORT = "LG-WM4000HWA-SUPPORT";
const MANUAL = "LG-WM4000HWA-OWNER-MANUAL";
const ENGINEERING = "WM-FRONT-LOAD-ENGINEERING-TOPOLOGY";
const PERFORMANCE = "IEC-60456";
const SAFETY = "IEC-60335-2-7";

export const washingMachineDefinition: ExperimentDefinition = {
  id: "washing-machine",
  index: 11,
  category: "家用设备",
  title: "LG WM4000HWA 滚筒洗衣机拆解",
  subtitle: "进水水路、后置直驱、悬挂减震、排水与受约束拆装",
  sceneTip: "按模式观察水路、轴系、减震和排水；拆装模式会校验前置零件，不能直接穿过外壳取出内部总成",
  precisionLevel: "L2",
  precisionLabel: "实机边界约束下的结构拓扑与运动关系级",
  defaults: {
    speed: 48,
    primary: 34,
    secondary: 55,
    variant: WashingMachineMode.WashWaterPath,
    direction: 1,
  },
  controls: [
    {
      key: "speed",
      label: "动画速度",
      min: 10,
      max: 100,
      step: 5,
      suffix: "%",
      visibleWhenVariants: [
        WashingMachineMode.WashWaterPath,
        WashingMachineMode.DriveCutaway,
        WashingMachineMode.SpinSuspension,
        WashingMachineMode.DrainPath,
      ],
    },
    {
      key: "primary",
      label: "示意水位",
      min: 0,
      max: 70,
      step: 5,
      suffix: "%",
      visibleWhenVariants: [WashingMachineMode.WashWaterPath],
    },
    {
      key: "secondary",
      label: "剖视强调",
      min: 20,
      max: 85,
      step: 5,
      suffix: "%",
      visibleWhenVariants: [
        WashingMachineMode.WashWaterPath,
        WashingMachineMode.DriveCutaway,
        WashingMachineMode.SpinSuspension,
        WashingMachineMode.DrainPath,
      ],
    },
  ],
  variantLabel: "教学模式",
  variants: [...washingMachineModeLabels],
  showDirectionControl: false,
  supportsPartAssembly: true,
  assemblyVariants: [WashingMachineMode.Assembly],
  referenceModel: {
    manufacturer: "LG",
    model: "WM4000HWA",
    productType: "4.5 cu. ft. 前置式滚筒洗衣机",
    capacity: "4.5 cu. ft.",
    hasDryer: false,
    driveType: "direct-drive",
    motorType: "后置永磁直驱电机（教学拓扑）",
    outerTubConstruction: "前后壳教学分段；具体材料、焊接或螺栓边界待型号级零件图确认",
    sourceIds: [PRODUCT, SUPPORT, MANUAL, ENGINEERING],
    confirmedFacts: [
      "LG 官方产品页确认 WM4000HWA 为 4.5 cu. ft. 前置式洗衣机",
      "官方页面确认 TurboWash 360、蒸汽和钢化玻璃门等产品边界",
      "官方支持页单列 Direct Drive Motor 与 Stainless Steel Drum",
    ],
    engineeringInferences: [
      "内筒、主轴、轴承、外筒和后置直驱系统采用前置直驱滚筒的正确机械拓扑",
      "进水经阀与分配器进入外筒，排水从外筒低点经泵过滤器排出",
      "压力式水位检测以气室、细管和上部压力传感器表达",
    ],
    teachingSimplifications: [
      "未获得原厂 CAD、完整维修手册和型号专用爆炸图的尺寸不作为维修尺寸",
      "紧固件数量、线束走向、壳体加强筋和部分软管形状经过简化",
      "未确认的加热器、蒸汽发生路径和 TurboWash 专有喷淋件不在当前模型中伪造",
    ],
    accuracyStatement:
      "官方资料用于固定型号、容量、前置式、直驱和功能边界；内部模型用于解释正确的装配拓扑、运动和流向，不声称复刻 LG 原厂 CAD、维修尺寸或批次差异。",
  },
  partManuals: washingMachineParts,
  quickSummary:
    "水经进水阀和洗涤剂分配器进入外筒，再通过内筒孔接触衣物；后置直驱转子通过主轴驱动内筒，外筒和固定在其上的配重由上部弹簧悬挂、下部减震器约束；排水从外筒最低点经集水波纹管、过滤器和排水泵流向机外。",
  formula: "脱水偏载教学关系：离心加速度 a = ω²r；本页不计算真实阻尼、模态和控制算法",
  parts: washingMachineParts.map((part) => ({ name: part.name, role: part.function })),
  knowledge: [
    {
      id: "reference",
      title: "参考机型与证据边界",
      summary: "不把产品宣传页能够确认的边界，扩张成未经证实的内部维修尺寸。",
      items: [
        {
          title: "官方确认",
          description: "型号、4.5 cu. ft. 容量、前置式、直驱电机、不锈钢内筒以及公开功能由 LG 产品与支持资料确认。",
          sourceIds: [PRODUCT, SUPPORT],
        },
        {
          title: "工程推断",
          description: "轴系、水路、悬挂和排水采用前置直驱滚筒的正确系统拓扑，但未确认的支架、紧固件和专有组件保持教学简化。",
          sourceIds: [MANUAL, ENGINEERING],
        },
      ],
    },
    {
      id: "water-path",
      title: "水路与水位检测",
      summary: "外筒储水，内筒穿孔；压力传感器不直接浸入洗涤水。",
      items: [
        {
          title: "进水与投放",
          description: "清水先经过进水阀和洗涤剂分配器，再通过波纹管进入外筒。",
          sourceIds: [MANUAL, ENGINEERING],
        },
        {
          title: "压力水位",
          description: "外筒低位气室内的空气压力通过细管传到上部传感器，用于推断水位。",
          sourceIds: [ENGINEERING],
        },
        {
          title: "排水",
          description: "水从外筒最低点进入集水波纹管，经泵过滤器和排水泵进入机外排水软管。",
          sourceIds: [MANUAL, ENGINEERING],
        },
      ],
    },
    {
      id: "drive-suspension",
      title: "直驱轴系与悬挂减震",
      summary: "内筒高速旋转，外筒总成只允许有限摆动，机壳保持固定。",
      items: [
        {
          title: "同轴驱动",
          description: "转子、主轴、三脚架和内筒保持同轴；定子和轴承座固定在外筒后部。",
          sourceIds: [SUPPORT, ENGINEERING],
        },
        {
          title: "悬挂总成",
          description: "外筒、配重和固定在外筒上的组件共同摆动；弹簧承重，减震器耗散振动能量。",
          sourceIds: [ENGINEERING, PERFORMANCE],
        },
      ],
    },
    {
      id: "assembly",
      title: "受约束拆装",
      summary: "拆装按钮执行零件 ID 依赖，不再只是任意爆炸图。",
      items: [
        {
          title: "拆卸依赖",
          description: "未拆除前置面板、卡箍或驱动件时，内部零件的拆卸操作会被拒绝并高亮阻挡零件。",
          sourceIds: [MANUAL, SAFETY],
        },
        {
          title: "安全边界",
          description: "实际维修涉及残水、锐边、配重、弹簧储能和永磁转子吸力，必须使用具体型号官方资料。",
          sourceIds: [SAFETY],
        },
      ],
    },
  ],
  getMetrics: (values) => {
    const mode = washingMachineModeLabels[values.variant] ?? washingMachineModeLabels[0];
    return [
      { label: "参考机型", value: "WM4000HWA", note: "LG 4.5 cu. ft. 前置直驱" },
      { label: "当前模式", value: mode, note: values.variant === WashingMachineMode.Assembly ? "执行拆装依赖" : "按观察顺序阅读" },
      { label: "运动边界", value: "内筒旋转", note: "外筒总成只做有限摆动" },
      { label: "动画参数", value: `${number(values.speed, 0)}%`, note: values.variant === WashingMachineMode.WashWaterPath ? `示意水位 ${number(values.primary, 0)}%` : "教学速度，不是真实 rpm" },
    ];
  },
  getConclusion: (values) => {
    const conclusions = [
      "清水经过进水阀和分配器进入外筒，水通过内筒孔接触衣物；气室和压力细管把水位变化传给上部压力传感器。",
      "后置直驱转子通过主轴和三脚架带动内筒；定子、轴承座和外筒不随内筒旋转。",
      "偏载使悬挂外筒总成产生有限摆动；配重增加惯量，弹簧承重，减震器耗散摆动能量，机壳保持固定。",
      "排水从外筒最低点开始，依次经过集水波纹管、泵过滤器、排水泵和机外排水软管。",
      "拆装模式已暂停运行原理动画。零件只有在前置零件已拆下时才能移出，装回时执行反向依赖。",
    ];
    return conclusions[values.variant] ?? conclusions[0];
  },
};
