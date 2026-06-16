import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { TubePath } from "../ScenePrimitives";
import { AnimatedFlowLines } from "./AnimatedFlowLines";
import { AnimatedFlowParticles, type FlowPoint } from "./AnimatedFlowParticles";
import { GAS_LINE_PATH, LIQUID_LINE_PATH } from "./ConnectionBundle";

const LIQUID_TO_INDOOR = [...LIQUID_LINE_PATH].reverse();
const STAGE_PATHS: FlowPoint[][] = [
  [[6.5, 0.6, -0.3], [6.05, 0.82, -0.42], [5.2, 1.02, -0.58], [4.4, 1.1, -0.66]],
  [[4.4, 1.1, -0.66], [4.18, 0.45, -0.72], [4.68, -0.2, -0.68], [5.32, -0.64, -0.58]],
  [[5.32, -0.64, -0.58], [5.9, -0.66, -0.2], ...LIQUID_TO_INDOOR, [-2.55, 0.95, -0.35], [-4.2, 1.25, -0.1]],
  [[-4.2, 1.25, -0.1], [-2.6, 0.9, -0.35], ...GAS_LINE_PATH, [6.25, -0.15, 0.02], [6.5, 0.6, -0.3]],
];

const STAGES = [
  { color: "#df604b", width: 1.25, speed: 1.08 },
  { color: "#e5a044", width: 1.15, speed: 0.92 },
  { color: "#4d9ed0", width: 1.1, speed: 1.02 },
  { color: "#62c2c4", width: 1.3, speed: 1.12 },
];

export function CoolingCycle() {
  const variant = useExperimentStore((state) => state.variant);
  const active = variant === 0;
  if (!active) return null;

  return (
    <>
      {STAGE_PATHS.map((path, index) => (
        <group key={index}>
          <TubePath points={path} color={STAGES[index].color} radius={0.026 + STAGES[index].width * 0.006} opacity={0.2} />
          <AnimatedFlowLines
            active
            paths={[path]}
            color={STAGES[index].color}
            lineWidth={STAGES[index].width}
            opacity={0.7}
            dashSize={0.18}
            gapSize={0.1}
            speedMultiplier={STAGES[index].speed}
            depthTest={false}
          />
          <AnimatedFlowParticles
            active
            paths={[path]}
            startColor={STAGES[index].color}
            endColor={STAGES[index].color}
            countPerPath={8}
            size={0.023}
            speedMultiplier={STAGES[index].speed}
            opacity={0.86}
            depthTest={false}
          />
        </group>
      ))}

      <SceneLabel position={[0.5, 4.15, -0.55]}>制冷剂沿铜管内部循环；移动虚线表示方向，颜色表示不同压力、温度和相态阶段</SceneLabel>
      <SceneLabel position={[6.45, 1.72, -0.2]}>1 压缩：低压气体 → 高温高压气体（红）</SceneLabel>
      <SceneLabel position={[4.25, 2.65, -0.75]}>2 室外放热：气体逐步冷凝成高压液体（橙）</SceneLabel>
      <SceneLabel position={[5.35, -1.55, -0.65]}>3 节流：压力骤降，形成低温低压混合物（蓝）</SceneLabel>
      <SceneLabel position={[-4.2, 2.72, -0.45]}>4 室内吸热：制冷剂蒸发并带走室内热量（青）</SceneLabel>
    </>
  );
}
