import type { RefObject } from "react";
import type { Group } from "three";
import { MathUtils } from "three";
import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface DrumDriveAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
  sectionEmphasis: number;
  drumRef: RefObject<Group | null>;
  rotorRef: RefObject<Group | null>;
}

function InnerDrum({ drumRef, showImbalance }: { drumRef: RefObject<Group | null>; showImbalance: boolean }) {
  return (
    <group ref={drumRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 2.58, 72, 1, true]} />
        <meshStandardMaterial color="#bac5c3" metalness={0.9} roughness={0.18} side={2} />
      </mesh>
      <mesh position={[0, 0, 1.29]}>
        <torusGeometry args={[1.35, 0.095, 20, 72]} />
        <meshStandardMaterial color="#8f9d9b" metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, -1.29]}>
        <circleGeometry args={[1.46, 72]} />
        <meshStandardMaterial color="#a3b0ae" metalness={0.84} roughness={0.19} />
      </mesh>
      <mesh position={[0, 0, -1.31]}>
        <torusGeometry args={[0.56, 0.08, 18, 56]} />
        <meshStandardMaterial color="#879593" metalness={0.78} roughness={0.22} />
      </mesh>

      {Array.from({ length: 3 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 3;
        return (
          <group key={`lifter-${index}`} rotation={[0, 0, angle]}>
            <mesh position={[0, 1.18, 0.06]} castShadow>
              <boxGeometry args={[0.18, 0.3, 1.98]} />
              <meshStandardMaterial color="#d3dad8" metalness={0.52} roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.31, 0.06]} castShadow>
              <boxGeometry args={[0.1, 0.08, 1.84]} />
              <meshStandardMaterial color="#f0f2ef" metalness={0.35} roughness={0.25} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 24 }, (_, column) => {
          const angle = (column * Math.PI * 2) / 24;
          const z = -1.02 + row * 0.29;
          return (
            <mesh
              key={`perforation-${row}-${column}`}
              position={[Math.cos(angle) * 1.502, Math.sin(angle) * 1.502, z]}
              rotation={[0, Math.PI / 2, angle]}
            >
              <circleGeometry args={[0.03, 8]} />
              <meshBasicMaterial color="#43575a" />
            </mesh>
          );
        }),
      )}

      {showImbalance && (
        <group position={[0.92, 0.44, 0.12]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 24, 16]} />
            <meshStandardMaterial color="#d6a55e" emissive="#6e4d20" emissiveIntensity={0.22} roughness={0.4} />
          </mesh>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.28, 18]} />
            <meshStandardMaterial color="#d6a55e" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function SpiderAndShaft() {
  return (
    <group>
      <mesh position={[0, 0, -1.68]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 2.0, 32]} />
        <meshStandardMaterial color="#788684" metalness={0.78} roughness={0.22} />
      </mesh>
      <group position={[0, 0, -1.3]}>
        {Array.from({ length: 3 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 3;
          return (
            <group key={index} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.62, 0]}>
                <boxGeometry args={[0.18, 1.22, 0.16]} />
                <meshStandardMaterial color="#879391" metalness={0.7} roughness={0.27} />
              </mesh>
              <mesh position={[0, 1.18, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.14, 20]} />
                <meshStandardMaterial color="#7c8987" metalness={0.72} roughness={0.25} />
              </mesh>
            </group>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.2, 32]} />
          <meshStandardMaterial color="#74827f" metalness={0.78} roughness={0.21} />
        </mesh>
      </group>
    </group>
  );
}

