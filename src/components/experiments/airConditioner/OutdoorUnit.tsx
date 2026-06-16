import type { RefObject } from "react";
import type { Group } from "three";
import { ExplodablePart } from "../ExplodablePart";
import { TubePath } from "../ScenePrimitives";
import { OutdoorCabinetPanelsCutaway } from "./CutawayShellGeometry";
import { Accumulator, FourWayValve, ServiceValves } from "./DetailGeometry";
import { OutdoorHeatExchanger } from "./HeatExchangers";
import { RealisticAxialFan, RealisticFrontGrille } from "./OutdoorAirflowGeometry";
import {
  OutdoorBasePan,
  OutdoorCompressor,
  OutdoorControlAssembly,
  OutdoorFanMotorAssembly,
  OutdoorMountingFeet,
  OutdoorValvePiping,
} from "./OutdoorUnitGeometry";

interface OutdoorUnitProps {
  assemblyEnabled: boolean;
  shellOpacity: number;
  fanRef: RefObject<Group | null>;
}

export function OutdoorUnit({ assemblyEnabled, shellOpacity, fanRef }: OutdoorUnitProps) {
  return (
    <group position={[4.4, 0, 0]}>
      <ExplodablePart id="ac-outdoor-mounting-feet" home={[0, -1.82, 0]} exploded={[0, -4.15, 1.1]} assemblyEnabled={assemblyEnabled} selectionRadius={1.9}>
        <OutdoorMountingFeet />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-base-frame" home={[0, -1.56, 0]} exploded={[0, -3.2, -0.4]} assemblyEnabled={assemblyEnabled} selectionRadius={2.4}>
        <OutdoorBasePan />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-condenser" home={[0, 0.04, -0.08]} exploded={[-0.15, 2.75, -2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={2.5}>
        <OutdoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-compressor" home={[1.38, -0.58, -0.12]} exploded={[3.55, -1.45, -0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.95}>
        <OutdoorCompressor />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-four-way-valve" home={[1.08, 0.34, -0.22]} exploded={[3.18, 0.8, -1.65]} assemblyEnabled={assemblyEnabled} selectionRadius={0.9}>
        <group scale={0.88}>
          <FourWayValve />
          <group position={[-0.78, -0.52, -0.08]} scale={0.84}><Accumulator /></group>
          <OutdoorValvePiping />
        </group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-expansion-valve" home={[0.92, -0.64, -0.58]} exploded={[2.98, -0.55, -2.2]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
        <group scale={0.86}>
          <mesh castShadow><cylinderGeometry args={[0.15, 0.19, 0.48, 28]} /><meshStandardMaterial color="#b47a35" metalness={0.76} roughness={0.2} /></mesh>
          <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.18, 0.18, 0.22, 24]} /><meshStandardMaterial color="#34494d" metalness={0.55} roughness={0.27} /></mesh>
          <TubePath points={[[0, -0.25, 0], [0.2, -0.44, 0.03], [0.48, -0.54, 0.02]]} color="#b66f2f" radius={0.038} />
        </group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-service-valves" home={[2.25, -0.78, 0.28]} exploded={[3.72, -1.35, 1.72]} assemblyEnabled={assemblyEnabled} selectionRadius={0.75}>
        <group scale={0.62} rotation={[0, 0, Math.PI / 2]}><ServiceValves /></group>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-fan-motor" home={[-0.72, 0.02, -0.02]} exploded={[-2.12, 1.7, 1.72]} assemblyEnabled={assemblyEnabled} selectionRadius={1.45}>
        <OutdoorFanMotorAssembly />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-axial-fan" home={[-0.72, 0.02, 0.55]} exploded={[-2.75, 0.15, 2.72]} assemblyEnabled={assemblyEnabled} selectionRadius={1.35}>
        <RealisticAxialFan fanRef={fanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-front-grille" home={[-0.72, 0.02, 0.93]} exploded={[-3.65, 0.02, 3.82]} assemblyEnabled={assemblyEnabled} selectionRadius={1.7}>
        <RealisticFrontGrille />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-control-box" home={[1.4, 0.93, -0.05]} exploded={[3.42, 2.72, 1.28]} assemblyEnabled={assemblyEnabled} selectionRadius={1.0}>
        <OutdoorControlAssembly />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-cabinet-panels" home={[0, 0.02, 0]} exploded={[2.72, 3.62, 2.62]} assemblyEnabled={assemblyEnabled} selectionRadius={2.8}>
        <OutdoorCabinetPanelsCutaway opacity={shellOpacity} />
      </ExplodablePart>
    </group>
  );
}
