import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

interface ConveyorAssemblyProps {
  active: boolean;
  speed: number;
}

export function ConveyorAssembly({ active, speed }: ConveyorAssemblyProps) {
  const rollersRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!active || !rollersRef.current) return;
    rollersRef.current.children.forEach((child) => {
      child.rotation.z -= delta * (1.4 + speed / 35);
    });
  });

  return (
    <group position={[3.45, -0.62, 0]}>
      <RoundedBox args={[5.9, 0.18, 1.55]} radius={0.08} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial color="#dceaf3" metalness={0.18} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[5.7, 0.1, 1.28]} radius={0.04} smoothness={3} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#6d98ad" metalness={0.42} roughness={0.3} />
      </RoundedBox>
      <group ref={rollersRef}>
        {Array.from({ length: 13 }, (_, index) => (
          <mesh key={index} position={[-2.65 + index * 0.44, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 1.22, 28]} />
            <meshStandardMaterial color="#9ab6c6" metalness={0.62} roughness={0.22} />
          </mesh>
        ))}
      </group>
      {[-2.7, 2.7].map((x) => (
        <group key={x} position={[x, -0.48, 0]}>
          <RoundedBox args={[0.18, 0.84, 1.22]} radius={0.04} smoothness={3} castShadow>
            <meshStandardMaterial color="#496b79" metalness={0.38} roughness={0.34} />
          </RoundedBox>
          <RoundedBox args={[0.52, 0.12, 1.4]} radius={0.03} smoothness={3} position={[0, -0.46, 0]}>
            <meshStandardMaterial color="#35535f" metalness={0.34} roughness={0.4} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}