function OuterTubShell({ front, thetaLength, opacity, assemblyEnabled, driveMode }: { front: boolean; thetaLength: number; opacity: number; assemblyEnabled: boolean; driveMode: boolean }) {
  const z = front ? 0.74 : -0.78;
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.86, 1.93, 1.5, 72, 1, true, -Math.PI * 0.78, thetaLength]} />
        <meshStandardMaterial
          color={front ? "#8c9996" : "#83908e"}
          transparent={!assemblyEnabled}
          opacity={opacity}
          roughness={0.5}
          side={2}
          depthWrite={assemblyEnabled}
        />
      </mesh>
      <mesh position={[0, 0, front ? 1.48 : -1.5]}>
        <torusGeometry args={[1.79, 0.09, 14, 72]} />
        <meshStandardMaterial color="#758481" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, front ? -0.02 : 0.02]}>
        <torusGeometry args={[1.91, 0.085, 14, 72]} />
        <meshStandardMaterial color="#6e7d7a" roughness={0.46} />
      </mesh>
      {Array.from({ length: 10 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 10;
        return (
          <group key={index} rotation={[0, 0, angle]}>
            <mesh position={[0, 1.69, front ? 0.34 : -0.34]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[0.1, 0.12, 1.02]} />
              <meshStandardMaterial color="#71817e" roughness={0.48} />
            </mesh>
          </group>
        );
      })}
      {!front && (
        <>
          <mesh position={[0, 0, -1.54]}>
            <circleGeometry args={[1.8, 72]} />
            <meshStandardMaterial color="#74827f" transparent={driveMode} opacity={driveMode ? 0.22 : 1} roughness={0.47} side={2} depthWrite={!driveMode} />
          </mesh>
          <mesh position={[0, 0, -1.6]}>
            <torusGeometry args={[0.72, 0.16, 18, 56]} />
            <meshStandardMaterial color="#677774" roughness={0.42} />
          </mesh>
        </>
      )}
      {front && (
        <mesh position={[0, 0, 1.52]}>
          <torusGeometry args={[1.42, 0.15, 18, 72]} />
          <meshStandardMaterial color="#74837f" roughness={0.45} />
        </mesh>
      )}
      <mesh position={[0, front ? 1.72 : -1.72, z > 0 ? 0.2 : -0.2]}>
        <boxGeometry args={[0.44, 0.24, 0.38]} />
        <meshStandardMaterial color="#697875" roughness={0.48} />
      </mesh>
    </group>
  );
}

