import { useRef } from "react";
import type { Group } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "../ExperimentCanvas";
import { AirflowVisualization } from "./AirflowVisualization";
import { ConnectionBundle } from "./ConnectionBundle";
import { CoolingCycle } from "./CoolingCycle";
import { DrainageVisualization } from "./DrainageVisualization";
import { FanAnimator } from "./FanAnimator";
import { IndoorUnit } from "./IndoorUnit";
import { OutdoorUnit } from "./OutdoorUnit";

const CAMERA_PRESETS: Array<{
  position: [number, number, number];
  target: [number, number, number];
}> = [
  { position: [12.6, 6.8, 15.2], target: [0, 0.42, 0.05] },
  { position: [11.2, 5.6, 14.2], target: [-0.2, 0.55, 0.45] },
  { position: [6.8, 4.4, 10.6], target: [-3.95, 0.75, 0.35] },
  { position: [14.2, 8.8, 17.5], target: [0, 0.45, 0] },
];

function AirConditionerAssembly() {
  const indoorFanRef = useRef<Group>(null);
  const outdoorFanRef = useRef<Group>(null);
  const cutawayPercent = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const assemblyEnabled = variant === 3;
  const drainageMode = variant === 2;
  const cutaway = Math.min(1, Math.max(0, cutawayPercent / 100));
  const shellOpacity = 1 - 0.86 * Math.pow(cutaway, 0.68);

  return (
    <group>
      <FanAnimator indoorFanRef={indoorFanRef} outdoorFanRef={outdoorFanRef} />
      <IndoorUnit assemblyEnabled={assemblyEnabled} shellOpacity={shellOpacity} fanRef={indoorFanRef} variant={variant} />
      <group visible={!drainageMode}>
        <OutdoorUnit assemblyEnabled={assemblyEnabled} shellOpacity={shellOpacity} fanRef={outdoorFanRef} variant={variant} />
      </group>
      <ConnectionBundle variant={variant} />
      <CoolingCycle />
      <AirflowVisualization />
      <DrainageVisualization />

      <mesh position={[-4.2, 1.15, -1.38]} receiveShadow>
        <boxGeometry args={[7.1, 4.8, 0.12]} />
        <meshStandardMaterial color="#e3e7e4" roughness={0.88} metalness={0.01} />
      </mesh>

      {assemblyEnabled ? (
        <>
          <SceneLabel position={[-4.2, 5.55, 0]}>室内机 · 15 个主要组件</SceneLabel>
          <SceneLabel position={[4.4, 4.65, 0]}>室外机 · 12 个主要组件</SceneLabel>
        </>
      ) : drainageMode ? (
        <SceneLabel position={[-4.2, 3.95, 0.2]}>排水模式：聚焦蒸发器、接水盘、排水口和排水软管</SceneLabel>
      ) : (
        <>
          <SceneLabel position={[-4.2, 3.35, 0]}>FTXM35R 室内机剖视</SceneLabel>
          <SceneLabel position={[4.4, 2.9, 0]}>RXM35R 室外机剖视</SceneLabel>
        </>
      )}

      <mesh position={[0, -2.8, 0]} receiveShadow>
        <boxGeometry args={[15.8, 0.2, 7.8]} />
        <meshStandardMaterial color="#d9deda" metalness={0.05} roughness={0.76} />
      </mesh>
    </group>
  );
}

export default function AirConditionerScene() {
  const variant = useExperimentStore((state) => state.variant);
  const preset = CAMERA_PRESETS[variant] ?? CAMERA_PRESETS[0];
  return (
    <ExperimentCanvas
      camera={preset.position}
      target={preset.target}
      cameraKey={`air-conditioner-mode-${variant}`}
      gridY={-2.95}
      shadowY={-2.91}
      background="#e8ece9"
      minDistance={variant === 2 ? 6 : 9}
      maxDistance={variant === 2 ? 18 : 31}
    >
      <AirConditionerAssembly />
    </ExperimentCanvas>
  );
}
