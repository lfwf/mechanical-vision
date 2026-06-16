import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface DoorAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
}

export function DoorAssembly({ mode, assemblyEnabled }: DoorAssemblyProps) {
  const visible = assemblyEnabled || mode === WashingMachineMode.WashWaterPath || mode === WashingMachineMode.SpinSuspension;
  if (!visible) return null;

  return (
    <group>
      <ExplodablePart id="wm-door" home={[0, 0.25, 2.48]} exploded={[-3.7, 0.25, 5.8]} assemblyEnabled={assemblyEnabled} selectionRadius={1.42}>
        <mesh castShadow><torusGeometry args={[1.3, 0.24, 28, 72]} /><meshStandardMaterial color="#50666b" metalness={0.42} roughness={0.28} /></mesh>
        <mesh position={[0, 0, 0.04]}><circleGeometry args={[1.1, 64]} /><meshPhysicalMaterial color="#8db6bf" transparent opacity={0.3} transmission={0.72} roughness={0.18} depthWrite={false} /></mesh>
        <mesh position={[-1.45, 0, 0]}><boxGeometry args={[0.34, 0.56, 0.24]} /><meshStandardMaterial color="#4a5d61" metalness={0.52} roughness={0.28} /></mesh>
        <mesh position={[1.38, 0, -0.03]}><boxGeometry args={[0.22, 0.42, 0.18]} /><meshStandardMaterial color="#9ba5a2" metalness={0.52} roughness={0.28} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-bellow-outer-clamp" home={[0, 0.25, 2.23]} exploded={[0, 0.25, 5.55]} assemblyEnabled={assemblyEnabled} selectionRadius={1.3}>
        <mesh><torusGeometry args={[1.38, 0.025, 10, 72]} /><meshStandardMaterial color="#9ba6a4" metalness={0.75} roughness={0.2} /></mesh>
        <mesh position={[1.35, -0.18, 0]}><boxGeometry args={[0.18, 0.1, 0.08]} /><meshStandardMaterial color="#7b8785" metalness={0.75} roughness={0.22} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-door-lock" home={[1.52, 0.25, 2.05]} exploded={[3.4, 0.25, 4.6]} assemblyEnabled={assemblyEnabled} selectionRadius={0.34}>
        <mesh castShadow><boxGeometry args={[0.34, 0.62, 0.34]} /><meshStandardMaterial color="#52676b" metalness={0.28} roughness={0.35} /></mesh>
        <mesh position={[-0.12, 0, 0.2]}><boxGeometry args={[0.12, 0.22, 0.16]} /><meshStandardMaterial color="#a4adaa" metalness={0.56} roughness={0.25} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-bellow-inner-clamp" home={[0, 0.25, 1.72]} exploded={[2.95, 0.25, 4.15]} assemblyEnabled={assemblyEnabled} selectionRadius={1.42}>
        <mesh><torusGeometry args={[1.44, 0.028, 10, 72]} /><meshStandardMaterial color="#87928f" metalness={0.72} roughness={0.24} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-bellow" home={[0, 0.25, 1.84]} exploded={[3.7, 0.45, 3.6]} assemblyEnabled={assemblyEnabled} selectionRadius={1.42}>
        <mesh castShadow><torusGeometry args={[1.38, 0.3, 28, 72]} /><meshStandardMaterial color="#697775" roughness={0.58} /></mesh>
        <mesh position={[0, -1.3, 0.03]}><torusGeometry args={[0.22, 0.045, 12, 36, Math.PI]} /><meshStandardMaterial color="#566563" roughness={0.55} /></mesh>
      </ExplodablePart>
    </group>
  );
}