export function DrumDriveAssembly({ mode, assemblyEnabled, sectionEmphasis, drumRef, rotorRef }: DrumDriveAssemblyProps) {
  const driveMode = mode === WashingMachineMode.DriveCutaway;
  const spinMode = mode === WashingMachineMode.SpinSuspension;
  const washOrDrain = mode === WashingMachineMode.WashWaterPath || mode === WashingMachineMode.DrainPath;
  const emphasis = MathUtils.clamp((sectionEmphasis - 20) / 65, 0, 1);
  const tubOpacity = assemblyEnabled ? 0.9 : MathUtils.lerp(0.58, 0.18, emphasis);
  const thetaLength = assemblyEnabled || spinMode ? Math.PI * 2 : MathUtils.lerp(Math.PI * 1.7, Math.PI * 1.22, emphasis);

  return (
    <group>
      <ExplodablePart id="wm-outer-tub-front" home={[0, 0, 0.74]} exploded={[0, 0, 3.7]} assemblyEnabled={assemblyEnabled} selectionRadius={1.82}>
        <OuterTubShell front thetaLength={thetaLength} opacity={tubOpacity} assemblyEnabled={assemblyEnabled} driveMode={driveMode} />
      </ExplodablePart>
      <ExplodablePart id="wm-outer-tub-rear" home={[0, 0, -0.78]} exploded={[0, 0, -4.1]} assemblyEnabled={assemblyEnabled} selectionRadius={1.86}>
        <OuterTubShell front={false} thetaLength={thetaLength} opacity={tubOpacity} assemblyEnabled={assemblyEnabled} driveMode={driveMode} />
      </ExplodablePart>
      <ExplodablePart id="wm-inner-drum" home={[0, 0, 0.02]} exploded={[0, 0, 2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={1.62}>
        <InnerDrum drumRef={drumRef} showImbalance={spinMode && !assemblyEnabled} />
      </ExplodablePart>

      {(assemblyEnabled || driveMode) && (
        <>
          <ExplodablePart id="wm-spider-shaft" home={[0, 0, 0]} exploded={[3.25, 0.25, 2.3]} assemblyEnabled={assemblyEnabled} selectionRadius={1.05}>
            <SpiderAndShaft />
          </ExplodablePart>
          <ExplodablePart id="wm-bearing-seal" home={[0, 0, -1.7]} exploded={[2.85, -0.35, -3.35]} assemblyEnabled={assemblyEnabled} selectionRadius={0.5}>
            <mesh><torusGeometry args={[0.4, 0.1, 22, 56]} /><meshStandardMaterial color="#a2aaa7" metalness={0.74} roughness={0.2} /></mesh>
            <mesh position={[0, 0, 0.14]}><torusGeometry args={[0.3, 0.06, 18, 48]} /><meshStandardMaterial color="#4f6262" roughness={0.5} /></mesh>
          </ExplodablePart>
          <ExplodablePart id="wm-stator" home={[0, 0, -1.9]} exploded={[0, 0, -4.85]} assemblyEnabled={assemblyEnabled} selectionRadius={1.08}>
            <mesh castShadow><torusGeometry args={[0.94, 0.18, 24, 72]} /><meshStandardMaterial color="#6c5638" metalness={0.52} roughness={0.3} /></mesh>
            {Array.from({ length: 24 }, (_, index) => {
              const angle = (index * Math.PI * 2) / 24;
              return <mesh key={index} position={[Math.cos(angle) * 0.94, Math.sin(angle) * 0.94, 0]} rotation={[0, 0, angle]}><boxGeometry args={[0.11, 0.24, 0.16]} /><meshStandardMaterial color="#b97839" metalness={0.5} roughness={0.28} /></mesh>;
            })}
          </ExplodablePart>
          <ExplodablePart id="wm-rotor" home={[0, 0, -2.2]} exploded={[0, 0, -5.8]} assemblyEnabled={assemblyEnabled} selectionRadius={1.28}>
            <group ref={rotorRef}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[1.25, 1.25, 0.22, 72]} /><meshStandardMaterial color="#3f555a" metalness={0.74} roughness={0.2} /></mesh>
              <mesh position={[0, 0, -0.13]}><torusGeometry args={[1.0, 0.1, 18, 72]} /><meshStandardMaterial color="#654631" metalness={0.66} roughness={0.24} /></mesh>
              {Array.from({ length: 8 }, (_, index) => {
                const angle = (index * Math.PI * 2) / 8;
                return <mesh key={index} position={[Math.cos(angle) * 0.68, Math.sin(angle) * 0.68, -0.14]} rotation={[0, 0, angle]}><boxGeometry args={[0.1, 0.72, 0.06]} /><meshStandardMaterial color="#596a6d" metalness={0.6} roughness={0.24} /></mesh>;
              })}
            </group>
          </ExplodablePart>
          <ExplodablePart id="wm-rotor-bolt" home={[0, 0, -2.39]} exploded={[0, 0, -6.45]} assemblyEnabled={assemblyEnabled} selectionRadius={0.22}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.22, 6]} /><meshStandardMaterial color="#a1aaa8" metalness={0.8} roughness={0.18} /></mesh>
          </ExplodablePart>
        </>
      )}

      {!assemblyEnabled && driveMode && (
        <>
          {Array.from({ length: 16 }, (_, index) => <mesh key={index} position={[0, 0, -2.55 + index * 0.3]}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#d9bd64" /></mesh>)}
          <mesh position={[0, 0, -2.48]}><torusGeometry args={[1.38, 0.022, 8, 72]} /><meshBasicMaterial color="#d6a55e" /></mesh>
        </>
      )}
      {!assemblyEnabled && washOrDrain && <mesh position={[0, -1.43, 0.2]}><sphereGeometry args={[0.09, 16, 12]} /><meshStandardMaterial color="#547f9c" emissive="#274e63" emissiveIntensity={0.18} /></mesh>}
    </group>
  );
}
