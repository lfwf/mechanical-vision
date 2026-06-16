import { RoundedBox } from "@react-three/drei";
import { DoubleSide } from "three";
import { TubePath } from "../ScenePrimitives";
import { Fasteners, StepperMotor } from "./DetailGeometry";

const WHITE_ABS = "#f1f2ee";
const INNER_ABS = "#cbd2ce";
const DARK_PLASTIC = "#334346";
const COPPER = "#b56f31";

export function IndoorRearChassis({ opacity }: { opacity: number }) {
  const transparent = opacity < 0.98;
  return (
    <group>
      <RoundedBox args={[5.86, 1.72, 0.52]} radius={0.18} smoothness={5} castShadow>
        <meshPhysicalMaterial color="#d9deda" roughness={0.42} metalness={0.02} transparent={transparent} opacity={Math.max(0.22, opacity * 0.78)} depthWrite={!transparent} />
      </RoundedBox>
      <mesh position={[0, -0.55, 0.3]} castShadow>
        <boxGeometry args={[5.42, 0.46, 0.5]} />
        <meshStandardMaterial color={INNER_ABS} roughness={0.43} transparent={transparent} opacity={Math.max(0.26, opacity * 0.82)} />
      </mesh>
      <mesh position={[-1.25, 0.38, 0.3]}>
        <boxGeometry args={[2.78, 0.58, 0.17]} />
        <meshStandardMaterial color="#bdc6c1" roughness={0.82} />
      </mesh>
      <mesh position={[1.45, 0.24, 0.3]}>
        <boxGeometry args={[1.28, 0.78, 0.18]} />
        <meshStandardMaterial color="#bdc6c1" roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.2, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.08, 18, 72, Math.PI]} />
        <meshStandardMaterial color="#aeb9b4" roughness={0.5} />
      </mesh>
      <Fasteners points={[[-2.56, 0.64, 0.26], [2.56, 0.64, 0.26], [-2.56, -0.62, 0.26], [2.56, -0.62, 0.26]]} />
    </group>
  );
}

export function IndoorFrontPanel({ opacity }: { opacity: number }) {
  const transparent = opacity < 0.98;
  return (
    <group>
      <RoundedBox args={[5.92, 1.5, 0.28]} radius={0.24} smoothness={6} position={[0, 0.06, 0]} castShadow>
        <meshPhysicalMaterial color={WHITE_ABS} roughness={0.25} metalness={0.01} clearcoat={0.42} clearcoatRoughness={0.28} transparent={transparent} opacity={opacity} depthWrite={!transparent} />
      </RoundedBox>
      <RoundedBox args={[5.58, 0.28, 0.34]} radius={0.12} smoothness={4} position={[0, 0.73, -0.02]} rotation={[-0.08, 0, 0]} castShadow>
        <meshPhysicalMaterial color="#f5f5f1" roughness={0.27} clearcoat={0.36} transparent={transparent} opacity={opacity} />
      </RoundedBox>
      <RoundedBox args={[5.38, 0.22, 0.38]} radius={0.1} smoothness={4} position={[0, -0.68, 0.02]} rotation={[0.05, 0, 0]} castShadow>
        <meshPhysicalMaterial color="#e9ece7" roughness={0.3} clearcoat={0.26} transparent={transparent} opacity={opacity} />
      </RoundedBox>
      <mesh position={[1.78, -0.35, 0.16]}>
        <boxGeometry args={[0.72, 0.13, 0.035]} />
        <meshPhysicalMaterial color="#1b2729" roughness={0.22} clearcoat={0.3} transparent opacity={Math.max(0.18, opacity)} />
      </mesh>
      <mesh position={[-1.93, -0.4, 0.16]} rotation={[0, 0, -0.42]}>
        <boxGeometry args={[0.37, 0.07, 0.03]} />
        <meshStandardMaterial color="#2e9ec1" roughness={0.3} transparent opacity={Math.max(0.22, opacity)} />
      </mesh>
      <mesh position={[-1.66, -0.4, 0.16]} rotation={[0, 0, -0.42]}>
        <boxGeometry args={[0.2, 0.07, 0.03]} />
        <meshStandardMaterial color="#1c7191" roughness={0.3} transparent opacity={Math.max(0.22, opacity)} />
      </mesh>
      <Fasteners points={[[-2.72, 0.58, -0.06], [2.72, 0.58, -0.06], [-2.72, -0.58, -0.06], [2.72, -0.58, -0.06]]} />
    </group>
  );
}

