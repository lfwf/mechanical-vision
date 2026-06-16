import type { PartManualDefinition, PartEvidenceStatus } from "../../../types/experiment";

const PRODUCT = "LG-WM4000HWA-PRODUCT";
const SUPPORT = "LG-WM4000HWA-SUPPORT";
const MANUAL = "LG-WM4000HWA-OWNER-MANUAL";
const ENGINEERING = "WM-FRONT-LOAD-ENGINEERING-TOPOLOGY";
const SAFETY = "IEC-60335-2-7";

type Seed = [
  id: string,
  name: string,
  partCode: string,
  system: string,
  location: string,
  functionText: string,
  removalOrder: number,
  prerequisitePartIds: string[],
  removalDirection: string,
  assemblyGroup: string,
  detachable: boolean,
  evidenceStatus: PartEvidenceStatus,
];

const seeds: Seed[] = [
  ["wm-cabinet-frame", "机壳骨架与底座", "CAB-00", "机壳与操作界面", "整机固定参考系，包含左右侧壁、上梁和底架。", "承载固定件，并为悬挂弹簧、减震器、控制板和泵提供安装点。", 0, [], "不可拆卸；作为装配参考坐标。", "cabinet", false, "confirmed"],
  ["wm-top-cover", "顶盖", "CAB-01", "机壳与操作界面", "整机顶部。", "覆盖上部水路、电控和悬挂弹簧。", 1, [], "向后滑动后向上移出。", "cabinet", true, "confirmed"],
  ["wm-detergent-drawer", "洗涤剂抽屉", "WAT-01", "进水与投放系统", "控制面板左上方。", "容纳主洗、预洗和柔顺剂。", 2, [], "沿抽屉导轨向前拉出。", "water-inlet", true, "confirmed"],
  ["wm-control-panel", "控制面板总成", "CTL-01", "机壳与操作界面", "整机前上方。", "接收程序选择并显示状态。", 3, ["wm-top-cover", "wm-detergent-drawer"], "向前上方翻出。", "cabinet", true, "confirmed"],
  ["wm-door", "玻璃门总成", "DOR-01", "门组件", "前面板中央。", "封闭装载口并与门锁形成联锁。", 4, [], "支撑门体后沿铰链法向向前移出。", "door", true, "confirmed"],
  ["wm-bellow-outer-clamp", "门封外卡箍", "DOR-02", "门组件", "门封外圈与前面板门洞之间。", "把门封外唇压紧在前面板槽内。", 5, ["wm-door"], "沿筒口轴向向前取出。", "door", true, "engineering-inference"],
  ["wm-door-lock", "门锁组件", "DOR-03", "门组件", "前面板门洞右侧。", "确认机门闭合并在运行时锁止。", 6, ["wm-bellow-outer-clamp"], "向机内退让后从前侧取出。", "door", true, "engineering-inference"],
  ["wm-front-panel", "前面板", "CAB-02", "机壳与操作界面", "整机正面。", "支承门、门锁和门封外圈。", 7, ["wm-control-panel", "wm-bellow-outer-clamp", "wm-door-lock"], "沿正 Z 方向向前移出。", "cabinet", true, "engineering-inference"],
  ["wm-bellow-inner-clamp", "门封内卡箍", "DOR-04", "门组件", "门封内圈与外筒前口之间。", "把门封内唇固定在悬挂外筒上。", 8, ["wm-front-panel"], "沿筒口轴向向前取出。", "door", true, "engineering-inference"],
  ["wm-bellow", "门封波纹管", "DOR-05", "门组件", "连接前面板门洞与外筒前口。", "在外筒摆动时保持装载口水密。", 9, ["wm-bellow-inner-clamp"], "沿正 Z 方向从外筒口剥离。", "door", true, "engineering-inference"],
  ["wm-rear-cover", "后盖板", "CAB-03", "机壳与操作界面", "整机后侧。", "遮蔽直驱电机、排水软管和线束。", 10, [], "沿负 Z 方向向后移出。", "cabinet", true, "engineering-inference"],
  ["wm-rotor-bolt", "转子中心螺栓", "DRV-01", "驱动系统", "直驱转子中心。", "将转子锁紧在内筒主轴上。", 11, ["wm-rear-cover"], "沿主轴负 Z 方向旋出并移走。", "drive", true, "engineering-inference"],
  ["wm-rotor", "直驱转子", "DRV-02", "驱动系统", "外筒后部最外侧。", "永磁转子直接带动主轴和内筒。", 12, ["wm-rotor-bolt"], "克服磁吸力沿负 Z 方向移出。", "drive", true, "confirmed"],
  ["wm-stator", "直驱定子与位置传感器", "DRV-03", "驱动系统", "固定在外筒后壳。", "产生旋转磁场并检测转子位置。", 13, ["wm-rotor"], "断开线束后沿负 Z 方向移出。", "drive", true, "confirmed"],
  ["wm-inlet-valve", "多路进水阀", "WAT-02", "进水与投放系统", "机壳后上方。", "按程序打开供水支路。", 14, ["wm-top-cover"], "从后上方安装面移出。", "water-inlet", true, "engineering-inference"],
  ["wm-dispenser", "分配器壳体", "WAT-03", "进水与投放系统", "洗涤剂抽屉后方。", "让进水冲过洗涤剂仓并混合。", 15, ["wm-top-cover", "wm-detergent-drawer", "wm-control-panel"], "向前上方移出。", "water-inlet", true, "engineering-inference"],
  ["wm-inlet-hose", "分配器至外筒波纹管", "WAT-04", "进水与投放系统", "分配器下方至外筒上部。", "把含洗涤剂水送入外筒。", 16, ["wm-dispenser"], "释放两端卡箍后沿管路取出。", "water-inlet", true, "engineering-inference"],
  ["wm-pressure-sensor", "压力式水位传感器", "SEN-01", "进水与投放系统", "机壳上部。", "通过封闭空气柱压力推断水位。", 17, ["wm-top-cover"], "断开细管和插头后向上移出。", "water-level", true, "engineering-inference"],
  ["wm-pressure-chamber", "气室与压力细管", "SEN-02", "进水与投放系统", "外筒低位侧面连接至上部传感器。", "把外筒水位变化转换为空气压力变化。", 18, ["wm-front-panel", "wm-pressure-sensor"], "释放气室和细管固定点后移出。", "water-level", true, "engineering-inference"],
  ["wm-drain-filter", "泵过滤器与检修盖", "DRN-01", "排水系统", "整机前下方。", "拦截硬币、纤维和小异物。", 19, [], "先排空残水，再沿前方旋出过滤器。", "drain", true, "engineering-inference"],
  ["wm-drain-pump", "排水泵", "DRN-02", "排水系统", "底架前下方。", "将过滤后的水输送到排水软管。", 20, ["wm-front-panel", "wm-drain-filter"], "断开线束和软管后向前下方移出。", "drain", true, "engineering-inference"],
  ["wm-sump-hose", "外筒集水波纹管", "DRN-03", "排水系统", "外筒最低点至泵过滤腔。", "依靠重力把水汇集到泵入口。", 21, ["wm-front-panel", "wm-drain-pump"], "释放卡箍后沿下方移出。", "drain", true, "engineering-inference"],
  ["wm-drain-hose", "机外排水软管", "DRN-04", "排水系统", "排水泵出口至机壳后上方。", "把排水泵输出的水送到机外。", 22, ["wm-rear-cover", "wm-drain-pump"], "沿后方管夹顺序取出。", "drain", true, "engineering-inference"],
  ["wm-front-counterweight", "前配重块", "SUS-01", "悬挂与减振系统", "外筒前部。", "增加悬挂总成惯量并降低振幅变化。", 23, ["wm-front-panel", "wm-bellow"], "支撑重量后沿正 Z 方向移出。", "suspension", true, "engineering-inference"],
  ["wm-top-counterweight", "顶部配重块", "SUS-02", "悬挂与减振系统", "外筒顶部。", "增加外筒总成惯量并改善稳定性。", 24, ["wm-top-cover"], "支撑重量后向上移出。", "suspension", true, "engineering-inference"],
  ["wm-left-damper", "左减震器", "SUS-03", "悬挂与减振系统", "外筒左下方至底架。", "耗散外筒摆动能量。", 25, ["wm-front-panel", "wm-front-counterweight"], "释放上下固定销后沿杆轴移出。", "suspension", true, "engineering-inference"],
  ["wm-right-damper", "右减震器", "SUS-04", "悬挂与减振系统", "外筒右下方至底架。", "耗散外筒摆动能量。", 26, ["wm-front-panel", "wm-front-counterweight"], "释放上下固定销后沿杆轴移出。", "suspension", true, "engineering-inference"],
  ["wm-left-spring", "左悬挂弹簧", "SUS-05", "悬挂与减振系统", "机壳左上梁至外筒吊耳。", "承受外筒总成静载并允许位移。", 27, ["wm-top-cover", "wm-left-damper", "wm-right-damper", "wm-top-counterweight"], "可靠托住外筒后解除挂钩。", "suspension", true, "engineering-inference"],
  ["wm-right-spring", "右悬挂弹簧", "SUS-06", "悬挂与减振系统", "机壳右上梁至外筒吊耳。", "承受外筒总成静载并允许位移。", 28, ["wm-top-cover", "wm-left-damper", "wm-right-damper", "wm-top-counterweight"], "可靠托住外筒后解除挂钩。", "suspension", true, "engineering-inference"],
  ["wm-outer-tub-front", "外筒前半壳", "TUB-01", "外筒与密封系统", "悬挂外筒前半部。", "容纳洗涤水并形成门封安装口。", 29, ["wm-bellow", "wm-front-counterweight", "wm-left-spring", "wm-right-spring", "wm-sump-hose", "wm-inlet-hose"], "解除壳体接合后沿正 Z 方向分离。", "tub", true, "engineering-inference"],
  ["wm-inner-drum", "不锈钢内筒", "TUB-02", "外筒与密封系统", "外筒内部。", "容纳衣物，低速翻滚并在脱水时排出水分。", 30, ["wm-outer-tub-front", "wm-rotor", "wm-stator"], "支撑重量后沿正 Z 方向退出主轴。", "drum", true, "confirmed"],
  ["wm-spider-shaft", "内筒三脚架与主轴", "TUB-03", "外筒与密封系统", "内筒后壁至外筒后部轴承。", "把内筒载荷和电机转矩传给主轴。", 31, ["wm-inner-drum"], "沿内筒后部安装面分离。", "drum", true, "engineering-inference"],
  ["wm-bearing-seal", "轴承、油封与轴承座", "TUB-04", "外筒与密封系统", "外筒后壳中心。", "支撑主轴旋转并隔离洗涤水。", 32, ["wm-inner-drum", "wm-spider-shaft"], "从外筒后部轴承座方向分解。", "tub", true, "engineering-inference"],
  ["wm-outer-tub-rear", "外筒后半壳", "TUB-05", "外筒与密封系统", "悬挂外筒后半部。", "承载轴承座、定子安装面和水路接口。", 33, ["wm-outer-tub-front", "wm-inner-drum", "wm-bearing-seal"], "沿负 Z 方向从装配中心移出。", "tub", true, "engineering-inference"],
  ["wm-main-pcb", "主控制板与电控盒", "CTL-02", "驱动系统", "机壳后上部。", "协调阀、泵、门锁、电机和传感器。", 34, ["wm-top-cover"], "断开线束后从上部安装位移出。", "control", true, "engineering-inference"],
];

