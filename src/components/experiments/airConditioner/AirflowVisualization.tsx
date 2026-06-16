import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { FlowArrow, TubePath } from "../ScenePrimitives";

export function AirflowVisualization() {
  const variant = useExperimentStore((state) => state.variant);
  if (variant !== 1) return null;

  return (
    <>
      {[-6.4, -5.2, -4.0, -2.8].map((x) => <FlowArrow key={`in-${x}`} position={[x, 3.0, 0.8]} rotation={[Math.PI, 0, 0]} color="#77b9d3" scale={0.72} />)}
      {[-5.8, -4.7, -3.6, -2.5].map((x) => <FlowArrow key={`out-${x}`} position={[x, -0.85, 1.45]} rotation={[Math.PI / 2, 0, 0]} color="#4c9fc7" scale={0.78} />)}
      {[2.35, 3.15, 3.95, 4.75].map((x) => <FlowArrow key={`outdoor-in-${x}`} position={[x, 0.2, -1.9]} rotation={[Math.PI / 2, 0, 0]} color="#7eaeb5" scale={0.72} />)}
      {[2.8, 3.55, 4.3].map((x) => <FlowArrow key={`outdoor-out-${x}`} position={[x, 0.15, 2.05]} rotation={[-Math.PI / 2, 0, 0]} color="#dd7a5e" scale={0.88} />)}
      <TubePath points={[[-6.7, 2.85, 0.9], [-5.7, 2.0, 0.45], [-4.2, 1.1, 0.05], [-4.2, -0.55, 1.35], [-2.2, -0.9, 1.8]]} color="#64acd1" radius={0.04} opacity={0.72} />
      <TubePath points={[[-1.45, -0.05, 0.14], [-0.8, -0.45, 0.34], [0.4, -0.9, 0.42]]} color="#77a9bf" radius={0.045} opacity={0.75} />
      <SceneLabel position={[-4.2, 4.1, 0.5]}>室内空气：进风 → 过滤 → 换热 → 贯流送风</SceneLabel>
      <SceneLabel position={[4.4, 3.35, 0]}>室外空气：穿过换热器 → 前方排出</SceneLabel>
    </>
  );
}
