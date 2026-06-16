import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { FlowArrow, TubePath } from "../ScenePrimitives";
import { AnimatedFlowLines } from "./AnimatedFlowLines";
import { AnimatedFlowParticles, type FlowPoint } from "./AnimatedFlowParticles";
import { AnimatedWaterDroplets } from "./AnimatedWaterDroplets";
import { DRAIN_LINE_PATH } from "./ConnectionBundle";

const CONDENSATION_X = [-6.25, -5.25, -4.2, -3.15, -2.15];
const DRAIN_OUTLET: FlowPoint = [-1.36, 0.3, 0.09];

const CONDENSATION_PATHS: FlowPoint[][] = CONDENSATION_X.map((x, index): FlowPoint[] => [
  [x, 1.62 + (index % 2) * 0.08, -0.02],
  [x + 0.01, 1.36, 0.04],
  [x + 0.04, 1.02, 0.1],
  [x + 0.08, 0.67, 0.14],
  [x + 0.12, 0.38, 0.15],
]);

const PAN_FLOW_PATHS: FlowPoint[][] = CONDENSATION_X.map((x): FlowPoint[] => {
  const startX = x + 0.12;
  const delta = DRAIN_OUTLET[0] - startX;
  return [
    [startX, 0.38, 0.15],
    [startX + delta * 0.34, 0.36, 0.14],
    [startX + delta * 0.7, 0.33, 0.11],
    DRAIN_OUTLET,
  ];
});

export function DrainageVisualization() {
  const variant = useExperimentStore((state) => state.variant);
  const active = variant === 2;
  if (!active) return null;

  return (
    <>
      <mesh position={[-4.18, 0.35, 0.15]} renderOrder={11}>
        <boxGeometry args={[5.05, 0.035, 0.46]} />
        <meshPhysicalMaterial color="#5eb7d6" roughness={0.08} transmission={0.24} thickness={0.08} transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {CONDENSATION_PATHS.map((path, index) => (
        <TubePath key={`condensation-guide-${index}`} points={path} color="#8ed5ea" radius={0.009} opacity={0.08} />
      ))}
      <AnimatedWaterDroplets active paths={CONDENSATION_PATHS} countPerPath={4} size={0.036} speedMultiplier={0.56} gravityBias={1.72} />

      <AnimatedFlowLines active paths={PAN_FLOW_PATHS} color="#61b9d7" lineWidth={1.05} opacity={0.45} dashSize={0.12} gapSize={0.08} speedMultiplier={0.72} />
      <AnimatedFlowLines active paths={[DRAIN_LINE_PATH]} color="#2f98c4" lineWidth={1.35} opacity={0.66} dashSize={0.18} gapSize={0.1} speedMultiplier={0.9} />
      <AnimatedFlowParticles active paths={[DRAIN_LINE_PATH]} startColor="#79cfe8" endColor="#258ab7" countPerPath={12} size={0.024} speedMultiplier={0.9} opacity={0.82} depthTest />
      <TubePath points={DRAIN_LINE_PATH} color="#57abc9" radius={0.026} opacity={0.18} />

      <FlowArrow position={[5.42, -1.52, 0.38]} rotation={[-Math.PI / 2, 0, 0]} color="#2f98c4" scale={0.58} />
      <SceneLabel position={[-4.2, 3.45, 0.25]}>① 蒸发器翅片低于露点温度，水蒸气逐渐凝结成水滴</SceneLabel>
      <SceneLabel position={[-4.15, -0.35, 1.32]}>② 水滴受重力落入接水盘，并沿盘底坡度向右侧排水口汇流</SceneLabel>
      <SceneLabel position={[1.95, -1.38, -0.18]}>③ 排水管依靠重力连续下坡排放；反坡、压扁或堵塞都会造成室内漏水</SceneLabel>
    </>
  );
}