const defaultsBySystem: Record<string, Pick<PartManualDefinition, "connections" | "commonFaults" | "faultSymptoms">> = {
  "机壳与操作界面": { connections: ["通过螺钉、卡扣或钣金定位连接机壳和相邻面板"], commonFaults: ["固定件松动", "卡扣或钣金边缘变形"], faultSymptoms: ["运行异响", "面板间隙不均或振动"] },
  "门组件": { connections: ["连接前面板门洞、门锁或外筒装载口"], commonFaults: ["密封老化或固定件松脱", "门锁或铰链磨损"], faultSymptoms: ["门口漏水", "门锁报警或机门下垂"] },
  "进水与投放系统": { connections: ["上游连接供水或分配器，下游连接外筒及水位检测支路"], commonFaults: ["水垢、堵塞或软管松脱", "传感或阀件失效"], faultSymptoms: ["进水缓慢", "水位异常、漏水或程序中止"] },
  "排水系统": { connections: ["从外筒最低点经泵过滤腔连接到机外排水软管"], commonFaults: ["异物堵塞", "泵磨损或卡箍松脱"], faultSymptoms: ["排水缓慢", "泵异响、残水或漏水"] },
  "悬挂与减振系统": { connections: ["连接悬挂外筒总成与固定机壳或底架"], commonFaults: ["紧固松动、弹簧疲劳或减震器衰减"], faultSymptoms: ["脱水振动增大", "碰撞机壳或低频敲击"] },
  "外筒与密封系统": { connections: ["围绕同一滚筒轴线连接内筒、外筒、主轴、轴承和密封"], commonFaults: ["轴承磨损、密封失效或结构腐蚀"], faultSymptoms: ["脱水轰鸣", "内筒晃动、漏水或偏摆"] },
  "驱动系统": { connections: ["连接主控线束、外筒后壳和内筒主轴"], commonFaults: ["绕组、传感器、连接器或紧固件异常"], faultSymptoms: ["滚筒不转", "转速异常、擦碰或故障报警"] },
};

