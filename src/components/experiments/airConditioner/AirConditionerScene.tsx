import { useRef } from "react";
import type { Group } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "../ExperimentCanvas";
import { AirflowVisualization } from "./AirflowVisualization";
import { CoolingCycle } from "./CoolingCycle";
import { FanAnimator } from "./FanAnimator";
import { IndoorUnit } from "./IndoorUnit";
import { OutdoorUnit } from "./OutdoorUnit";

function AirConditionerAssembly() {
  const indoorFanRef = useRef<Group>(null);
  const outdoorFanRef = useRef<Group>(null);
  const transparency = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const assemblyEnabled = variant === 2;
  const shellOpacity = Math.max(0.12, 1 - transparency / 100);

  return (
    <group>
      <FanAnimator indoorFanRef={indoorFanRef} outdoorFanRef={outdoorFanRef} />
      <IndoorUnit assemblyEnabled={assemblyEnabled} shellOpacity={shellOpacity} fanRef={indoorFanRef} />
      <OutdoorUnit assemblyEnabled={assemblyEnabled} shellOpacity={shellOpacity} fanRef={outdoorFanRef} />
      <CoolingCycle />
      <AirflowVisualization />

      {assemblyEnabled ? (
        <>
          <SceneLabel position={[-4.2, 5.55, 0]}>室内机 · 15 个主要组件</SceneLabel>
          <SceneLabel position={[4.4, 4.65, 0]}>室外机 · 12 个主要组件</SceneLabel>
        </>
      ) : (
        <>
          <SceneLabel position={[-4.2, 2.85, 0]}>FTXM35R 室内机</SceneLabel>
          <SceneLabel position={[4.4, 2.45, 0]}>RXM35R 室外机</SceneLabel>
        </>
      )}

      <mesh position={[0, -2.8, 0]} receiveShadow>
        <boxGeometry args={[15.8, 0.28, 7.8]} />
        <meshStandardMaterial color="#d8ddd8" metalness={0.12} roughness={0.62} />
      </mesh>
    </group>
  );
}

export default function AirConditionerScene() {
  return (
    <ExperimentCanvas camera={[13.8, 8.8, 17.2]} target={[0, 0.4, 0]} gridY={-2.95} shadowY={-2.91} background="#f1f3f0" minDistance={10} maxDistance={31}>
      <AirConditionerAssembly />
    </ExperimentCanvas>
  );
}
