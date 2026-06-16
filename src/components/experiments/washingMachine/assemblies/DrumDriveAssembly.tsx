import type { RefObject } from "react";
import type { Group } from "three";
import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface DrumDriveAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
  drumRef: RefObject<Group | null>;
  rotorRef: RefObject<Group | null>;
}

function InnerDrum({ drumRef, showImbalance }: { drumRef: RefObject<Group | null>; showImbalance: boolean }) {
  return (
    <group ref={drumRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 2.72, 64, 1, true]} />
        <meshStandardMaterial color="#aab8b7" metalness={0.82} roughness={0.2} side={2} />
      </mesh>
      <mesh position={[0, 0, 1.36]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.4, 0.11, 18, 64]} /><meshStandardMaterial color="#899795" metalness={0.78} roughness={0.2} /></mesh>
      <mesh position={[0, 0, -1.36]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[1.48, 64]} /><meshStandardMaterial color="#9aa9a7" metalness={0.78} roughness={0.2} /></mesh>
      {Array.from({ length: 3 }, (_, index) => {
        const angle = index * Math.PI * 2 / 3;
        return <mesh key={index} position={[Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, 0.12]} rotation={[0, 0, angle]} castShadow><boxGeometry args={[0.2, 0.34, 2.05]} /><meshStandardMaterial color="#c7d0ce" metalness={0.4} roughness={0.3} /></mesh>;
      })}
      {Array.from({ length: 72 }, (_, index) => {
        const ring = Math.floor(index / 18);
        const angle = index % 18 * Math.PI * 2 / 18;
        const z = -1.0 + ring * 0.66;
        return <mesh key={index} position={[Math.cos(angle) * 1.548, Math.sin(angle) * 1.548, z]} rotation={[0, Math.PI / 2, angle]}><circleGeometry args={[0.045, 8]} /><meshBasicMaterial color="#40565a" /></mesh>;
      })}
      {showImbalance && <group position={[1.0, 0.42, 0.15]}><mesh castShadow><sphereGeometry args={[0.24, 24, 16]} /><meshStandardMaterial color="#d6a55e" emissive="#6e4d20" emissiveIntensity={0.25} roughness={0.4} /></mesh><mesh position={[0.32, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.09, 0.32, 18]} /><meshStandardMaterial color="#d6a55e" /></mesh></group>}
    </group>
  );
}

function SpiderAndShaft() {
  return (
    <group>
      <mesh position={[0, 0, -1.7]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.14, 0.14, 2.1, 28]} /><meshStandardMaterial color="#788684" metalness={0.76} roughness={0.22} /></mesh>
      <group position={[0, 0, -1.34]}>
        {Array.from({ length: 3 }, (_, index) => {
          const angle = index * Math.PI * 2 / 3;
          return <mesh key={index} position={[Math.cos(angle) * 0.68, Math.sin(angle) * 0.68, 0]} rotation={[0, 0, angle]}><boxGeometry args={[1.25, 0.16, 0.16]} /><meshStandardMaterial color="#84918f" metalness={0.7} roughness={0.26} /></mesh>;
        })}
        <mesh><cylinderGeometry args={[0.25, 0.25, 0.2, 28]} /><meshStandardMaterial color="#788684" metalness={0.76} roughness={0.22} /></mesh>
      </group>
    </group>
  );
}

