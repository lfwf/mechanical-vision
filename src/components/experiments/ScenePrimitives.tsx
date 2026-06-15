import { useMemo } from "react";
import { CatmullRomCurve3, Quaternion, Vector3 } from "three";

interface RodBetweenProps {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
}

export function RodBetween({ start, end, radius = 0.12, color = "#5b6c70", metalness = 0.65, roughness = 0.25 }: RodBetweenProps) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...start);
    const b = new Vector3(...end);
    const direction = b.clone().sub(a);
    const lengthValue = direction.length();
    const midpoint = a.clone().add(b).multiplyScalar(0.5);
    const quaternionValue = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize());
    return { position: midpoint, quaternion: quaternionValue, length: lengthValue };
  }, [start, end]);
  return <mesh position={position} quaternion={quaternion} castShadow receiveShadow><cylinderGeometry args={[radius, radius, length, 32]} /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></mesh>;
}

export function Spring({ length = 1.2, radius = 0.42, turns = 7, color = "#647579", position = [0, 0, 0], rotation = [0, 0, 0] }: { length?: number; radius?: number; turns?: number; color?: string; position?: [number, number, number]; rotation?: [number, number, number] }) {
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const segments = turns * 28;
    for (let index = 0; index <= segments; index += 1) {
      const progress = index / segments;
      const angle = progress * Math.PI * 2 * turns;
      points.push(new Vector3(-length / 2 + progress * length, Math.cos(angle) * radius, Math.sin(angle) * radius));
    }
    return new CatmullRomCurve3(points);
  }, [length, radius, turns]);
  return <mesh position={position} rotation={rotation} castShadow><tubeGeometry args={[curve, turns * 28, 0.028, 10, false]} /><meshStandardMaterial color={color} metalness={0.75} roughness={0.22} /></mesh>;
}

export function FlowArrow({ position, rotation = [0, 0, 0], color = "#5ea9bf", scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; color?: string; scale?: number }) {
  return <group position={position} rotation={rotation} scale={scale}><mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.035, 0.035, 0.56, 12]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.16} /></mesh><mesh position={[0, 0.64, 0]}><coneGeometry args={[0.11, 0.24, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.16} /></mesh></group>;
}

export function TubePath({ points, color, radius = 0.055, opacity = 1 }: { points: Array<[number, number, number]>; color: string; radius?: number; opacity?: number }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal"), [points]);
  return <mesh><tubeGeometry args={[curve, Math.max(24, points.length * 16), radius, 10, false]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} transparent={opacity < 1} opacity={opacity} /></mesh>;
}
