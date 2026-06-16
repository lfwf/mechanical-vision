import { useMemo } from "react";
import { DoubleSide, Shape, type Group } from "three";

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

function usePropellerBladeShape() {
  return useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.2, -0.11);
    shape.bezierCurveTo(0.5, -0.32, 1.05, -0.48, 1.48, -0.26);
    shape.bezierCurveTo(1.73, -0.12, 1.78, 0.16, 1.58, 0.35);
    shape.bezierCurveTo(1.3, 0.58, 0.76, 0.46, 0.36, 0.18);
    shape.bezierCurveTo(0.25, 0.1, 0.2, 0.01, 0.2, -0.11);
    return shape;
  }, []);
}

export function AxialFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  const bladeShape = usePropellerBladeShape();
  return (
    <group ref={fanRef}>
      {Array.from({ length: 3 }, (_, index) => (
        <group key={index} rotation={[0, 0, (index * Math.PI * 2) / 3]}>
          <mesh position={[0, 0, -0.04]} rotation={[0.1, -0.16, -0.08]} castShadow>
            <extrudeGeometry args={[bladeShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 2 }]} />
            <meshPhysicalMaterial color="#20282a" roughness={0.34} metalness={0.08} clearcoat={0.16} side={DoubleSide} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.32, 48]} />
        <meshPhysicalMaterial color="#252e30" roughness={0.3} metalness={0.16} clearcoat={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.16, 32]} />
        <meshStandardMaterial color="#4c5657" metalness={0.44} roughness={0.26} />
      </mesh>
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
  const radius = 1.28;
  const horizontalBars = useMemo(() => Array.from({ length: 23 }, (_, index) => -1.18 + index * 0.107), []);
  const verticalBars = useMemo(() => [-0.94, -0.63, -0.31, 0, 0.31, 0.63, 0.94], []);

  return (
    <group>
      <mesh position={[0, 1.38, 0]} castShadow><boxGeometry args={[2.92, 0.14, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[0, -1.38, 0]} castShadow><boxGeometry args={[2.92, 0.14, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[-1.39, 0, 0]} castShadow><boxGeometry args={[0.14, 2.62, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[1.39, 0, 0]} castShadow><boxGeometry args={[0.14, 2.62, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[0, 0, -0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.055, 16, 96]} />
        <meshStandardMaterial color="#d9ddda" metalness={0.12} roughness={0.4} />
      </mesh>
      {horizontalBars.map((y) => {
        const chord = Math.sqrt(Math.max(0, radius * radius - y * y));
        return (
          <mesh key={`h-${y}`} position={[0, y, 0.08]} castShadow>
            <boxGeometry args={[chord * 2, 0.032, 0.045]} />
            <meshStandardMaterial color="#eceeea" metalness={0.06} roughness={0.38} />
          </mesh>
        );
      })}
      {verticalBars.map((x) => {
        const chord = Math.sqrt(Math.max(0, radius * radius - x * x));
        return (
          <mesh key={`v-${x}`} position={[x, 0, 0.095]} castShadow>
            <boxGeometry args={[0.028, chord * 2, 0.05]} />
            <meshStandardMaterial color="#e5e8e4" metalness={0.08} roughness={0.38} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.07, 36]} />
        <meshStandardMaterial color="#dfe3df" metalness={0.12} roughness={0.36} />
      </mesh>
    </group>
  );
}
