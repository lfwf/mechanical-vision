import { RoundedBox } from "@react-three/drei";
import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface DoorAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
}

function DoorBody() {
  return (
    <group>
      <mesh castShadow>
        <torusGeometry args={[1.08, 0.16, 28, 80]} />
        <meshStandardMaterial color="#4d5d61" metalness={0.46} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <torusGeometry args={[0.87, 0.055, 18, 72]} />
        <meshStandardMaterial color="#7f8c8e" metalness={0.5} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.05]} scale={[1, 1, 0.24]}>
        <sphereGeometry args={[0.91, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#8aaeb5" transparent opacity={0.3} transmission={0.74} roughness={0.16} depthWrite={false} side={2} />
      </mesh>
      <RoundedBox args={[0.24, 0.48, 0.18]} radius={0.04} smoothness={4} position={[-1.14, 0, -0.02]} castShadow>
        <meshStandardMaterial color="#45575b" metalness={0.52} roughness={0.28} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.32, 0.14]} radius={0.03} smoothness={4} position={[1.12, 0, -0.02]} castShadow>
        <meshStandardMaterial color="#9aa4a2" metalness={0.5} roughness={0.28} />
      </RoundedBox>
    </group>
  );
}

function BellowBody() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1.13, 1.24, 0.38, 72, 1, true]} />
        <meshStandardMaterial color="#667371" roughness={0.62} side={2} />
      </mesh>
      <mesh position={[0, 0, 0.19]}>
        <torusGeometry args={[1.13, 0.13, 22, 72]} />
        <meshStandardMaterial color="#707d7a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, -0.19]}>
        <torusGeometry args={[1.24, 0.14, 22, 72]} />
        <meshStandardMaterial color="#5f6d6a" roughness={0.64} />
      </mesh>
      <mesh position={[0, -1.12, 0.03]}>
        <torusGeometry args={[0.17, 0.035, 12, 36, Math.PI]} />
        <meshStandardMaterial color="#4f605d" roughness={0.58} />
      </mesh>
    </group>
  );
}

/** 门、门封和两个卡箍沿同一 Z 轴形成连续装配链。 */
export function DoorAssembly({ mode, assemblyEnabled }: DoorAssemblyProps) {
  const visible = assemblyEnabled || mode === WashingMachineMode.WashWaterPath || mode === WashingMachineMode.SpinSuspension;
  if (!visible) return null;

  return (
    <group>
      <ExplodablePart id="wm-door" home={[0, 0.24, 2.36]} exploded={[-3.15, 0.24, 4.8]} assemblyEnabled={assemblyEnabled} selectionRadius={1.08}>
        <DoorBody />
      </ExplodablePart>

      <ExplodablePart id="wm-bellow-outer-clamp" home={[0, 0.24, 2.11]} exploded={[0, 0.24, 4.55]} assemblyEnabled={assemblyEnabled} selectionRadius={1.0}>
        <mesh><torusGeometry args={[1.17, 0.018, 10, 72]} /><meshStandardMaterial color="#a3acab" metalness={0.8} roughness={0.18} /></mesh>
        <mesh position={[1.12, -0.15, 0]}><boxGeometry args={[0.14, 0.08, 0.06]} /><meshStandardMaterial color="#788482" metalness={0.76} roughness={0.2} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-door-lock" home={[1.34, 0.24, 2.0]} exploded={[3.0, 0.24, 4.0]} assemblyEnabled={assemblyEnabled} selectionRadius={0.28}>
        <RoundedBox args={[0.28, 0.54, 0.28]} radius={0.035} smoothness={4} castShadow>
          <meshStandardMaterial color="#52676b" metalness={0.28} roughness={0.35} />
        </RoundedBox>
        <mesh position={[-0.11, 0, 0.15]}><boxGeometry args={[0.09, 0.18, 0.12]} /><meshStandardMaterial color="#a4adaa" metalness={0.56} roughness={0.25} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-bellow" home={[0, 0.24, 1.88]} exploded={[3.15, 0.44, 3.25]} assemblyEnabled={assemblyEnabled} selectionRadius={1.1}>
        <BellowBody />
      </ExplodablePart>

      <ExplodablePart id="wm-bellow-inner-clamp" home={[0, 0.24, 1.66]} exploded={[2.62, 0.24, 3.65]} assemblyEnabled={assemblyEnabled} selectionRadius={1.1}>
        <mesh><torusGeometry args={[1.25, 0.02, 10, 72]} /><meshStandardMaterial color="#87928f" metalness={0.76} roughness={0.22} /></mesh>
      </ExplodablePart>
    </group>
  );
}
