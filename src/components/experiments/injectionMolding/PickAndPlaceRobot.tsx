import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group } from "three";

interface PickAndPlaceRobotProps {
  carriageRef: RefObject<Group | null>;
  gripperRef: RefObject<Group | null>;
}

export function PickAndPlaceRobot({ carriageRef, gripperRef }: PickAndPlaceRobotProps) {
  return (
    <group>
      <RoundedBox args={[5.8, 0.18, 0.28]} radius={0.06} smoothness={4} position={[1.85, 2.18, 0]} castShadow>
        <meshStandardMaterial color="#dbeaf3" metalness={0.26} roughness={0.3} />
      </RoundedBox>
      <group ref={carriageRef} position={[-0.5, 2.18, 0]}>
        <RoundedBox args={[0.62, 0.42, 0.62]} radius={0.08} smoothness={5} castShadow>
          <meshStandardMaterial color="#5a86a0" metalness={0.42} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.16, 1.35, 0.16]} radius={0.04} smoothness={4} position={[0, -0.78, 0]} castShadow>
          <meshStandardMaterial color="#83a8bd" metalness={0.52} roughness={0.26} />
        </RoundedBox>
        <group ref={gripperRef} position={[0, -1.48, 0]}>
          <RoundedBox args={[0.72, 0.18, 0.32]} radius={0.05} smoothness={4} castShadow>
            <meshStandardMaterial color="#3d6172" metalness={0.48} roughness={0.28} />
          </RoundedBox>
          {[-0.25, 0.25].map((z) => (
            <RoundedBox key={z} args={[0.12, 0.5, 0.1]} radius={0.03} smoothness={3} position={[0, -0.28, z]} castShadow>
              <meshStandardMaterial color="#6d91a4" metalness={0.52} roughness={0.26} />
            </RoundedBox>
          ))}
        </group>
      </group>
      {[-0.9, 4.6].map((x) => (
        <RoundedBox key={x} args={[0.28, 4.2, 0.5]} radius={0.06} smoothness={4} position={[x, 0.18, 0]} castShadow>
          <meshStandardMaterial color="#486b7c" metalness={0.36} roughness={0.34} />
        </RoundedBox>
      ))}
    </group>
  );
}
