import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group, Mesh } from "three";
import { TubePath } from "../ScenePrimitives";

interface InjectionMoldingMachineProps {
  movingPlatenRef: RefObject<Group | null>;
  screwRef: RefObject<Group | null>;
  ejectorRef: RefObject<Group | null>;
  coolingRef: RefObject<Group | null>;
  meltRefs: RefObject<Array<Mesh | null>>;
}

function Screw() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 3.6, 40]} />
        <meshStandardMaterial color="#9eb5c3" metalness={0.82} roughness={0.18} />
      </mesh>
      {Array.from({ length: 14 }, (_, index) => (
        <mesh key={index} position={[-1.62 + index * 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.23, 0.04, 10, 28]} />
          <meshStandardMaterial color="#c2d4df" metalness={0.74} roughness={0.19} />
        </mesh>
      ))}
    </group>
  );
}

export function InjectionMoldingMachine({ movingPlatenRef, screwRef, ejectorRef, coolingRef, meltRefs }: InjectionMoldingMachineProps) {
  const materialPath: Array<[number, number, number]> = [
    [-4.4, 0.18, 0],
    [-3.4, 0.18, 0],
    [-2.45, 0.18, 0],
    [-1.7, 0.18, 0],
    [-1.18, 0.18, 0],
  ];
  const coolingPathA: Array<[number, number, number]> = [[-0.82, 0.72, -0.52], [-0.58, 0.72, -0.52], [-0.58, -0.72, -0.52], [-0.82, -0.72, -0.52]];
  const coolingPathB: Array<[number, number, number]> = [[0.12, 0.72, 0.52], [0.38, 0.72, 0.52], [0.38, -0.72, 0.52], [0.12, -0.72, 0.52]];

  return (
    <group position={[-1.8, 0, 0]}>
      <RoundedBox args={[8.2, 0.42, 3.7]} radius={0.14} smoothness={5} position={[-1.2, -1.45, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#e8f0f5" metalness={0.16} roughness={0.34} />
      </RoundedBox>

      <group position={[-3.2, 0, 0]}>
        <RoundedBox args={[3.7, 1.18, 1.32]} radius={0.16} smoothness={6} castShadow>
          <meshStandardMaterial color="#dbe9f1" metalness={0.2} roughness={0.32} />
        </RoundedBox>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.45, 3.8, 56]} />
          <meshStandardMaterial color="#7996a7" metalness={0.52} roughness={0.26} />
        </mesh>
        <group ref={screwRef} position={[-2.2, 0.18, 0]}>
          <Screw />
        </group>
        <mesh position={[-3.95, 1.05, 0]}>
          <coneGeometry args={[0.7, 1.45, 4]} />
          <meshStandardMaterial color="#c8dce8" metalness={0.18} roughness={0.34} />
        </mesh>
        <mesh position={[-1.2, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.58, 40]} />
          <meshStandardMaterial color="#aebfca" metalness={0.68} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-0.8, 0, 0]}>
        <RoundedBox args={[0.52, 2.55, 2.95]} radius={0.08} smoothness={5} castShadow>
          <meshStandardMaterial color="#8ea5b2" metalness={0.42} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.5, 2.08, 2.5]} radius={0.06} smoothness={4} position={[0.4, 0, 0]} castShadow>
          <meshStandardMaterial color="#b7c8d2" metalness={0.28} roughness={0.36} />
        </RoundedBox>
      </group>

      <group ref={movingPlatenRef} position={[0.15, 0, 0]}>
        <RoundedBox args={[0.52, 2.55, 2.95]} radius={0.08} smoothness={5} castShadow>
          <meshStandardMaterial color="#7893a2" metalness={0.42} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.5, 2.08, 2.5]} radius={0.06} smoothness={4} position={[-0.4, 0, 0]} castShadow>
          <meshStandardMaterial color="#afc1cc" metalness={0.28} roughness={0.36} />
        </RoundedBox>
        <group ref={ejectorRef} position={[1.45, 0, 0]}>
          {[-0.42, 0, 0.42].map((y) => (
            <mesh key={y} position={[-0.66, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.82, 20]} />
              <meshStandardMaterial color="#c5d4dc" metalness={0.7} roughness={0.2} />
            </mesh>
          ))}
          <RoundedBox args={[0.2, 1.42, 1.6]} radius={0.05} smoothness={4} position={[-0.18, 0, 0]}>
            <meshStandardMaterial color="#557385" metalness={0.42} roughness={0.32} />
          </RoundedBox>
        </group>
      </group>

      {[-1.08, 1.08].map((z) => (
        <mesh key={z} position={[0.75, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 4.2, 28]} />
          <meshStandardMaterial color="#9fb4bf" metalness={0.66} roughness={0.2} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((y) => (
        <mesh key={y} position={[0.75, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 4.2, 28]} />
          <meshStandardMaterial color="#9fb4bf" metalness={0.66} roughness={0.2} />
        </mesh>
      ))}

      <TubePath points={materialPath} color="#f0a35c" radius={0.045} opacity={0.62} />
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} ref={(mesh) => { meltRefs.current[index] = mesh; }} visible={false}>
          <sphereGeometry args={[0.05, 12, 10]} />
          <meshStandardMaterial color="#ff9a48" emissive="#9b4518" emissiveIntensity={0.25} />
        </mesh>
      ))}
      <group ref={coolingRef} visible={false}>
        <TubePath points={coolingPathA} color="#5fb6e8" radius={0.035} opacity={0.9} />
        <TubePath points={coolingPathB} color="#5fb6e8" radius={0.035} opacity={0.9} />
      </group>

      <RoundedBox args={[1.45, 0.92, 2.0]} radius={0.12} smoothness={5} position={[2.55, 0, 0]} castShadow>
        <meshStandardMaterial color="#638399" metalness={0.34} roughness={0.32} />
      </RoundedBox>
      <mesh position={[1.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.3, 40]} />
        <meshStandardMaterial color="#8ea8b7" metalness={0.5} roughness={0.28} />
      </mesh>
    </group>
  );
}
