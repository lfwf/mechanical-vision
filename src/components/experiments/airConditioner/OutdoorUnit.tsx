import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group } from "three";
import { ExplodablePart } from "../ExplodablePart";
import { TubePath } from "../ScenePrimitives";
import { AxialFan, FrontGrille } from "./AirflowGeometry";
import { Accumulator, ControlBox, Fasteners, FourWayValve, ServiceValves } from "./DetailGeometry";
import { OutdoorHeatExchanger } from "./HeatExchangers";

interface OutdoorUnitProps {
  assemblyEnabled: boolean;
  shellOpacity: number;
  fanRef: RefObject<Group | null>;
}

export function OutdoorUnit({ assemblyEnabled, shellOpacity, fanRef }: OutdoorUnitProps) {
  return (
    <group>
      <ExplodablePart id="ac-outdoor-mounting-feet" home={[4.4, -1.66, 0]} exploded={[4.4, -4.05, 1.25]} assemblyEnabled={assemblyEnabled} selectionRadius={1.9}>
        {[-1.55, 1.55].flatMap((x) => [-0.62, 0.62].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh><boxGeometry args={[0.62, 0.16, 0.5]} /><meshStandardMaterial color="#596965" metalness={0.5} roughness={0.34} /></mesh>
            <mesh position={[0, -0.12, 0]}><boxGeometry args={[0.48, 0.1, 0.4]} /><meshStandardMaterial color="#2f3939" roughness={0.72} /></mesh>
            <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.06, 0.06, 0.18, 16]} /><meshStandardMaterial color="#8b9692" metalness={0.8} roughness={0.2} /></mesh>
          </group>
        )))}
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-base-frame" home={[4.4, -1.43, 0]} exploded={[4.4, -3.05, -0.35]} assemblyEnabled={assemblyEnabled} selectionRadius={2.4}>
        <mesh receiveShadow><boxGeometry args={[4.5, 0.24, 2.0]} /><meshStandardMaterial color="#707e7b" metalness={0.48} roughness={0.33} /></mesh>
        <mesh position={[0.65, 0.48, 0]}><boxGeometry args={[0.08, 0.95, 1.9]} /><meshStandardMaterial color="#8c9995" metalness={0.52} roughness={0.31} /></mesh>
        <mesh position={[-1.35, 0.16, 0]}><boxGeometry args={[1.25, 0.08, 1.55]} /><meshStandardMaterial color="#8b9995" metalness={0.45} roughness={0.34} /></mesh>
        <Fasteners points={[[-1.8, 0.15, 0.72], [1.8, 0.15, 0.72], [-1.8, 0.15, -0.72], [1.8, 0.15, -0.72]]} />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-condenser" home={[4.4, 0.05, -0.38]} exploded={[4.4, 2.55, -3.15]} assemblyEnabled={assemblyEnabled} selectionRadius={2.5}>
        <OutdoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-compressor" home={[5.48, -0.52, -0.05]} exploded={[7.65, -1.62, -0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.95}>
        <mesh castShadow><cylinderGeometry args={[0.63, 0.72, 1.72, 48]} /><meshPhysicalMaterial color="#1f3438" metalness={0.58} roughness={0.25} clearcoat={0.22} /></mesh>
        <mesh position={[0, 0.96, 0]}><cylinderGeometry args={[0.33, 0.48, 0.24, 36]} /><meshStandardMaterial color="#344c51" metalness={0.55} roughness={0.27} /></mesh>
        <mesh position={[0.48, 0.35, 0]}><boxGeometry args={[0.28, 0.42, 0.22]} /><meshStandardMaterial color="#202c2f" metalness={0.3} roughness={0.35} /></mesh>
        <TubePath points={[[0.15, 0.82, 0], [0.48, 1.08, 0.02], [0.8, 1.3, -0.12]]} color="#b87938" radius={0.055} />
        <TubePath points={[[-0.18, 0.62, -0.1], [-0.5, 0.9, -0.12], [-0.82, 0.95, -0.25]]} color="#b87938" radius={0.075} />
        {[-0.42, 0.42].flatMap((x) => [-0.35, 0.35].map((z) => <mesh key={`${x}-${z}`} position={[x, -0.94, z]}><cylinderGeometry args={[0.12, 0.15, 0.18, 20]} /><meshStandardMaterial color="#323a39" roughness={0.78} /></mesh>))}
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-four-way-valve" home={[5.0, 0.36, -0.08]} exploded={[7.12, 0.75, -1.48]} assemblyEnabled={assemblyEnabled} selectionRadius={0.9}>
        <FourWayValve />
        <group position={[-0.72, -0.5, -0.1]}><Accumulator /></group>
        <TubePath points={[[0.2, -0.35, 0.2], [0.6, -0.6, 0.18], [0.85, -1.0, 0.05]]} color="#b87938" radius={0.045} />
        <TubePath points={[[-0.2, -0.35, -0.2], [-0.5, -0.5, -0.3], [-0.72, -0.12, -0.1]]} color="#b87938" radius={0.055} />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-expansion-valve" home={[4.7, -0.52, -0.62]} exploded={[6.75, -0.48, -2.28]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
        <mesh castShadow><cylinderGeometry args={[0.17, 0.21, 0.52, 28]} /><meshStandardMaterial color="#b9823d" metalness={0.7} roughness={0.22} /></mesh>
        <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.2, 0.2, 0.24, 24]} /><meshStandardMaterial color="#3c5357" metalness={0.52} roughness={0.29} /></mesh>
        <TubePath points={[[0, -0.28, 0], [0.22, -0.5, 0.05], [0.5, -0.62, 0.02]]} color="#b87938" radius={0.04} />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-service-valves" home={[6.35, -0.74, 0.46]} exploded={[7.92, -1.25, 2.02]} assemblyEnabled={assemblyEnabled} selectionRadius={0.75}>
        <ServiceValves />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-fan-motor" home={[3.72, 0.14, 0.32]} exploded={[2.32, 1.62, 2.02]} assemblyEnabled={assemblyEnabled} selectionRadius={0.68}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.42, 0.42, 0.68, 36]} /><meshStandardMaterial color="#40575c" metalness={0.64} roughness={0.24} /></mesh>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.58, 18]} /><meshStandardMaterial color="#9ba4a0" metalness={0.82} roughness={0.17} /></mesh>
        <mesh position={[0, 0, -0.45]}><boxGeometry args={[0.92, 0.92, 0.09]} /><meshStandardMaterial color="#75837f" metalness={0.48} roughness={0.32} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-axial-fan" home={[3.72, 0.14, 0.88]} exploded={[1.35, 0.32, 3.32]} assemblyEnabled={assemblyEnabled} selectionRadius={1.5}>
        <AxialFan fanRef={fanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-front-grille" home={[3.72, 0.14, 1.18]} exploded={[1.78, 0.18, 4.25]} assemblyEnabled={assemblyEnabled} selectionRadius={1.65}>
        <FrontGrille />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-control-box" home={[5.48, 0.94, 0.02]} exploded={[7.48, 2.72, 1.45]} assemblyEnabled={assemblyEnabled} selectionRadius={1.0}>
        <ControlBox width={1.35} height={0.98} depth={0.72} />
        <mesh position={[0.42, 0.12, 0.41]}><boxGeometry args={[0.24, 0.62, 0.1]} /><meshStandardMaterial color="#9a9d92" metalness={0.62} roughness={0.26} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-cabinet-panels" home={[4.4, 0.1, 0]} exploded={[6.65, 3.72, 2.88]} assemblyEnabled={assemblyEnabled} selectionRadius={2.7}>
        <mesh position={[0, 1.55, 0]} castShadow><boxGeometry args={[4.55, 0.17, 2.02]} /><meshPhysicalMaterial color="#e6e9e4" metalness={0.12} roughness={0.35} clearcoat={0.18} /></mesh>
        <mesh position={[2.18, 0, 0]} castShadow><boxGeometry args={[0.17, 3.0, 2.0]} /><meshPhysicalMaterial color="#e1e6e1" metalness={0.14} roughness={0.36} transparent opacity={Math.max(0.24, shellOpacity)} depthWrite={false} /></mesh>
        <mesh position={[0, 0, -0.96]}><boxGeometry args={[4.4, 3.0, 0.08]} /><meshStandardMaterial color="#cdd5d1" metalness={0.25} roughness={0.38} transparent opacity={Math.max(0.18, shellOpacity * 0.55)} depthWrite={false} /></mesh>
        <mesh position={[-2.17, 0.85, 0]}><boxGeometry args={[0.16, 1.3, 2.0]} /><meshStandardMaterial color="#e1e6e1" metalness={0.14} roughness={0.36} transparent opacity={Math.max(0.24, shellOpacity)} depthWrite={false} /></mesh>
        <RoundedBox args={[1.15, 0.34, 0.06]} radius={0.06} smoothness={3} position={[1.45, 0.18, 1.04]}><meshPhysicalMaterial color="#f2f4ef" roughness={0.3} clearcoat={0.2} /></RoundedBox>
        <Fasteners points={[[-2.05, 1.45, 0.82], [2.05, 1.45, 0.82], [-2.05, -1.35, 0.82], [2.05, -1.35, 0.82]]} />
      </ExplodablePart>
    </group>
  );
}
