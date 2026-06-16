import { RoundedBox } from "@react-three/drei";
import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface CabinetAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
}

const sheetColor = "#e7e9e5";
const innerSheetColor = "#b9c0bd";

function FrontPanelFrame() {
  return (
    <group>
      <RoundedBox args={[4.46, 0.68, 0.12]} radius={0.05} smoothness={4} position={[0, 2.03, 0]} castShadow><meshStandardMaterial color={sheetColor} metalness={0.16} roughness={0.38} /></RoundedBox>
      <RoundedBox args={[4.46, 1.02, 0.12]} radius={0.05} smoothness={4} position={[0, -1.94, 0]} castShadow><meshStandardMaterial color={sheetColor} metalness={0.16} roughness={0.38} /></RoundedBox>
      <RoundedBox args={[0.48, 3.38, 0.12]} radius={0.045} smoothness={4} position={[-1.99, 0.04, 0]} castShadow><meshStandardMaterial color={sheetColor} metalness={0.16} roughness={0.38} /></RoundedBox>
      <RoundedBox args={[0.48, 3.38, 0.12]} radius={0.045} smoothness={4} position={[1.99, 0.04, 0]} castShadow><meshStandardMaterial color={sheetColor} metalness={0.16} roughness={0.38} /></RoundedBox>
      <mesh position={[0, 0.24, -0.015]}><torusGeometry args={[1.5, 0.11, 18, 72]} /><meshStandardMaterial color="#d7dbd7" metalness={0.18} roughness={0.4} /></mesh>
      <RoundedBox args={[0.72, 0.4, 0.08]} radius={0.04} smoothness={4} position={[-1.62, -1.7, 0.08]}><meshStandardMaterial color="#d3d7d3" roughness={0.44} /></RoundedBox>
    </group>
  );
}

function CabinetShell({ assemblyEnabled }: { assemblyEnabled: boolean }) {
  return (
    <group>
      <RoundedBox args={[4.62, 0.24, 4.22]} radius={0.06} smoothness={4} position={[0, -2.54, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#6e7b7d" metalness={0.42} roughness={0.34} />
      </RoundedBox>

      {assemblyEnabled ? (
        <>
          {[-2.23, 2.23].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <RoundedBox args={[0.12, 4.92, 4.0]} radius={0.035} smoothness={3} castShadow>
                <meshStandardMaterial color={innerSheetColor} metalness={0.26} roughness={0.4} side={2} />
              </RoundedBox>
              <mesh position={[x < 0 ? 0.07 : -0.07, 0, 0]}><boxGeometry args={[0.025, 4.55, 3.7]} /><meshStandardMaterial color="#d5d9d5" metalness={0.12} roughness={0.5} /></mesh>
            </group>
          ))}
          <RoundedBox args={[4.44, 0.12, 4.0]} radius={0.04} smoothness={3} position={[0, 2.48, 0]} castShadow>
            <meshStandardMaterial color={innerSheetColor} metalness={0.28} roughness={0.38} />
          </RoundedBox>
        </>
      ) : (
        <>
          {[-2.16, 2.16].map((x) => (
            <group key={x}>
              <RoundedBox args={[0.1, 4.72, 0.28]} radius={0.03} smoothness={3} position={[x, 0, -1.86]} castShadow>
                <meshStandardMaterial color="#9da8a5" metalness={0.34} roughness={0.36} />
              </RoundedBox>
              <RoundedBox args={[0.1, 4.72, 0.22]} radius={0.03} smoothness={3} position={[x, 0, 1.86]} castShadow>
                <meshStandardMaterial color="#b8c0bd" metalness={0.24} roughness={0.42} />
              </RoundedBox>
            </group>
          ))}
          <RoundedBox args={[4.34, 0.1, 0.3]} radius={0.03} smoothness={3} position={[0, 2.42, -1.82]} castShadow>
            <meshStandardMaterial color="#9da8a5" metalness={0.34} roughness={0.36} />
          </RoundedBox>
          <RoundedBox args={[4.34, 0.1, 0.24]} radius={0.03} smoothness={3} position={[0, 2.42, 1.82]} castShadow>
            <meshStandardMaterial color="#b8c0bd" metalness={0.24} roughness={0.42} />
          </RoundedBox>
        </>
      )}

      {[-1.55, 1.55].map((x) => (
        <mesh key={x} position={[x, -2.42, 1.58]}><boxGeometry args={[0.42, 0.18, 0.5]} /><meshStandardMaterial color="#4b5a5d" metalness={0.45} roughness={0.32} /></mesh>
      ))}
      {[-1.55, 1.55].map((x) => (
        <mesh key={`rear-${x}`} position={[x, -2.42, -1.58]}><boxGeometry args={[0.42, 0.18, 0.5]} /><meshStandardMaterial color="#4b5a5d" metalness={0.45} roughness={0.32} /></mesh>
      ))}
    </group>
  );
}

