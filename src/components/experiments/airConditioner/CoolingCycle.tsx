import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { TubePath } from "../ScenePrimitives";
import { AnimatedFlowLines } from "./AnimatedFlowLines";
import { AnimatedFlowParticles, type FlowPoint } from "./AnimatedFlowParticles";
import { GAS_LINE_PATH, LIQUID_LINE_PATH } from "./ConnectionBundle";

/**
 * 制冷循环动画。
 *
 * 这里把完整闭环拆成四段：
 * 1. 压缩机排气；
 * 2. 室外换热器放热冷凝；
 * 3. 电子膨胀阀节流后，经液管进入室内机；
 * 4. 室内换热器吸热蒸发，经气管返回压缩机。
 *
 * 注意：颜色是教学编码，不代表真实制冷剂颜色。
 */

// 液管的公共路径在 ConnectionBundle 中按“室内机 → 室外机”定义。
// 制冷时液体实际从室外机流向室内机，因此这里复制后反转，避免修改原数组。
const LIQUID_TO_INDOOR = [...LIQUID_LINE_PATH].reverse();

// 四段路径首尾相接，形成一个连续闭环。
const STAGE_PATHS: FlowPoint[][] = [
  // 1. 压缩机排气：低压回气被压缩为高温高压气体。
  [[6.5, 0.6, -0.3], [6.05, 0.82, -0.42], [5.2, 1.02, -0.58], [4.4, 1.1, -0.66]],
  // 2. 室外放热：制冷剂在冷凝器中逐步冷凝。
  [[4.4, 1.1, -0.66], [4.18, 0.45, -0.72], [4.68, -0.2, -0.68], [5.32, -0.64, -0.58]],
  // 3. 节流与供液：电子膨胀阀产生压降，低温混合物进入室内机。
  [[5.32, -0.64, -0.58], [5.9, -0.66, -0.2], ...LIQUID_TO_INDOOR, [-2.55, 0.95, -0.35], [-4.2, 1.25, -0.1]],
  // 4. 室内吸热与回气：制冷剂蒸发后通过粗气管返回压缩机。
  [[-4.2, 1.25, -0.1], [-2.6, 0.9, -0.35], ...GAS_LINE_PATH, [6.25, -0.15, 0.02], [6.5, 0.6, -0.3]],
];

// 每一阶段单独设置颜色、线宽和相对速度，便于区分状态。
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
          {/* 半透明实体管用于给移动虚线提供稳定的通道背景。 */}
          <TubePath
            points={path}
            color={STAGES[index].color}
            radius={0.026 + STAGES[index].width * 0.006}
            opacity={0.2}
          />

          {/* 移动虚线承担主要方向表达。 */}
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

          {/* 少量发光点帮助用户感知连续运动，不用于表示制冷剂颗粒大小。 */}
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
