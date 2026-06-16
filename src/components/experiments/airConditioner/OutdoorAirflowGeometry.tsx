import { useMemo } from "react";
import { DoubleSide, Shape, type Group } from "three";

const FAN_TIP_RADIUS = 1.12;
const GRILLE_CLEAR_RADIUS = 1.28;

function usePropellerBladeShape() {
  return useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.2, -0.08);
    shape.bezierCurveTo(0.38, -0.22, 0.72, -0.34, 0.98, -0.22);
    shape.bezierCurveTo(FAN_TIP_RADIUS, -0.14, FAN_TIP_RADIUS + 0.02, 0.08, 1.03, 0.23);
    shape.bezierCurveTo(0.84, 0.39, 0.53, 0.32, 0.29, 0.15);
    shape.bezierCurveTo(0.22, 0.09, 0.19, 0, 0.2, -0.08);
    return shape;
  }, []);
}

export function RealisticAxialFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  const bladeShape = usePropellerBladeShape();
  return (
    <group ref={fanRef}>
      {Array.from({ length: 3 }, (_, index) => (
        <group key={index} rotation={[0, 0, (index * Math.PI * 2) / 3]}>
          <mesh position={[0, 0, -0.04]} rotation={[0.06, -0.12, -0.06]} castShadow>
            <extrudeGeometry args={[bladeShape, { depth: 0.085, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.014, bevelSegments: 2 }]} />
            <meshPhysicalMaterial color="#202728" roughness={0.34} metalness={0.08} clearcoat={0.16} side={DoubleSide} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.29, 0.29, 0.28, 48]} />
        <meshPhysicalMaterial color="#252e30" roughness={0.3} metalness={0.16} clearcoat={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 0.14, 32]} />
        <meshStandardMaterial color="#4c5657" metalness={0.44} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <torusGeometry args={[FAN_TIP_RADIUS + 0.04, 0.012, 8, 80]} />
        <meshStandardMaterial color="#4b5657" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function RealisticFrontGrille({ opacity = 1 }: { opacity?: number }) {
  const radius = GRILLE_CLEAR_RADIUS;
  const transparent = opacity < 0.99;
  const frameOpacity = transparent ? Math.max(0.32, opacity) : 1;
  const barOpacity = transparent ? Math.max(0.12, opacity * 0.82) : 1;
  const horizontalBars = useMemo(() => Array.from({ length: 21 }, (_, index) => -1.16 + index * 0.116), []);
  const verticalBars = useMemo(() => [-0.92, -0.61, -0.3, 0, 0.3, 0.61, 0.92], []);

  return (
    <group renderOrder={13}>
      <mesh position={[0, 1.38, 0]} castShadow={!transparent}><boxGeometry args={[2.92, 0.12, 0.14]} /><meshPhysicalMaterial color="#e9ece8" roughness={0.34} clearcoat={0.16} transparent={transparent} opacity={frameOpacity} depthWrite={!transparent} /></mesh>
      <mesh position={[0, -1.38, 0]} castShadow={!transparent}><boxGeometry args={[2.92, 0.12, 0.14]} /><meshPhysicalMaterial color="#e9ece8" roughness={0.34} clearcoat={0.16} transparent={transparent} opacity={frameOpacity} depthWrite={!transparent} /></mesh>
      <mesh position={[-1.39, 0, 0]} castShadow={!transparent}><boxGeometry args={[0.12, 2.62, 0.14]} /><meshPhysicalMaterial color="#e9ece8" roughness={0.34} clearcoat={0.16} transparent={transparent} opacity={frameOpacity} depthWrite={!transparent} /></mesh>
      <mesh position={[1.39, 0, 0]} castShadow={!transparent}><boxGeometry args={[0.12, 2.62, 0.14]} /><meshPhysicalMaterial color="#e9ece8" roughness={0.34} clearcoat={0.16} transparent={transparent} opacity={frameOpacity} depthWrite={!transparent} /></mesh>
      <mesh position={[0, 0, -0.015]}>
        <torusGeometry args={[radius, 0.045, 14, 96]} />
        <meshStandardMaterial color="#cfd6d3" metalness={0.12} roughness={0.4} transparent={transparent} opacity={frameOpacity} depthWrite={!transparent} />
      </mesh>
      {horizontalBars.map((y) => {
        const chord = Math.sqrt(Math.max(0, radius * radius - y * y));
        return (
          <mesh key={`h-${y}`} position={[0, y, 0.08]} castShadow={!transparent}>
            <boxGeometry args={[chord * 2, 0.022, 0.032]} />
            <meshStandardMaterial color="#d9dfdc" metalness={0.06} roughness={0.38} transparent={transparent} opacity={barOpacity} depthWrite={!transparent} />
          </mesh>
        );
      })}
      {verticalBars.map((x) => {
        const chord = Math.sqrt(Math.max(0, radius * radius - x * x));
        return (
          <mesh key={`v-${x}`} position={[x, 0, 0.095]} castShadow={!transparent}>
            <boxGeometry args={[0.02, chord * 2, 0.034]} />
            <meshStandardMaterial color="#d6ddda" metalness={0.08} roughness={0.38} transparent={transparent} opacity={barOpacity} depthWrite={!transparent} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 36]} />
        <meshStandardMaterial color="#d4dad7" metalness={0.12} roughness={0.36} transparent={transparent} opacity={frameOpacity} depthWrite={!transparent} />
      </mesh>
    </group>
  );
}
