import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface CabinetAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
}

function FrontPanelFrame() {
  return (
    <group>
      <mesh position={[0, 2.05, 0]} castShadow><boxGeometry args={[4.58, 0.86, 0.16]} /><meshStandardMaterial color="#eceee9" roughness={0.42} /></mesh>
      <mesh position={[0, -1.95, 0]} castShadow><boxGeometry args={[4.58, 1.14, 0.16]} /><meshStandardMaterial color="#eceee9" roughness={0.42} /></mesh>
      <mesh position={[-2.02, 0, 0]} castShadow><boxGeometry args={[0.54, 3.45, 0.16]} /><meshStandardMaterial color="#eceee9" roughness={0.42} /></mesh>
      <mesh position={[2.02, 0, 0]} castShadow><boxGeometry args={[0.54, 3.45, 0.16]} /><meshStandardMaterial color="#eceee9" roughness={0.42} /></mesh>
      <mesh position={[-1.68, -1.75, 0.1]}><boxGeometry args={[0.72, 0.42, 0.08]} /><meshStandardMaterial color="#d9ded9" roughness={0.45} /></mesh>
    </group>
  );
}

export function CabinetAssembly({ mode, assemblyEnabled }: CabinetAssemblyProps) {
  const showUpperControls = assemblyEnabled || mode === WashingMachineMode.WashWaterPath;
  return (
    <group>
      <ExplodablePart id="wm-cabinet-frame" home={[0, 0, 0]} exploded={[0, 0, 0]} assemblyEnabled={assemblyEnabled} selectionRadius={2.4}>
        <mesh position={[0, -2.62, 0]} receiveShadow><boxGeometry args={[4.72, 0.24, 4.34]} /><meshStandardMaterial color="#46595d" metalness={0.34} roughness={0.4} /></mesh>
        {[-2.2, 2.2].flatMap((x) => [-1.98, 1.98].map((z) => <mesh key={`${x}-${z}`} position={[x, 0, z]}><boxGeometry args={[0.14, 5.15, 0.14]} /><meshStandardMaterial color="#83908e" metalness={0.38} roughness={0.36} /></mesh>))}
        {[-1.98, 1.98].map((z) => <mesh key={z} position={[0, 2.48, z]}><boxGeometry args={[4.5, 0.14, 0.14]} /><meshStandardMaterial color="#83908e" metalness={0.38} roughness={0.36} /></mesh>)}
        {[-2.2, 2.2].map((x) => <mesh key={x} position={[x, 2.48, 0]}><boxGeometry args={[0.14, 0.14, 4.0]} /><meshStandardMaterial color="#83908e" metalness={0.38} roughness={0.36} /></mesh>)}
      </ExplodablePart>

      {assemblyEnabled && <>
        <ExplodablePart id="wm-top-cover" home={[0, 2.72, 0]} exploded={[0, 4.5, -0.7]} assemblyEnabled selectionRadius={2.1}><mesh castShadow><boxGeometry args={[4.64, 0.18, 4.22]} /><meshStandardMaterial color="#f1f2ed" roughness={0.38} /></mesh></ExplodablePart>
        <ExplodablePart id="wm-front-panel" home={[0, -0.05, 2.16]} exploded={[0, -0.05, 5.2]} assemblyEnabled selectionRadius={2.4}><FrontPanelFrame /></ExplodablePart>
        <ExplodablePart id="wm-rear-cover" home={[0, 0, -2.16]} exploded={[0, 0, -5.25]} assemblyEnabled selectionRadius={2.35}><mesh castShadow><boxGeometry args={[4.48, 4.92, 0.14]} /><meshStandardMaterial color="#dce1dc" metalness={0.1} roughness={0.42} /></mesh><mesh position={[0, 0, -0.09]}><cylinderGeometry args={[1.55, 1.55, 0.05, 64]} /><meshStandardMaterial color="#bfc8c5" roughness={0.45} /></mesh></ExplodablePart>
      </>}

      {showUpperControls && <>
        <ExplodablePart id="wm-control-panel" home={[0, 2.08, 2.12]} exploded={[0, 3.8, 3.75]} assemblyEnabled={assemblyEnabled} selectionRadius={2.0}><mesh castShadow><boxGeometry args={[4.5, 0.78, 0.3]} /><meshStandardMaterial color="#e9ebe7" roughness={0.4} /></mesh><mesh position={[0.35, 0, 0.19]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.34, 0.34, 0.14, 40]} /><meshStandardMaterial color="#52696e" metalness={0.45} roughness={0.28} /></mesh><mesh position={[1.45, 0, 0.18]}><boxGeometry args={[1.15, 0.32, 0.06]} /><meshStandardMaterial color="#253d42" emissive="#4ca0b1" emissiveIntensity={0.12} /></mesh></ExplodablePart>
        <ExplodablePart id="wm-detergent-drawer" home={[-1.42, 2.08, 2.28]} exploded={[-1.42, 2.08, 4.65]} assemblyEnabled={assemblyEnabled} selectionRadius={0.62}><mesh castShadow><boxGeometry args={[1.2, 0.5, 0.72]} /><meshStandardMaterial color="#edf0eb" roughness={0.4} /></mesh><mesh position={[0, 0, 0.39]}><boxGeometry args={[1.08, 0.38, 0.06]} /><meshStandardMaterial color="#c8d2ce" roughness={0.44} /></mesh></ExplodablePart>
      </>}

      {(assemblyEnabled || mode === WashingMachineMode.DriveCutaway) && <ExplodablePart id="wm-main-pcb" home={[1.35, 1.95, -1.58]} exploded={[3.75, 3.25, -3.15]} assemblyEnabled={assemblyEnabled} selectionRadius={0.78}><mesh castShadow><boxGeometry args={[1.35, 0.88, 0.58]} /><meshStandardMaterial color="#4a6267" metalness={0.28} roughness={0.35} /></mesh><mesh position={[0, 0, 0.31]}><boxGeometry args={[1.05, 0.64, 0.04]} /><meshStandardMaterial color="#6ba079" roughness={0.45} /></mesh></ExplodablePart>}
    </group>
  );
}
