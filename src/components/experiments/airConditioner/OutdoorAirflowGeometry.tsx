import { useMemo } from "react";
import { DoubleSide, Shape, type Group } from "three";

function usePropellerBladeShape() {
  return useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.18, -0.1);
    shape.bezierCurveTo(0.44, -0.31, 1.02, -0.49, 1.45, -0.27);
    shape.bezierCurveTo(1.7, -0.14, 1.78, 0.14, 1.58, 0.35);
    shape.bezierCurveTo(1.28, 0.59, 0.72, 0.47, 0.34, 0.18);
    shape.bezierCurveTo(0.23, 0.1, 0.18, 0, 0.18, -0.1);
    return shape;
  }, []);
}

export function RealisticAxialFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  const bladeShape = usePropellerBladeShape();
  return (
    <group ref={fanRef}>
      {Array.from({ length: 3 }, (_, index) => (
        <group key={index} rotation={[0, 0, (index * Math.PI * 2) / 3]}>
          <mesh position={[0, 0, -0.04]} rotation={[0.08, -0.17, -0.08]} castShadow>
            <extrudeGeometry args={[bladeShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 2 }]} />
            <meshPhysicalMaterial color="#202728" roughness={0.34} metalness={0.08} clearcoat={0.16} side={DoubleSide} />
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

export function RealisticFrontGrille() {
  const radius = 1.28;
  const horizontalBars = useMemo(() => Array.from({ length: 23 }, (_, index) => -1.18 + index * 0.107), []);
  const verticalBars = useMemo(() => [-0.94, -0.63, -0.31, 0, 0.31, 0.63, 0.94], []);

  return (
    <group>
      <mesh position={[0, 1.38, 0]} castShadow><boxGeometry args={[2.92, 0.14, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[0, -1.38, 0]} castShadow><boxGeometry args={[2.92, 0.14, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[-1.39, 0, 0]} castShadow><boxGeometry args={[0.14, 2.62, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[1.39, 0, 0]} castShadow><boxGeometry args={[0.14, 2.62, 0.16]} /><meshPhysicalMaterial color="#f1f2ee" roughness={0.34} clearcoat={0.16} /></mesh>
      <mesh position={[0, 0, -0.015]}>
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