export function IndoorIntakeGrille() {
  return (
    <group>
      {Array.from({ length: 29 }, (_, index) => (
        <mesh key={index} position={[-2.7 + index * 0.193, 0, 0]} rotation={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[0.075, 0.78, 0.06]} />
          <meshPhysicalMaterial color="#e8eae6" roughness={0.36} clearcoat={0.15} />
        </mesh>
      ))}
      {[0.41, -0.41].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[5.55, 0.07, 0.08]} />
          <meshStandardMaterial color="#d9ded9" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.035]}>
        <boxGeometry args={[5.44, 0.72, 0.025]} />
        <meshStandardMaterial color="#bbc5c0" roughness={0.52} transparent opacity={0.38} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function FilterGrid({ width, height }: { width: number; height: number }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[width, height, 0.035]} />
        <meshStandardMaterial color="#c8d3ce" transparent opacity={0.26} side={DoubleSide} />
      </mesh>
      {Array.from({ length: 17 }, (_, index) => (
        <mesh key={`v-${index}`} position={[-width / 2 + 0.08 + index * ((width - 0.16) / 16), 0, 0.025]}>
          <boxGeometry args={[0.018, height - 0.1, 0.025]} />
          <meshStandardMaterial color="#8c9e98" roughness={0.48} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={`h-${index}`} position={[0, -height / 2 + 0.08 + index * ((height - 0.16) / 6), 0.028]}>
          <boxGeometry args={[width - 0.1, 0.018, 0.025]} />
          <meshStandardMaterial color="#8c9e98" roughness={0.48} />
        </mesh>
      ))}
      {[height / 2, -height / 2].map((y) => (
        <mesh key={y} position={[0, y, 0.035]}>
          <boxGeometry args={[width + 0.08, 0.065, 0.07]} />
          <meshStandardMaterial color="#80938d" roughness={0.45} />
        </mesh>
      ))}
      {[-width / 2, width / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0.035]}>
          <boxGeometry args={[0.065, height, 0.07]} />
          <meshStandardMaterial color="#80938d" roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

export function IndoorFilterCassettes() {
  return (
    <group>
      <group position={[-1.37, 0, 0]} rotation={[-0.05, 0.03, 0]}><FilterGrid width={2.48} height={1.05} /></group>
      <group position={[1.37, 0, 0]} rotation={[-0.05, -0.03, 0]}><FilterGrid width={2.48} height={1.05} /></group>
    </group>
  );
}

export function IndoorFineFilterModules() {
  return (
    <group>
      <group position={[-1.34, 0, 0]}>
        <RoundedBox args={[1.18, 0.5, 0.08]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color="#84adbb" roughness={0.45} transparent opacity={0.78} />
        </RoundedBox>
        {Array.from({ length: 9 }, (_, index) => <mesh key={index} position={[-0.48 + index * 0.12, 0, 0.06]}><boxGeometry args={[0.025, 0.4, 0.025]} /><meshStandardMaterial color="#577f8a" roughness={0.5} /></mesh>)}
      </group>
      <group position={[1.34, 0, 0]}>
        <RoundedBox args={[1.18, 0.5, 0.08]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color="#b19dbb" roughness={0.45} transparent opacity={0.78} />
        </RoundedBox>
        {Array.from({ length: 9 }, (_, index) => <mesh key={index} position={[-0.48 + index * 0.12, 0, 0.06]}><boxGeometry args={[0.025, 0.4, 0.025]} /><meshStandardMaterial color="#826f8b" roughness={0.5} /></mesh>)}
      </group>
    </group>
  );
}

export function IndoorDrainPan() {
  return (
    <group>
      <RoundedBox args={[5.4, 0.2, 0.88]} radius={0.08} smoothness={4} castShadow>
        <meshPhysicalMaterial color="#819993" roughness={0.4} clearcoat={0.16} />
      </RoundedBox>
      <mesh position={[0, 0.14, -0.18]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[5.12, 0.08, 0.58]} />
        <meshStandardMaterial color="#a7bbb5" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.18, 0.27]}>
        <boxGeometry args={[5.2, 0.13, 0.08]} />
        <meshStandardMaterial color="#6e8882" roughness={0.42} />
      </mesh>
      <mesh position={[2.82, -0.02, -0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.12, 0.64, 24]} />
        <meshStandardMaterial color="#647b75" roughness={0.42} />
      </mesh>
      <mesh position={[2.55, -0.1, -0.08]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.025, 12, 32]} />
        <meshStandardMaterial color="#30433f" roughness={0.55} />
      </mesh>
    </group>
  );
}

export function IndoorFanMotor() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.34, 0.36, 0.74, 42]} />
        <meshStandardMaterial color="#344c50" metalness={0.58} roughness={0.26} />
      </mesh>
      <mesh position={[-0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 0.48, 20]} />
        <meshStandardMaterial color="#a1aaa6" metalness={0.82} roughness={0.17} />
      </mesh>
      <mesh position={[0.44, 0, 0]}>
        <boxGeometry args={[0.13, 0.62, 0.62]} />
        <meshStandardMaterial color="#6b7a76" metalness={0.36} roughness={0.34} />
      </mesh>
      <mesh position={[0.22, 0.33, 0.18]}>
        <boxGeometry args={[0.28, 0.16, 0.18]} />
        <meshStandardMaterial color="#1f2b2d" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function IndoorControlAssembly() {
  return (
    <group>
      <RoundedBox args={[1.12, 1.08, 0.62]} radius={0.07} smoothness={3} castShadow>
        <meshStandardMaterial color="#c9d0cc" metalness={0.25} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.34]}>
        <boxGeometry args={[0.92, 0.88, 0.045]} />
        <meshStandardMaterial color="#43885f" metalness={0.12} roughness={0.45} />
      </mesh>
      {[-0.34, -0.1, 0.16, 0.36].map((x, index) => (
        <mesh key={x} position={[x, index % 2 === 0 ? 0.2 : -0.16, 0.42]} castShadow>
          <boxGeometry args={[index === 0 ? 0.18 : 0.12, index === 0 ? 0.26 : 0.15, 0.12]} />
          <meshStandardMaterial color={index === 0 ? "#20292b" : index === 1 ? "#d5b75d" : "#2d393b"} metalness={0.25} roughness={0.34} />
        </mesh>
      ))}
      <mesh position={[0.42, 0.02, 0.43]}>
        <boxGeometry args={[0.12, 0.66, 0.1]} />
        <meshStandardMaterial color="#a3a79d" metalness={0.62} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.65, 0.06]}>
        <boxGeometry args={[0.84, 0.18, 0.4]} />
        <meshStandardMaterial color="#283436" metalness={0.26} roughness={0.36} />
      </mesh>
    </group>
  );
}

