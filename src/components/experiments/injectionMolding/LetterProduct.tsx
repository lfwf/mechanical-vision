import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { SenjerLetter } from "./injectionMoldingCycle";

type Segment = {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
};

const horizontal = (y: number, width = 0.8): Segment => ({ position: [0, y, 0], size: [width, 0.16, 0.18] });
const vertical = (x: number, y: number, height = 0.72): Segment => ({ position: [x, y, 0], size: [0.16, height, 0.18] });

const letterSegments: Record<SenjerLetter, Segment[]> = {
  S: [horizontal(0.36), horizontal(0), horizontal(-0.36), vertical(-0.32, 0.18, 0.42), vertical(0.32, -0.18, 0.42)],
  E: [horizontal(0.36), horizontal(0), horizontal(-0.36), vertical(-0.32, 0, 0.88)],
  N: [vertical(-0.32, 0, 0.88), vertical(0.32, 0, 0.88), { position: [0, 0, 0], size: [0.16, 0.92, 0.18], rotation: [0, 0, -0.62] }],
  J: [horizontal(0.36), vertical(0.28, 0, 0.88), horizontal(-0.36, 0.58), vertical(-0.25, -0.22, 0.28)],
  R: [vertical(-0.32, 0, 0.88), horizontal(0.36, 0.7), horizontal(0, 0.7), vertical(0.3, 0.2, 0.42), { position: [0.12, -0.22, 0], size: [0.16, 0.52, 0.18], rotation: [0, 0, -0.62] }],
};

interface LetterProductProps extends ThreeElements["group"] {
  letter: SenjerLetter;
  color?: string;
  glow?: boolean;
}

export function LetterProduct({ letter, color = "#8fc7e8", glow = false, ...groupProps }: LetterProductProps) {
  return (
    <group {...groupProps}>
      {letterSegments[letter].map((segment, index) => (
        <RoundedBox
          key={`${letter}-${index}`}
          args={segment.size}
          radius={0.045}
          smoothness={4}
          position={segment.position}
          rotation={segment.rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            metalness={0.12}
            roughness={0.28}
            emissive={glow ? color : "#000000"}
            emissiveIntensity={glow ? 0.24 : 0}
          />
        </RoundedBox>
      ))}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[0.9, 0.96, 0.04]} />
        <meshBasicMaterial color="#dff3ff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}
