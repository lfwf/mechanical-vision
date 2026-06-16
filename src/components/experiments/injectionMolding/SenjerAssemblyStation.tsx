import { RoundedBox, Text } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group } from "three";
import { SENJER_SEQUENCE } from "./injectionMoldingCycle";

export const letterSlotPositions: Array<[number, number, number]> = SENJER_SEQUENCE.map((_, index) => [
  6.45 + index * 0.92,
  0.12,
  0,
]);

interface SenjerAssemblyStationProps {
  completedCount: number;
  slotRefs: RefObject<Array<Group | null>>;
}

export function SenjerAssemblyStation({ completedCount, slotRefs }: SenjerAssemblyStationProps) {
  return (
    <group>
      <RoundedBox args={[6.35, 0.34, 2.15]} radius={0.12} smoothness={5} position={[8.75, -0.88, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#e7f0f6" metalness={0.12} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[6.0, 0.14, 1.72]} radius={0.06} smoothness={4} position={[8.75, -0.63, 0]}>
        <meshStandardMaterial color="#b8d4e4" metalness={0.22} roughness={0.3} />
      </RoundedBox>
      {SENJER_SEQUENCE.map((letter, index) => {
        const position = letterSlotPositions[index];
        return (
          <group key={`${letter}-${index}`} position={position}>
            <RoundedBox args={[0.78, 0.08, 1.02]} radius={0.05} smoothness={4} position={[0, -0.54, 0]}>
              <meshStandardMaterial
                color={index < completedCount ? "#7fc3e7" : "#d6e4ec"}
                emissive={index < completedCount ? "#245a78" : "#000000"}
                emissiveIntensity={index < completedCount ? 0.16 : 0}
                roughness={0.34}
              />
            </RoundedBox>
            <Text position={[0, -0.5, 0.54]} fontSize={0.18} color="#31566a" anchorX="center" anchorY="middle">
              {index + 1}
            </Text>
            <group
              ref={(group) => {
                slotRefs.current[index] = group;
              }}
            />
          </group>
        );
      })}
      <Text position={[8.75, 0.98, 0]} fontSize={0.34} color="#234d64" anchorX="center" anchorY="middle">
        SENJER 生产装配台
      </Text>
    </group>
  );
}