export const washingMachineParts: PartManualDefinition[] = seeds.map((seed) => {
  const [id, name, partCode, system, location, functionText, removalOrder, prerequisitePartIds, removalDirection, assemblyGroup, detachable, evidenceStatus] = seed;
  const defaults = defaultsBySystem[system] ?? defaultsBySystem["机壳与操作界面"];
  return {
    id,
    name,
    partCode,
    system,
    location,
    function: functionText,
    connections: defaults.connections,
    removalOrder,
    prerequisitePartIds,
    removalPrerequisites: prerequisitePartIds.length ? ["先拆除配置中列出的前置零件，并确认没有软管或线束仍然连接"] : ["断电、关水并确认设备稳定，处理可能存在的残水"],
    removalDirection,
    assemblyGroup,
    removalSteps: [removalDirection, "避免零件穿过仍在安装位置的面板、软管或线束"],
    installChecks: ["定位面和卡槽完全就位", "紧固、卡箍和插接件恢复", "手动检查无干涉、松动或异常阻力"],
    commonFaults: defaults.commonFaults,
    faultSymptoms: defaults.faultSymptoms,
    warnings: ["教学模型不提供维修扭矩、螺钉规格或带电检测方法", "重型、带磁或储能零件必须由合格人员按官方资料处理"],
    sourceIds: evidenceStatus === "confirmed" ? [PRODUCT, SUPPORT, MANUAL] : [SUPPORT, MANUAL, ENGINEERING, SAFETY],
    evidenceStatus,
    precisionNote: "外形和系统边界以公开资料为依据；安装方向和相对拓扑为教学级工程表达，不等同于原厂 CAD。",
    detachable,
  };
});

export const washingMachinePartIds = washingMachineParts.map((part) => part.id);
