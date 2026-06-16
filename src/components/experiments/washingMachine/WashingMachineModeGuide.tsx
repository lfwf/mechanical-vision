import { Html } from "@react-three/drei";
import { WashingMachineMode } from "../../../data/experiments/washingMachineModes";
import { useExperimentStore } from "../../../store/useExperimentStore";

interface GuideDefinition {
  title: string;
  objective: string;
  focus: string;
  steps: string[];
  legend: Array<{ color: string; label: string }>;
}

const guides: Record<WashingMachineMode, GuideDefinition> = {
  [WashingMachineMode.WashWaterPath]: {
    title: "洗涤进水与水循环",
    objective: "沿真实水路观察清水如何经过投放系统进入外筒，并理解外筒储水、内筒穿孔。",
    focus: "进水阀、洗涤剂抽屉与分配器、进水波纹管、外筒、内筒、气室与压力传感器",
    steps: ["进水阀开启", "清水冲过洗涤剂仓", "混合水进入外筒", "水通过内筒孔接触衣物", "压力气路反馈水位"],
    legend: [
      { color: "#79b9d1", label: "清水" },
      { color: "#8ebfc2", label: "含洗涤剂水" },
      { color: "#a48db5", label: "压力气路" },
      { color: "#d6a55e", label: "动力与旋转提示" },
    ],
  },
  [WashingMachineMode.DriveCutaway]: {
    title: "滚筒驱动系统",
    objective: "从机器后侧观察定子、转子、主轴、三脚架、轴承和油封如何共同支撑并驱动内筒。",
    focus: "定子、转子、主轴、三脚架、轴承、油封、内筒和外筒后壳",
    steps: ["定子固定在外筒后壳", "转子围绕定子旋转", "转子直接连接主轴", "三脚架把转矩传给内筒", "轴承支撑主轴，油封隔离洗涤水"],
    legend: [
      { color: "#c58b4d", label: "电机磁路与转矩路径" },
      { color: "#d9bd64", label: "旋转轴线" },
      { color: "#9aa7a7", label: "固定外筒与轴承座" },
    ],
  },
  [WashingMachineMode.SpinSuspension]: {
    title: "脱水与减震",
    objective: "观察偏载随内筒高速旋转时，悬挂外筒总成如何通过配重、弹簧和减震器限制振动。",
    focus: "内筒、偏载标记、外筒、配重、左右弹簧、左右减震器和固定机壳",
    steps: ["内筒高速旋转", "偏载产生方向变化的不平衡力", "外筒总成发生有限摆动", "弹簧承重并允许位移", "减震器耗散振动能量"],
    legend: [
      { color: "#d6a55e", label: "高速旋转与偏载" },
      { color: "#6d8589", label: "悬挂和减震连接" },
      { color: "#7b807a", label: "固定在外筒上的配重" },
    ],
  },
  [WashingMachineMode.DrainPath]: {
    title: "排水路径",
    objective: "从外筒最低点开始，追踪洗涤水经过集水波纹管、泵过滤器、排水泵和排水软管流向机外。",
    focus: "外筒低点、集水波纹管、过滤器、排水泵、排水软管和前下检修口",
    steps: ["水汇集到外筒最低点", "进入集水波纹管", "过滤器拦截异物", "排水泵建立流动", "排水软管把水送出机外"],
    legend: [
      { color: "#547f9c", label: "排水" },
      { color: "#89989a", label: "排水管路与泵壳" },
      { color: "#a48b64", label: "过滤器与异物提示" },
    ],
  },
  [WashingMachineMode.Assembly]: {
    title: "零件拆装",
    objective: "按真实服务层级选择、拆下和装回零件；不满足前置条件时操作会被拒绝。",
    focus: "机壳、门组件、水路、悬挂外筒总成、轴系、直驱系统和排水系统",
    steps: ["点击零件或零件目录", "查看前置拆卸条件", "按提示拆除阻挡零件", "沿机械方向移出当前零件", "按反向依赖装回"],
    legend: [{ color: "#55c2cd", label: "当前选择或阻挡零件" }],
  },
};

export function WashingMachineModeGuide() {
  const mode = useExperimentStore((state) => state.variant) as WashingMachineMode;
  const showLabels = useExperimentStore((state) => state.showLabels);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const speed = useExperimentStore((state) => state.speed);
  const guide = guides[mode] ?? guides[WashingMachineMode.WashWaterPath];
  if (!showLabels) return null;

  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <section aria-label={`${guide.title}说明`} style={{ position: "absolute", left: 18, bottom: 18, width: 310, padding: "14px 15px", border: "1px solid rgba(75, 101, 105, 0.22)", borderRadius: 12, background: "rgba(247, 250, 248, 0.91)", boxShadow: "0 8px 24px rgba(35, 52, 55, 0.12)", backdropFilter: "blur(8px)", color: "#243235", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <strong style={{ fontSize: 16 }}>{guide.title}</strong>
          <span style={{ fontSize: 10, color: isPlaying ? "#317a66" : "#7b6860" }}>{isPlaying ? `运行中 · ${speed}%` : "已暂停"}</span>
        </div>
        <p style={{ margin: "6px 0", fontSize: 12, lineHeight: 1.55, color: "#536467" }}>{guide.objective}</p>
        <div style={{ fontSize: 11, lineHeight: 1.5, color: "#667678" }}><b>重点：</b>{guide.focus}</div>
        <ol style={{ margin: "8px 0 7px", paddingLeft: 19, fontSize: 11, lineHeight: 1.55, color: "#44575a" }}>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>{guide.legend.map((item) => <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: "#56676a" }}><i style={{ width: 9, height: 9, borderRadius: 2, background: item.color }} />{item.label}</span>)}</div>
      </section>
    </Html>
  );
}
