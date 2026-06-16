import { Html } from "@react-three/drei";
import { useExperimentStore } from "../../../store/useExperimentStore";

/**
 * 空调演示模式说明。
 *
 * 这个组件不参与三维模型计算，只负责告诉用户：
 * 1. 当前正在观察什么系统；
 * 2. 应该沿什么顺序理解动画；
 * 3. 不同颜色分别代表什么介质或状态。
 *
 * 使用 Html fullscreen 将普通 React DOM 覆盖在 Canvas 上方，
 * 因此文字始终保持清晰，不会随着相机远近缩放。
 */
interface ModeGuide {
  title: string;
  objective: string;
  focus: string;
  steps: string[];
  legend: Array<{ color: string; label: string }>;
}

const MODE_GUIDES: ModeGuide[] = [
  {
    title: "制冷循环",
    objective: "观察制冷剂如何在封闭管路中搬运热量",
    focus: "压缩机、室外换热器、电子膨胀阀、室内换热器、气管与液管",
    steps: ["压缩", "室外放热并冷凝", "节流降压", "室内吸热并蒸发"],
    legend: [
      { color: "#df604b", label: "高温高压气体" },
      { color: "#e5a044", label: "高压液体" },
      { color: "#4d9ed0", label: "低温低压混合物" },
      { color: "#62c2c4", label: "低压回气" },
    ],
  },
  {
    title: "空气流动",
    objective: "区分室内循环空气与室外换热空气，两者不会互相混合",
    focus: "过滤网、室内换热器、贯流风轮、室外冷凝器、轴流风扇",
    steps: ["室内顶部回风", "过滤与换热", "前下方送风", "室外后侧/左侧吸风并正面排热"],
    legend: [
      { color: "#d9965f", label: "室内较暖回风" },
      { color: "#4eb3e3", label: "降温后的送风" },
      { color: "#6e9da9", label: "室外环境空气" },
      { color: "#df7654", label: "室外排热空气" },
    ],
  },
  {
    title: "冷凝水排放",
    objective: "观察空气中的水蒸气如何变成水滴并依靠重力排出",
    focus: "室内换热器翅片、接水盘、排水口、排水软管坡度",
    steps: ["翅片表面凝结", "水滴受重力下落", "接水盘内汇流", "排水管连续下坡排放"],
    legend: [
      { color: "#79cfe8", label: "冷凝水" },
      { color: "#2f98c4", label: "排水方向" },
    ],
  },
  {
    title: "零件拆装",
    objective: "观察主要零件的安装层级、遮挡关系和拆出方向",
    focus: "室内机 15 个组件、室外机 12 个组件",
    steps: ["点击选择零件", "查看零件说明", "单独拆下或装回", "全部展开检查层级"],
    legend: [
      { color: "#55c2cd", label: "当前选择的零件" },
    ],
  },
];

export function AirConditionerModeGuide() {
  const variant = useExperimentStore((state) => state.variant);
  const showLabels = useExperimentStore((state) => state.showLabels);
  const guide = MODE_GUIDES[variant] ?? MODE_GUIDES[0];

  if (!showLabels) return null;

  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <section
        aria-label={`${guide.title}说明`}
        style={{
          // 底部区域主要是展示台和阴影，把说明卡放这里可避免遮住室内机内部结构。
          position: "absolute",
          left: 18,
          bottom: 18,
          width: 292,
          padding: "14px 15px",
          border: "1px solid rgba(84, 112, 116, 0.24)",
          borderRadius: 12,
          background: "rgba(247, 250, 248, 0.9)",
          boxShadow: "0 8px 24px rgba(35, 52, 55, 0.12)",
          backdropFilter: "blur(8px)",
          color: "#243235",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>{guide.title}</div>
        <div style={{ fontSize: 12, lineHeight: 1.55, color: "#56676a" }}>{guide.objective}</div>
        <div style={{ marginTop: 9, fontSize: 11, lineHeight: 1.5, color: "#6a797b" }}>
          <strong style={{ color: "#3a4b4e" }}>重点零件：</strong>{guide.focus}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {guide.steps.map((step, index) => (
            <span
              key={step}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 7px",
                borderRadius: 999,
                background: "rgba(92, 139, 145, 0.1)",
                fontSize: 10,
                color: "#40575b",
              }}
            >
              <b>{index + 1}</b>{step}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", marginTop: 10 }}>
          {guide.legend.map((item) => (
            <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: "#536568" }}>
              <i style={{ display: "inline-block", width: 8, height: 8, flex: "0 0 8px", borderRadius: "50%", background: item.color, boxShadow: `0 0 0 2px ${item.color}22` }} />
              {item.label}
            </span>
          ))}
        </div>
      </section>
    </Html>
  );
}
