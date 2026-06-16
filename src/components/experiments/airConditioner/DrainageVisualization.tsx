import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { FlowArrow, TubePath } from "../ScenePrimitives";
import { AnimatedFlowParticles, type FlowPoint } from "./AnimatedFlowParticles";
import { DRAIN_LINE_PATH } from "./ConnectionBundle";

const CONDENSATION_X = [-6.25, -5.25, -4.2, -3.15, -2.15];
const DRAIN_OUTLET: FlowPoint = [-1.36, 0.3, 0.09];

const CONDENSATION_PATHS: FlowPoint[][] = CONDENSATION_X.map((x, index) => [
  [x, 1.58 + (index % 2) * 0.08, 0.02],
  [x, 1.28, 0.08],
  [x + 0.04, 0.92, 0.12],
  [x + 0.08, 0.58, 0.15],
  [x + 0.12, 0.37, 0.15],
]);

const PAN_FLOW_PATHS: FlowPoint[][] = CONDENSATION_X.map((x) => {
  const startX = x + 0.12;
  const delta = DRAIN_OUTLET[0] - startX;
  return [
    [startX, 0.37, 0.15],
    [startX + delta * 0.35, 0.35, 0.14],
    [startX + delta * 0.72, 0.32, 0.11],
    DRAIN_OUTLET,
  ];
});

export function DrainageVisualization() {
  const variant = useExperimentStore((state) => state.variant);
  const active = variant === 2;
  if (!active) return null;

  return (
    <>
      {CONDENSATION_PATHS.map((path, index) => (
        <TubePath key={`condensation-guide-${index}`} points={path} color="#8ed5ea" radius={0.012} opacity={0.15} />
      ))}
      <TubePath points={DRAIN_LINE_PATH} color="#53a8ca" radius={0.038} opacity={0.3} />

      <AnimatedFlowParticles
        active
        paths={CONDENSATION_PATHS}
        startColor="#d9f4fb"
        endColor="#79cce6"
        countPerPath={5}
        size={0.04}
        speedMultiplier={0.48}
      />
      <AnimatedFlowParticles
        active
        paths={PAN_FLOW_PATHS}
        startColor="#8dd8ed"
        endColor="#56aecf"
        countPerPath={4}
        size={0.043}
        speedMultiplier={0.72}
      />
      <AnimatedFlowParticles
        active
        paths={[DRAIN_LINE_PATH]}
        startColor="#7fd2eb"
        endColor="#318fbd"
        countPerPath={22}
        size={0.052}
        speedMultiplier={0.82}
      />

      <FlowArrow position={[5.42, -1.52, 0.38]} rotation={[-Math.PI / 2, 0, 0]} color="#318fbd" scale={0.7} />
      <SceneLabel position={[-4.2, 3.9, 0.35]}>空气中的水蒸气在低温换热器翅片表面凝结成水滴</SceneLabel>
      <SceneLabel position={[-4.15, -0.25, 1.45]}>水滴落入接水盘，并沿盘底坡度汇集到右侧排水口</SceneLabel>
      <SceneLabel position={[2.1, -1.35, -0.25]}>排水管依靠重力排水：全程应连续下坡，不能压扁、反坡或形成存水高点</SceneLabel>
    </>
  );
}