export function DrumDriveAssembly({ mode, assemblyEnabled, drumRef, rotorRef }: DrumDriveAssemblyProps) {
  const driveMode = mode === WashingMachineMode.DriveCutaway;
  const spinMode = mode === WashingMachineMode.SpinSuspension;
  const washMode = mode === WashingMachineMode.WashWaterPath;
  const drainMode = mode === WashingMachineMode.DrainPath;
  const tubOpacity = assemblyEnabled ? 0.78 : driveMode ? 0.22 : 0.46;
  const thetaLength = assemblyEnabled || spinMode ? Math.PI * 2 : Math.PI * 1.55;

  return (
    <group>
      <ExplodablePart id="wm-outer-tub-front" home={[0, 0, 0.75]} exploded={[0, 0, 4.0]} assemblyEnabled={assemblyEnabled} selectionRadius={1.95}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><cylinderGeometry args={[1.9, 1.9, 1.55, 64, 1, true, -Math.PI * 0.78, thetaLength]} /><meshStandardMaterial color="#899997" transparent={!assemblyEnabled} opacity={tubOpacity} roughness={0.43} side={2} depthWrite={assemblyEnabled} /></mesh>
        <mesh position={[0, 0, 1.54]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.48, 0.18, 18, 64]} /><meshStandardMaterial color="#778986" roughness={0.44} /></mesh>
        {Array.from({ length: 4 }, (_, index) => <mesh key={index} position={[0, 0, 0.18 + index * 0.34]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.82, 0.045, 10, 64]} /><meshStandardMaterial color="#778987" roughness={0.45} /></mesh>)}
      </ExplodablePart>

      <ExplodablePart id="wm-outer-tub-rear" home={[0, 0, -0.82]} exploded={[0, 0, -4.45]} assemblyEnabled={assemblyEnabled} selectionRadius={2.0}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><cylinderGeometry args={[1.9, 1.9, 1.6, 64, 1, true, -Math.PI * 0.78, thetaLength]} /><meshStandardMaterial color="#81928f" transparent={!assemblyEnabled} opacity={tubOpacity} roughness={0.44} side={2} depthWrite={assemblyEnabled} /></mesh>
        <mesh position={[0, 0, -1.58]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[1.86, 64]} /><meshStandardMaterial color="#71827f" transparent={driveMode} opacity={driveMode ? 0.26 : 1} roughness={0.44} side={2} depthWrite={!driveMode} /></mesh>
        {Array.from({ length: 8 }, (_, index) => <mesh key={index} position={[Math.cos(index * Math.PI / 4) * 1.25, Math.sin(index * Math.PI / 4) * 1.25, -1.62]} rotation={[0, 0, index * Math.PI / 4]}><boxGeometry args={[1.25, 0.08, 0.1]} /><meshStandardMaterial color="#667975" roughness={0.45} /></mesh>)}
      </ExplodablePart>

      <ExplodablePart id="wm-inner-drum" home={[0, 0, 0.05]} exploded={[0, 0, 3.0]} assemblyEnabled={assemblyEnabled} selectionRadius={1.8}>
        <InnerDrum drumRef={drumRef} showImbalance={spinMode && !assemblyEnabled} />
      </ExplodablePart>

      {(assemblyEnabled || driveMode) && <>
        <ExplodablePart id="wm-spider-shaft" home={[0, 0, 0]} exploded={[3.6, 0.3, 2.6]} assemblyEnabled={assemblyEnabled} selectionRadius={1.2}><SpiderAndShaft /></ExplodablePart>
        <ExplodablePart id="wm-bearing-seal" home={[0, 0, -1.72]} exploded={[3.1, -0.4, -3.7]} assemblyEnabled={assemblyEnabled} selectionRadius={0.62}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.42, 0.12, 20, 48]} /><meshStandardMaterial color="#a2aaa7" metalness={0.7} roughness={0.22} /></mesh>
          <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.31, 0.07, 18, 44]} /><meshStandardMaterial color="#4f6262" roughness={0.5} /></mesh>
        </ExplodablePart>
        <ExplodablePart id="wm-stator" home={[0, 0, -1.92]} exploded={[0, 0, -5.2]} assemblyEnabled={assemblyEnabled} selectionRadius={1.25}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[1.0, 0.2, 24, 64]} /><meshStandardMaterial color="#7d623c" metalness={0.5} roughness={0.3} /></mesh>
          {Array.from({ length: 18 }, (_, index) => { const angle = index * Math.PI * 2 / 18; return <mesh key={index} position={[Math.cos(angle) * 0.99, Math.sin(angle) * 0.99, 0]} rotation={[0, 0, angle]}><boxGeometry args={[0.15, 0.28, 0.17]} /><meshStandardMaterial color="#bd7e3e" metalness={0.48} roughness={0.28} /></mesh>; })}
          <mesh position={[0.72, -0.72, -0.12]}><boxGeometry args={[0.28, 0.2, 0.12]} /><meshStandardMaterial color="#3f5c62" roughness={0.4} /></mesh>
        </ExplodablePart>
        <ExplodablePart id="wm-rotor" home={[0, 0, -2.24]} exploded={[0, 0, -6.25]} assemblyEnabled={assemblyEnabled} selectionRadius={1.48}>
          <group ref={rotorRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[1.34, 1.34, 0.25, 64]} /><meshStandardMaterial color="#3f555a" metalness={0.72} roughness={0.2} /></mesh>
            <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.06, 0.12, 18, 64]} /><meshStandardMaterial color="#6f4d35" metalness={0.65} roughness={0.25} /></mesh>
          </group>
        </ExplodablePart>
        <ExplodablePart id="wm-rotor-bolt" home={[0, 0, -2.43]} exploded={[0, 0, -7.05]} assemblyEnabled={assemblyEnabled} selectionRadius={0.28}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.18, 0.18, 0.24, 6]} /><meshStandardMaterial color="#a1aaa8" metalness={0.78} roughness={0.18} /></mesh>
        </ExplodablePart>
      </>}

      {!assemblyEnabled && driveMode && <>
        {Array.from({ length: 18 }, (_, index) => <mesh key={index} position={[0, 0, -2.7 + index * 0.32]}><sphereGeometry args={[0.035, 10, 8]} /><meshBasicMaterial color="#d9bd64" /></mesh>)}
        <mesh position={[0, 0, -2.55]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.48, 0.025, 8, 64]} /><meshBasicMaterial color="#d6a55e" /></mesh>
      </>}

      {!assemblyEnabled && (washMode || drainMode) && <mesh position={[0, -1.48, 0.25]}><sphereGeometry args={[0.1, 16, 12]} /><meshStandardMaterial color="#547f9c" emissive="#274e63" emissiveIntensity={0.18} /></mesh>}
    </group>
  );
}
