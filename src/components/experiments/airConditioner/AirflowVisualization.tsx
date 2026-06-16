import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { FlowArrow, TubePath } from "../ScenePrimitives";
import { DRAIN_LINE_PATH } from "./ConnectionBundle";

export function AirflowVisualization() {
  const variant = useExperimentStore((state) => state.variant);
  if (variant !== 1) return null;

  return (
    <>
      {[-6.5, -5.3, -4.1, -2.9].map((x) => <FlowArrow key={`in-${x}`} position={[x, 2.95, 0.82]} rotation={[Math.PI, 0, 0]} color="#77b9d3" scale={0.72} />)}
      {[-5.75, -4.65, -3.55, -2.45].map((x) => <FlowArrow key={`out-${x}`} position={[x, -0.02, 1.48]} rotation={[Math.PI / 2, 0, 0]} color="#4c9fc7" scale={0.78} />)}
      {[2.35, 3.15, 3.95, 4.75].map((x) => <FlowArrow key={`outdoor-in-${x}`} position={[x, 0.2, -1.9]} rotation={[Math.PI / 2, 0, 0]} color="#7eaeb5" scale={0.72} />)}
      {[3.05, 3.8, 4.55].map((x) => <FlowArrow key={`outdoor-out-${x}`} position={[x, 0.15, 2.05]} rotation={[-Math.PI / 2, 0, 0]} color="#dd7a5e" scale={0.88} />)}
      <TubePath points={[[-6.7, 2.85, 0.9], [-5.65, 2.2, 0.58], [-4.2, 1.72, 0.36], [-4.2, 0.55, 0.18], [-4.2, 0.02, 1.25], [-2.2, -0.05, 1.72]]} color="#64acd1" radius={0.04} opacity={0.72} />
      <TubePath points={DRAIN_LINE_PATH} color="#5aa8c6" radius={0.037} opacity={0.84} />
      {[[0.9, -0.35, -0.5], [2.6, -0.78, -0.46], [4.15, -1.12, -0.08]].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[0.055, 14, 12]} />
          <meshStandardMaterial color="#6bb5d0" emissive="#447f96" emissiveIntensity={0.2} />
        </mesh>
      ))}
      <SceneLabel position={[-4.2, 4.1, 0.5]}>室内空气：顶部进风 → 过滤 → 三段换热器 → 贯流送风</SceneLabel>
      <SceneLabel position={[4.4, 3.35, 0]}>室外空气：后侧 / 左侧吸入 → 正面排出</SceneLabel>
    </>
  );
}