export function IndoorSensorHarness() {
  return (
    <group>
      <TubePath points={[[-1.62, 0, 0], [-0.88, 0.2, 0.03], [0.12, -0.08, 0.02], [1.24, 0.18, 0]]} color="#2e393b" radius={0.021} />
      <TubePath points={[[0.12, -0.08, 0.02], [0.74, -0.34, 0.06], [1.68, -0.28, 0.02]]} color="#b9523e" radius={0.017} />
      <TubePath points={[[-0.85, 0.18, 0.02], [-0.38, 0.5, -0.04], [0.1, 0.58, -0.08]]} color="#4a7e99" radius={0.015} />
      {[-1.62, 1.68].map((x) => (
        <mesh key={x} position={[x, x < 0 ? 0 : -0.28, 0]}>
          <sphereGeometry args={[0.085, 18, 12]} />
          <meshStandardMaterial color="#526366" metalness={0.28} roughness={0.34} />
        </mesh>
      ))}
      {[-0.72, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.16, 0.04]}>
          <boxGeometry args={[0.12, 0.08, 0.07]} />
          <meshStandardMaterial color="#737f7c" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function IndoorPipeTerminals() {
  return (
    <group>
      <TubePath points={[[-0.62, 0.2, -0.04], [-0.2, 0.08, -0.03], [0.36, -0.34, 0]]} color={COPPER} radius={0.064} />
      <TubePath points={[[-0.62, 0.42, -0.18], [-0.12, 0.23, -0.16], [0.48, -0.25, -0.12]]} color={COPPER} radius={0.04} />
      <TubePath points={[[-0.45, -0.08, 0.18], [0.02, -0.3, 0.18], [0.52, -0.58, 0.2]]} color="#748e88" radius={0.075} />
      {[[-0.54, 0.2, -0.04], [-0.54, 0.42, -0.18]].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[index === 0 ? 0.11 : 0.08, index === 0 ? 0.11 : 0.08, 0.2, 6]} />
          <meshStandardMaterial color="#bd8740" metalness={0.7} roughness={0.23} />
        </mesh>
      ))}
      <TubePath points={[[0.42, -0.44, 0.28], [0.72, -0.56, 0.3], [0.96, -0.6, 0.28]]} color="#343d3f" radius={0.026} />
    </group>
  );
}

export function IndoorVerticalVanes() {
  return (
    <group>
      {Array.from({ length: 17 }, (_, index) => (
        <mesh key={index} position={[-2.42 + index * 0.302, 0, 0]} rotation={[0.08, 0.12, 0]} castShadow>
          <boxGeometry args={[0.045, 0.48, 0.36]} />
          <meshPhysicalMaterial color="#e5e8e3" roughness={0.38} clearcoat={0.12} />
        </mesh>
      ))}
      <mesh position={[0, 0.19, -0.13]}>
        <boxGeometry args={[5.02, 0.04, 0.05]} />
        <meshStandardMaterial color="#aab5b1" roughness={0.42} />
      </mesh>
      <group position={[2.62, 0.02, -0.17]} scale={0.86}><StepperMotor /></group>
    </group>
  );
}

export function IndoorHorizontalLouver() {
  return (
    <group>
      <RoundedBox args={[5.28, 0.16, 0.62]} radius={0.1} smoothness={4} castShadow>
        <meshPhysicalMaterial color="#f0f2ed" roughness={0.33} clearcoat={0.25} />
      </RoundedBox>
      <RoundedBox args={[4.96, 0.11, 0.42]} radius={0.07} smoothness={3} position={[0, 0.12, -0.16]}>
        <meshPhysicalMaterial color="#dfe5df" roughness={0.38} clearcoat={0.14} />
      </RoundedBox>
      <mesh position={[2.66, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 20]} />
        <meshStandardMaterial color={DARK_PLASTIC} roughness={0.4} />
      </mesh>
      <mesh position={[-2.66, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 20]} />
        <meshStandardMaterial color={DARK_PLASTIC} roughness={0.4} />
      </mesh>
    </group>
  );
}
