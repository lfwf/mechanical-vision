import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { FlowArrow, TubePath } from "../ScenePrimitives";
import { AnimatedFlowParticles, type FlowPoint } from "./AnimatedFlowParticles";

const INDOOR_AIR_PATHS: FlowPoint[][] = [-6.25, -5.25, -4.2, -3.15, -2.2].map((x): FlowPoint[] => [
  [x, 3.08, 0.92],
  [x, 2.35, 0.82],
  [x, 1.82, 0.62],
  [x, 1.28, 0.25],
  [x, 0.72, 0.08],
  [x, 0.22, 0.74],
  [x + 0.25, -0.12, 1.62],
]);

const OUTDOOR_REAR_AIR_PATHS: FlowPoint[][] = [
  [[3.0, -0.82, -2.05], [3.0, -0.72, -0.82], [3.48, -0.38, -0.05], [3.68, -0.16, 0.88], [3.72, -0.1, 2.02]],
  [[3.55, -0.18, -2.05], [3.55, -0.15, -0.82], [3.66, -0.08, -0.04], [3.68, -0.03, 0.9], [3.72, 0, 2.02]],
  [[4.1, 0.62, -2.05], [4.08, 0.55, -0.82], [3.84, 0.28, -0.02], [3.7, 0.12, 0.9], [3.72, 0.05, 2.02]],
];

const OUTDOOR_SIDE_AIR_PATHS: FlowPoint[][] = [
  [[1.55, -0.58, -0.3], [2.1, -0.55, -0.3], [2.72, -0.35, -0.05], [3.45, -0.16, 0.72], [3.72, -0.08, 1.98]],
  [[1.55, 0.42, -0.3], [2.1, 0.4, -0.3], [2.72, 0.24, -0.05], [3.45, 0.1, 0.72], [3.72, 0.04, 1.98]],
];

const INDOOR_GUIDE: FlowPoint[] = [[-4.2, 3.08, 0.92], [-4.2, 1.82, 0.62], [-4.2, 0.72, 0.08], [-4.2, 0.22, 0.74], [-3.95, -0.12, 1.62]];
const OUTDOOR_GUIDE: FlowPoint[] = [[3.55, -0.18, -2.05], [3.55, -0.15, -0.82], [3.66, -0.08, -0.04], [3.68, -0.03, 0.9], [3.72, 0, 2.02]];

export function AirflowVisualization() {
  const variant = useExperimentStore((state) => state.variant);
  const active = variant === 1;
  if (!active) return null;

  return (
    <>
      <TubePath points={INDOOR_GUIDE} color="#73bfe2" radius={0.026} opacity={0.22} />
      <TubePath points={OUTDOOR_GUIDE} color="#d88665" radius={0.026} opacity={0.2} />
      <AnimatedFlowParticles active paths={INDOOR_AIR_PATHS} startColor="#dca06a" endColor="#55b7e6" countPerPath={9} size={0.06} speedMultiplier={1.05} />
      <AnimatedFlowParticles active paths={OUTDOOR_REAR_AIR_PATHS} startColor="#6fa9b8" endColor="#e17855" countPerPath={8} size={0.06} speedMultiplier={0.92} />
      <AnimatedFlowParticles active paths={OUTDOOR_SIDE_AIR_PATHS} startColor="#6fa9b8" endColor="#e17855" countPerPath={8} size={0.06} speedMultiplier={0.92} />
      {[-5.75, -4.65, -3.55, -2.45].map((x) => <FlowArrow key={`supply-${x}`} position={[x, -0.18, 1.78]} rotation={[Math.PI / 2, 0, 0]} color="#55b7e6" scale={0.68} />)}
      {[3.05, 3.72, 4.35].map((x) => <FlowArrow key={`outdoor-${x}`} position={[x, 0.05, 2.16]} rotation={[-Math.PI / 2, 0, 0]} color="#e17855" scale={0.78} />)}
      <SceneLabel position={[-4.2, 4.1, 0.5]}>室内空气：顶部回风 → 过滤 → 换热降温 → 贯流风轮 → 向前下方送风</SceneLabel>
      <SceneLabel position={[4.4, 3.35, 0]}>室外空气：后侧与左侧吸入 → 穿过换热器 → 风扇从正面排出热风</SceneLabel>
      <SceneLabel position={[-1.1, 2.05, 1.15]}>橙色表示进入室内机的较暖空气，蓝色表示换热后的送风</SceneLabel>
    </>
  );
}
