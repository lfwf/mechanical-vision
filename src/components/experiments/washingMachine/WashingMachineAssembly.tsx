import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, type Group } from "three";
import { WashingMachineMode, washingMachineModeLabels } from "../../../data/experiments/washingMachineModes";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { CabinetAssembly } from "./assemblies/CabinetAssembly";
import { DoorAssembly } from "./assemblies/DoorAssembly";
import { DrumDriveAssembly } from "./assemblies/DrumDriveAssembly";
import { SuspensionLinks, TubMountedSuspensionParts } from "./assemblies/SuspensionAssembly";
import { WaterSystemAssembly } from "./assemblies/WaterSystemAssembly";

const TUB_HOME: [number, number, number] = [0, 0.2, -0.1];

/**
 * 洗衣机三维总装编排。
 *
 * 坐标约定：X 向右，Y 向上，正 Z 指向机门，负 Z 指向后置直驱电机。
 * 机壳属于固定参考系；外筒、配重和内筒轴系位于 suspendedTubRef 下，
 * 因此脱水模式只需移动这一层，就能保证配重和外筒一起摆动。
 */
export function WashingMachineAssembly() {
  const drumRef = useRef<Group>(null);
  const rotorRef = useRef<Group>(null);
  const suspendedTubRef = useRef<Group>(null);
  const spinAngleRef = useRef(0);

  const mode = useExperimentStore((state) => state.variant) as WashingMachineMode;
  const speed = useExperimentStore((state) => state.speed);
  const waterLevel = useExperimentStore((state) => state.primary);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const assemblyEnabled = mode === WashingMachineMode.Assembly;

  useEffect(() => {
    const tub = suspendedTubRef.current;
    if (tub) tub.position.set(...TUB_HOME);
    if (assemblyEnabled) spinAngleRef.current = 0;
  }, [assemblyEnabled, mode]);

  useFrame(({ clock }, delta) => {
    const drum = drumRef.current;
    const rotor = rotorRef.current;
    const tub = suspendedTubRef.current;
    if (!drum || !rotor || !tub) return;

    if (assemblyEnabled) {
      tub.position.set(...TUB_HOME);
      drum.rotation.z = 0;
      rotor.rotation.z = 0;
      return;
    }

    if (!isPlaying) return;
    const visualSpeed = 0.45 + speed / 32;

    if (mode === WashingMachineMode.WashWaterPath) {
      spinAngleRef.current = Math.sin(clock.elapsedTime * visualSpeed * 0.72) * 1.25;
    } else if (mode === WashingMachineMode.DriveCutaway) {
      spinAngleRef.current += delta * visualSpeed * 0.72;
    } else if (mode === WashingMachineMode.SpinSuspension) {
      spinAngleRef.current += delta * visualSpeed * 4.6;
    }

    drum.rotation.z = spinAngleRef.current;
    rotor.rotation.z = spinAngleRef.current;

    if (mode === WashingMachineMode.SpinSuspension) {
      const amplitude = 0.035 + speed * 0.00072;
      tub.position.x = TUB_HOME[0] + Math.sin(clock.elapsedTime * 8.3) * amplitude;
      tub.position.y = TUB_HOME[1] + Math.cos(clock.elapsedTime * 10.6) * amplitude * 0.62;
      tub.position.z = TUB_HOME[2] + Math.sin(clock.elapsedTime * 6.2) * amplitude * 0.28;
    } else {
      tub.position.x = MathUtils.damp(tub.position.x, TUB_HOME[0], 9, delta);
      tub.position.y = MathUtils.damp(tub.position.y, TUB_HOME[1], 9, delta);
      tub.position.z = MathUtils.damp(tub.position.z, TUB_HOME[2], 9, delta);
    }
  });

  return (
    <group>
      <CabinetAssembly mode={mode} assemblyEnabled={assemblyEnabled} />
      <DoorAssembly mode={mode} assemblyEnabled={assemblyEnabled} />

      <group ref={suspendedTubRef} position={TUB_HOME}>
        <DrumDriveAssembly mode={mode} assemblyEnabled={assemblyEnabled} drumRef={drumRef} rotorRef={rotorRef} />
        <TubMountedSuspensionParts mode={mode} assemblyEnabled={assemblyEnabled} />
      </group>

      <SuspensionLinks mode={mode} assemblyEnabled={assemblyEnabled} tubGroupRef={suspendedTubRef} />
      <WaterSystemAssembly mode={mode} assemblyEnabled={assemblyEnabled} isPlaying={isPlaying} speed={speed} waterLevel={waterLevel} />

      <mesh position={[0, -2.82, 0]} receiveShadow><boxGeometry args={[6.4, 0.16, 6.4]} /><meshStandardMaterial color="#d6dbd4" roughness={0.68} /></mesh>
      <SceneLabel position={[0, 3.35, 0]}>LG WM4000HWA · {washingMachineModeLabels[mode]}</SceneLabel>
    </group>
  );
}
