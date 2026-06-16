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
      {Array.from({ length: 38 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 38;
        return (
          <mesh key={index} position={[0, Math.cos(angle) * 0.31, Math.sin(angle) * 0.31]} rotation={[angle + 0.24, 0, 0]} castShadow>
            <boxGeometry args={[4.7, 0.018, 0.095]} />
            <meshPhysicalMaterial color="#536f73" metalness={0.2} roughness={0.34} clearcoat={0.08} side={DoubleSide} />
          </mesh>
        );
      })}
      {[-2.38, -1.58, -0.79, 0, 0.79, 1.58, 2.38].map((x, index) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[index === 0 || index === 6 ? 0.34 : 0.325, 0.025, 10, 42]} />
          <meshStandardMaterial color="#2f464a" metalness={0.46} roughness={0.28} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 4.92, 24]} />
        <meshStandardMaterial color="#283b3e" metalness={0.55} roughness={0.25} />
      </mesh>
      {[-2.44, 2.44].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 36]} />
          <meshStandardMaterial color="#31484c" metalness={0.52} roughness={0.26} />
        </mesh>
      ))}
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
