import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group } from "three";
import { ExplodablePart } from "../ExplodablePart";
import { TubePath } from "../ScenePrimitives";
import { CrossFlowFan, FilterPanel, IndoorAirGrille, VerticalVanes } from "./AirflowGeometry";
import { ControlBox, Fasteners, StepperMotor, WallPlate } from "./DetailGeometry";
import { IndoorHeatExchanger } from "./HeatExchangers";

interface IndoorUnitProps {
  assemblyEnabled: boolean;
  shellOpacity: number;
  fanRef: RefObject<Group | null>;
}

export function IndoorUnit({ assemblyEnabled, shellOpacity, fanRef }: IndoorUnitProps) {
  return (
    <group>
      <ExplodablePart id="ac-indoor-wall-plate" home={[-4.2, 1.0, -1.06]} exploded={[-4.2, 4.7, -2.8]} assemblyEnabled={assemblyEnabled} selectionRadius={2.6}>
        <WallPlate />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-rear-chassis" home={[-4.2, 1.0, -0.78]} exploded={[-4.2, 4.3, -1.45]} assemblyEnabled={assemblyEnabled} selectionRadius={2.8}>
        <RoundedBox args={[5.75, 1.72, 0.42]} radius={0.16} smoothness={4} castShadow>
          <meshPhysicalMaterial color="#d8ded9" roughness={0.42} metalness={0.02} transparent opacity={Math.max(0.22, shellOpacity * 0.72)} depthWrite={false} />
        </RoundedBox>
        <mesh position={[0, -0.55, 0.24]}><boxGeometry args={[5.28, 0.34, 0.38]} /><meshStandardMaterial color="#c9d0cc" roughness={0.43} /></mesh>
        <mesh position={[-1.2, 0.38, 0.24]}><boxGeometry args={[2.7, 0.55, 0.16]} /><meshStandardMaterial color="#c2c9c5" roughness={0.78} /></mesh>
        <mesh position={[1.5, 0.22, 0.24]}><boxGeometry args={[1.15, 0.72, 0.16]} /><meshStandardMaterial color="#c2c9c5" roughness={0.78} /></mesh>
        <Fasteners points={[[-2.5, 0.62, 0.24], [2.5, 0.62, 0.24], [-2.5, -0.6, 0.24], [2.5, -0.6, 0.24]]} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-heat-exchanger" home={[-4.2, 1.23, -0.12]} exploded={[-4.2, 4.05, -0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={2.55}>
        <IndoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-crossflow-fan" home={[-4.28, 0.34, 0.08]} exploded={[-4.28, -2.45, 0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={1.35}>
        <CrossFlowFan fanRef={fanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-fan-motor" home={[-1.52, 0.34, 0.08]} exploded={[0.0, -1.62, 1.05]} assemblyEnabled={assemblyEnabled} selectionRadius={0.62}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.35, 0.35, 0.72, 36]} /><meshStandardMaterial color="#40575c" metalness={0.62} roughness={0.25} /></mesh>
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.45, 20]} /><meshStandardMaterial color="#959f9b" metalness={0.8} roughness={0.18} /></mesh>
        <mesh position={[0.42, 0, 0]}><boxGeometry args={[0.12, 0.55, 0.55]} /><meshStandardMaterial color="#74827e" metalness={0.35} roughness={0.34} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-drain-pan" home={[-4.2, -0.02, 0.16]} exploded={[-4.2, -2.35, 1.32]} assemblyEnabled={assemblyEnabled} selectionRadius={2.3}>
        <mesh castShadow><boxGeometry args={[5.35, 0.26, 1.02]} /><meshPhysicalMaterial color="#92aaa6" roughness={0.4} clearcoat={0.18} /></mesh>
        <mesh position={[2.82, -0.03, -0.15]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 0.68, 20]} /><meshStandardMaterial color="#6f8581" roughness={0.42} /></mesh>
        <mesh position={[0, 0.15, -0.12]}><boxGeometry args={[5.05, 0.08, 0.76]} /><meshStandardMaterial color="#a8bbb7" roughness={0.38} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-vertical-vanes" home={[-4.2, -0.29, 0.64]} exploded={[-4.2, -1.95, 2.32]} assemblyEnabled={assemblyEnabled} selectionRadius={2.25}>
        <VerticalVanes />
        <group position={[2.58, 0.02, -0.18]}><StepperMotor /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-horizontal-louver" home={[-4.2, -0.58, 0.84]} exploded={[-4.2, -2.55, 3.48]} assemblyEnabled={assemblyEnabled} selectionRadius={2.15} rotation={[0.18, 0, 0]}>
        <RoundedBox args={[5.18, 0.14, 0.62]} radius={0.08} smoothness={3} castShadow><meshPhysicalMaterial color="#f2f3ef" roughness={0.36} clearcoat={0.24} /></RoundedBox>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-control-box" home={[-1.55, 1.12, 0.08]} exploded={[0.15, 2.62, 1.38]} assemblyEnabled={assemblyEnabled} selectionRadius={0.85}>
        <ControlBox width={0.94} height={1.02} depth={0.62} />
        <mesh position={[0, -0.62, 0.08]}><boxGeometry args={[0.72, 0.16, 0.42]} /><meshStandardMaterial color="#303f42" metalness={0.28} roughness={0.35} /></mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-sensor-harness" home={[-2.05, 1.58, 0.28]} exploded={[-0.12, 4.05, 1.76]} assemblyEnabled={assemblyEnabled} selectionRadius={0.7}>
        <TubePath points={[[-1.6, 0, 0], [-0.8, 0.22, 0.04], [0.2, -0.08, 0.02], [1.2, 0.18, 0]]} color="#343d3f" radius={0.022} />
        <TubePath points={[[0.2, -0.08, 0.02], [0.75, -0.35, 0.06], [1.65, -0.28, 0.02]]} color="#bd5f46" radius={0.018} />
        {[-1.6, 1.65].map((x) => <mesh key={x} position={[x, x < 0 ? 0 : -0.28, 0]}><sphereGeometry args={[0.09, 16, 12]} /><meshStandardMaterial color="#596a6c" metalness={0.28} roughness={0.34} /></mesh>)}
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-refrigerant-connections" home={[-1.38, 0.68, -0.48]} exploded={[0.88, 0.75, -2.18]} assemblyEnabled={assemblyEnabled} selectionRadius={0.8}>
        <TubePath points={[[0, 0.3, 0], [0.45, 0.1, 0], [0.9, -0.55, 0.05]]} color="#b77b3d" radius={0.065} />
        <TubePath points={[[0.08, 0.5, -0.12], [0.55, 0.25, -0.12], [1.05, -0.45, -0.08]]} color="#b77b3d" radius={0.042} />
        <TubePath points={[[0.08, 0.5, -0.12], [0.55, 0.25, -0.12], [1.05, -0.45, -0.08]]} color="#586765" radius={0.08} />
        <TubePath points={[[0.16, -0.1, 0.18], [0.6, -0.32, 0.18], [1.1, -0.7, 0.22]]} color="#7f9792" radius={0.07} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-fine-filter" home={[-4.2, 1.42, 0.57]} exploded={[-4.2, 3.72, 1.62]} assemblyEnabled={assemblyEnabled} selectionRadius={1.35}>
        <group position={[-1.38, 0, 0]}><FilterPanel width={1.18} height={0.52} color="#93b9c7" /></group>
        <group position={[1.38, 0, 0]}><FilterPanel width={1.18} height={0.52} color="#b8a6c2" /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-filter" home={[-4.2, 1.31, 0.69]} exploded={[-4.2, 3.3, 2.08]} assemblyEnabled={assemblyEnabled} selectionRadius={2.5}>
        <group position={[-1.35, 0, 0]}><FilterPanel width={2.45} height={1.08} /></group>
        <group position={[1.35, 0, 0]}><FilterPanel width={2.45} height={1.08} /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-intake-grille" home={[-4.2, 1.46, 0.81]} exploded={[-4.2, 4.05, 2.84]} assemblyEnabled={assemblyEnabled} selectionRadius={2.65} rotation={[-0.12, 0, 0]}>
        <IndoorAirGrille />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-front-panel" home={[-4.2, 1.0, 1.03]} exploded={[-4.2, 1.78, 4.15]} assemblyEnabled={assemblyEnabled} selectionRadius={2.85}>
        <RoundedBox args={[5.8, 1.62, 0.18]} radius={0.2} smoothness={5} castShadow>
          <meshPhysicalMaterial color="#f3f4f0" roughness={0.28} clearcoat={0.38} clearcoatRoughness={0.3} />
        </RoundedBox>
        <mesh position={[1.7, -0.42, 0.115]}><boxGeometry args={[0.62, 0.13, 0.035]} /><meshPhysicalMaterial color="#1d292b" roughness={0.25} clearcoat={0.2} /></mesh>
        <mesh position={[-1.9, -0.45, 0.115]}><boxGeometry args={[0.45, 0.04, 0.025]} /><meshStandardMaterial color="#5f7d81" metalness={0.28} roughness={0.36} /></mesh>
        <Fasteners points={[[-2.68, 0.65, 0.03], [2.68, 0.65, 0.03], [-2.68, -0.65, 0.03], [2.68, -0.65, 0.03]]} />
      </ExplodablePart>
    </group>
  );
}
