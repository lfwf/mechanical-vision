import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { FlowArrow } from "../ScenePrimitives";
import { AnimatedFlowLines } from "./AnimatedFlowLines";
import { AnimatedFlowParticles, type FlowPoint } from "./AnimatedFlowParticles";

const INDOOR_INTAKE_PATHS: FlowPoint[][] = [-6.2, -5.2, -4.2, -3.2, -2.2].map((x): FlowPoint[] => [
  [x, 3.18, 0.92],
  [x, 2.62, 0.86],
  [x, 2.08, 0.66],
  [x, 1.62, 0.36],
  [x, 1.18, 0.1],
]);

const INDOOR_SUPPLY_PATHS: FlowPoint[][] = [-6.2, -5.2, -4.2, -3.2, -2.2].map((x, index): FlowPoint[] => [
  [x, 1.18, 0.1],
  [x, 0.78, 0.02],
  [x, 0.34, 0.55],
  [x + (index - 2) * 0.08, 0.02, 1.42],
  [x + (index - 2) * 0.18, -0.48, 2.5],
]);

const OUTDOOR_REAR_INTAKE: FlowPoint[][] = [
  [[3.0, -0.82, -2.2], [3.0, -0.72, -1.25], [3.18, -0.55, -0.62], [3.48, -0.3, 0.02], [3.68, -0.14, 0.76]],
  [[3.55, -0.18, -2.2], [3.55, -0.15, -1.25], [3.6, -0.1, -0.58], [3.66, -0.05, 0.02], [3.68, -0.02, 0.78]],
  [[4.1, 0.62, -2.2], [4.08, 0.55, -1.25], [3.98, 0.4, -0.58], [3.82, 0.22, 0.02], [3.7, 0.08, 0.78]],
];

const OUTDOOR_SIDE_INTAKE: FlowPoint[][] = [
  [[1.35, -0.62, -0.35], [2.0, -0.58, -0.32], [2.6, -0.45, -0.12], [3.2, -0.25, 0.3], [3.62, -0.1, 0.78]],
  [[1.35, 0.46, -0.35], [2.0, 0.42, -0.32], [2.6, 0.32, -0.12], [3.2, 0.18, 0.3], [3.62, 0.06, 0.78]],
];

const OUTDOOR_EXHAUST: FlowPoint[][] = [
  [[3.62, -0.14, 0.78], [3.68, -0.1, 1.34], [3.72, -0.06, 2.02], [3.7, -0.02, 2.78]],
  [[3.68, 0.0, 0.78], [3.7, 0.0, 1.34], [3.72, 0.02, 2.02], [3.72, 0.04, 2.92]],
  [[3.72, 0.16, 0.78], [3.74, 0.14, 1.34], [3.76, 0.12, 2.02], [3.82, 0.14, 2.78]],
];

export function AirflowVisualization() {
  const variant = useExperimentStore((state) => state.variant);
  const active = variant === 1;
  if (!active) return null;

  return (
    <>
      <AnimatedFlowLines active paths={INDOOR_INTAKE_PATHS} color="#d9965f" lineWidth={1.15} opacity={0.48} dashSize={0.2} gapSize={0.13} speedMultiplier={0.85} />
      <AnimatedFlowLines active paths={INDOOR_SUPPLY_PATHS} color="#4eb3e3" lineWidth={1.45} opacity={0.62} dashSize={0.24} gapSize={0.12} speedMultiplier={1.18} />
      <AnimatedFlowParticles active paths={INDOOR_INTAKE_PATHS} startColor="#e0a16a" endColor="#9cc8d8" countPerPath={3} size={0.025} speedMultiplier={0.85} opacity={0.7} depthTest />
      <AnimatedFlowParticles active paths={INDOOR_SUPPLY_PATHS} startColor="#8ccfe7" endColor="#3ea9dc" countPerPath={4} size={0.028} speedMultiplier={1.18} opacity={0.82} depthTest />

      <AnimatedFlowLines active paths={[...OUTDOOR_REAR_INTAKE, ...OUTDOOR_SIDE_INTAKE]} color="#6e9da9" lineWidth={1.05} opacity={0.42} dashSize={0.18} gapSize={0.14} speedMultiplier={0.82} />
      <AnimatedFlowLines active paths={OUTDOOR_EXHAUST} color="#df7654" lineWidth={1.4} opacity={0.58} dashSize={0.24} gapSize={0.12} speedMultiplier={1.08} />
      <AnimatedFlowParticles active paths={OUTDOOR_EXHAUST} startColor="#e39a63" endColor="#df6847" countPerPath={4} size={0.028} speedMultiplier={1.08} opacity={0.78} depthTest />

      {[-5.8, -4.72, -3.64, -2.56].map((x) => (
        <FlowArrow key={`supply-${x}`} position={[x, -0.48, 2.58]} rotation={[Math.PI / 2, 0, 0]} color="#4eb3e3" scale={0.58} />
      ))}
      {[3.25, 3.72, 4.18].map((x) => (
        <FlowArrow key={`outdoor-${x}`} position={[x, 0.05, 2.92]} rotation={[-Math.PI / 2, 0, 0]} color="#df7654" scale={0.64} />
      ))}

      <SceneLabel position={[-4.2, 4.18, 0.45]}>室内空气：顶部回风 → 过滤 → 穿过蒸发器 → 贯流风轮 → 前下方扇形送风</SceneLabel>
      <SceneLabel position={[4.4, 3.45, 0]}>室外空气：后侧与左侧吸入 → 穿过冷凝器 → 轴流风扇正面排热</SceneLabel>
    </>
  );
}