export function CabinetAssembly({ mode, assemblyEnabled }: CabinetAssemblyProps) {
  const showUpperControls = assemblyEnabled || mode === WashingMachineMode.WashWaterPath;

  return (
    <group>
      <ExplodablePart id="wm-cabinet-frame" home={[0, 0, 0]} exploded={[0, 0, 0]} assemblyEnabled={assemblyEnabled} selectionRadius={2.25}>
        <CabinetShell assemblyEnabled={assemblyEnabled} />
      </ExplodablePart>

      {assemblyEnabled && (
        <>
          <ExplodablePart id="wm-top-cover" home={[0, 2.68, 0]} exploded={[0, 4.2, -0.55]} assemblyEnabled selectionRadius={1.95}>
            <RoundedBox args={[4.58, 0.16, 4.16]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#f0f1ed" metalness={0.12} roughness={0.34} /></RoundedBox>
          </ExplodablePart>
          <ExplodablePart id="wm-front-panel" home={[0, -0.05, 2.13]} exploded={[0, -0.05, 4.85]} assemblyEnabled selectionRadius={2.1}><FrontPanelFrame /></ExplodablePart>
          <ExplodablePart id="wm-rear-cover" home={[0, 0, -2.11]} exploded={[0, 0, -4.85]} assemblyEnabled selectionRadius={2.1}>
            <RoundedBox args={[4.4, 4.82, 0.1]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#d9ddd9" metalness={0.16} roughness={0.4} /></RoundedBox>
            <mesh position={[0, 0, -0.06]}><torusGeometry args={[1.55, 0.05, 12, 64]} /><meshStandardMaterial color="#b6bfbc" metalness={0.28} roughness={0.35} /></mesh>
          </ExplodablePart>
        </>
      )}

      {showUpperControls && (
        <>
          <ExplodablePart id="wm-control-panel" home={[0, 2.04, 2.1]} exploded={[0, 3.65, 3.5]} assemblyEnabled={assemblyEnabled} selectionRadius={1.75}>
            <RoundedBox args={[4.38, 0.68, 0.28]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#e8eae6" metalness={0.12} roughness={0.34} /></RoundedBox>
            <mesh position={[0.25, 0, 0.17]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.12, 40]} /><meshStandardMaterial color="#52696e" metalness={0.45} roughness={0.28} /></mesh>
            <RoundedBox args={[1.08, 0.28, 0.05]} radius={0.025} smoothness={3} position={[1.38, 0, 0.17]}><meshStandardMaterial color="#253d42" emissive="#4ca0b1" emissiveIntensity={0.12} /></RoundedBox>
          </ExplodablePart>
          <ExplodablePart id="wm-detergent-drawer" home={[-1.42, 2.04, 2.28]} exploded={[-1.42, 2.04, 4.35]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
            <RoundedBox args={[1.12, 0.44, 0.66]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#edf0eb" roughness={0.38} /></RoundedBox>
          </ExplodablePart>
        </>
      )}

      {(assemblyEnabled || mode === WashingMachineMode.DriveCutaway) && (
        <ExplodablePart id="wm-main-pcb" home={[1.35, 1.9, -1.55]} exploded={[3.4, 3.0, -3.0]} assemblyEnabled={assemblyEnabled} selectionRadius={0.7}>
          <RoundedBox args={[1.25, 0.82, 0.52]} radius={0.05} smoothness={4} castShadow><meshStandardMaterial color="#4a6267" metalness={0.28} roughness={0.35} /></RoundedBox>
          <mesh position={[0, 0, 0.28]}><boxGeometry args={[0.98, 0.58, 0.035]} /><meshStandardMaterial color="#6ba079" roughness={0.45} /></mesh>
        </ExplodablePart>
      )}
    </group>
  );
}
