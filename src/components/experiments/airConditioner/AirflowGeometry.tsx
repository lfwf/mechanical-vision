import { DoubleSide, type Group } from "three";

export function FilterPanel({ width, height, color = "#d0dcd8" }: { width: number; height: number; color?: string }) {
  return (
    <group>
      <mesh><boxGeometry args={[width, height, 0.035]} /><meshStandardMaterial color={color} wireframe transparent opacity={0.82} /></mesh>
      {[height / 2, -height / 2].map((y) => <mesh key={y} position={[0, y, 0.015]}><boxGeometry args={[width + 0.08, 0.055, 0.06]} /><meshStandardMaterial color="#829691" roughness={0.45} /></mesh>)}
      {[-width / 2, width / 2].map((x) => <mesh key={x} position={[x, 0, 0.015]}><boxGeometry args={[0.055, height, 0.06]} /><meshStandardMaterial color="#829691" roughness={0.45} /></mesh>)}
    </group>
  );
}

export function IndoorAirGrille() {
  return (
    <group>
      {Array.from({ length: 18 }, (_, index) => <mesh key={index} position={[-2.65 + index * 0.31, 0, 0]} rotation={[0, 0, -0.08]}><boxGeometry args={[0.11, 0.72, 0.055]} /><meshStandardMaterial color="#dfe4df" roughness={0.42} /></mesh>)}
      {[0.37, -0.37].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[5.45, 0.07, 0.075]} /><meshStandardMaterial color="#e8ebe6" roughness={0.4} /></mesh>)}
    </group>
  );
}

export function CrossFlowFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  return (
    <group ref={fanRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.32, 0.32, 4.8, 48, 1, true]} /><meshStandardMaterial color="#304b50" metalness={0.42} roughness={0.3} side={DoubleSide} /></mesh>
      {Array.from({ length: 24 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 24;
        return <mesh key={index} position={[0, Math.cos(angle) * 0.28, Math.sin(angle) * 0.28]} rotation={[angle + 0.18, 0, 0]}><boxGeometry args={[4.62, 0.026, 0.11]} /><meshStandardMaterial color="#6f9195" metalness={0.26} roughness={0.35} /></mesh>;
      })}
      {[-2.42, 2.42].map((x) => <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.35, 0.35, 0.07, 32]} /><meshStandardMaterial color="#3d565b" metalness={0.55} roughness={0.25} /></mesh>)}
    </group>
  );
}

export function AxialFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  return (
    <group ref={fanRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.36, 36]} /><meshStandardMaterial color="#354e53" metalness={0.68} roughness={0.23} /></mesh>
      {Array.from({ length: 5 }, (_, index) => <group key={index} rotation={[0, 0, (index * Math.PI * 2) / 5]}><mesh position={[0.86, 0, 0]} rotation={[0.18, 0.34, 0.24]} castShadow><boxGeometry args={[1.28, 0.42, 0.11]} /><meshStandardMaterial color="#6d9298" metalness={0.38} roughness={0.3} /></mesh></group>)}
    </group>
  );
}

export function VerticalVanes() {
  return (
    <group>
      {Array.from({ length: 15 }, (_, index) => <mesh key={index} position={[-2.3 + index * 0.33, 0, 0]} rotation={[0.12, 0.08, 0]}><boxGeometry args={[0.055, 0.5, 0.4]} /><meshStandardMaterial color="#e5e9e4" roughness={0.42} /></mesh>)}
      <mesh position={[0, 0.2, -0.14]}><boxGeometry args={[4.9, 0.045, 0.05]} /><meshStandardMaterial color="#aab6b2" roughness={0.42} /></mesh>
    </group>
  );
}

export function FrontGrille() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.18, 0.085, 16, 64]} /><meshStandardMaterial color="#dce2de" metalness={0.18} roughness={0.4} /></mesh>
      {Array.from({ length: 12 }, (_, index) => <mesh key={index} rotation={[0, 0, (index * Math.PI) / 12]}><boxGeometry args={[2.3, 0.035, 0.05]} /><meshStandardMaterial color="#a4b0ac" metalness={0.28} roughness={0.36} /></mesh>)}
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.66, 0.045, 12, 48]} /><meshStandardMaterial color="#a4b0ac" metalness={0.28} roughness={0.36} /></mesh>
    </group>
  );
}
