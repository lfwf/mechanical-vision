import { Edges, RoundedBox } from "@react-three/drei";

export function IndoorSectionFrame({ intensity = 1 }: { intensity?: number }) {
  const opacity = Math.max(0.28, Math.min(0.9, intensity));
  return (
    <group position={[0, 0.02, 0.88]} renderOrder={14}>
      <RoundedBox args={[5.82, 0.1, 0.12]} radius={0.04} smoothness={3} position={[0, 0.76, 0]}>
        <meshStandardMaterial color="#62b9c2" metalness={0.16} roughness={0.3} transparent opacity={opacity} depthWrite={false} />
      </RoundedBox>
      <RoundedBox args={[5.82, 0.1, 0.12]} radius={0.04} smoothness={3} position={[0, -0.72, 0]}>
        <meshStandardMaterial color="#62b9c2" metalness={0.16} roughness={0.3} transparent opacity={opacity} depthWrite={false} />
      </RoundedBox>
      <RoundedBox args={[0.1, 1.4, 0.12]} radius={0.04} smoothness={3} position={[-2.86, 0.02, 0]}>
        <meshStandardMaterial color="#62b9c2" metalness={0.16} roughness={0.3} transparent opacity={opacity} depthWrite={false} />
      </RoundedBox>
      <RoundedBox args={[0.1, 1.4, 0.12]} radius={0.04} smoothness={3} position={[2.86, 0.02, 0]}>
        <meshStandardMaterial color="#62b9c2" metalness={0.16} roughness={0.3} transparent opacity={opacity} depthWrite={false} />
      </RoundedBox>
      <mesh position={[0, 0.02, -0.055]}>
        <boxGeometry args={[5.66, 1.34, 0.02]} />
        <meshBasicMaterial color="#79c8ce" transparent opacity={0.035} depthWrite={false} />
        <Edges threshold={8} color="#3d8991" />
      </mesh>
    </group>
  );
}

export function OutdoorFanSectionRing({ opacity = 0.42 }: { opacity?: number }) {
  return (
    <group position={[-0.72, 0.02, 0.92]} renderOrder={14}>
      <mesh>
        <torusGeometry args={[1.29, 0.028, 12, 96]} />
        <meshStandardMaterial color="#68b8c0" metalness={0.2} roughness={0.3} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.04]}>
        <ringGeometry args={[1.22, 1.3, 96]} />
        <meshBasicMaterial color="#77c4cb" transparent opacity={0.035} depthWrite={false} />
      </mesh>
    </group>
  );
}
