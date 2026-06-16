import type { RefObject } from "react";
import type { Group } from "three";
import { ExplodablePart } from "../ExplodablePart";
import { CrossFlowFan } from "./AirflowGeometry";
import { IndoorFrontPanelCutaway, IndoorRearChassisCutaway } from "./CutawayShellGeometry";
import { WallPlate } from "./DetailGeometry";
import { IndoorHeatExchanger } from "./HeatExchangers";
import {
  IndoorControlAssembly,
  IndoorDrainPan,
  IndoorFanMotor,
  IndoorFilterCassettes,
  IndoorFineFilterModules,
  IndoorHorizontalLouver,
  IndoorIntakeGrille,
  IndoorPipeTerminals,
  IndoorSensorHarness,
  IndoorVerticalVanes,
} from "./IndoorUnitGeometry";

interface IndoorUnitProps {
  assemblyEnabled: boolean;
  shellOpacity: number;
  fanRef: RefObject<Group | null>;
}

export function IndoorUnit({ assemblyEnabled, shellOpacity, fanRef }: IndoorUnitProps) {
  return (
    <group position={[-4.2, 1, 0]}>
      <ExplodablePart id="ac-indoor-wall-plate" home={[0, 0, -1.02]} exploded={[0, 3.8, -2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={2.65}>
        <WallPlate />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-rear-chassis" home={[0, 0, -0.72]} exploded={[0, 3.35, -1.55]} assemblyEnabled={assemblyEnabled} selectionRadius={2.85}>
        <IndoorRearChassisCutaway opacity={shellOpacity} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-heat-exchanger" home={[0, 0.25, -0.1]} exploded={[0, 3.15, -0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={2.65}>
        <IndoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-crossflow-fan" home={[0, -0.48, 0.02]} exploded={[0, -3.05, 0.08]} assemblyEnabled={assemblyEnabled} selectionRadius={1.45}>
        <CrossFlowFan fanRef={fanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-fan-motor" home={[2.58, -0.48, 0.02]} exploded={[3.82, -2.05, 1.02]} assemblyEnabled={assemblyEnabled} selectionRadius={0.64}>
        <IndoorFanMotor />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-drain-pan" home={[0, -0.68, 0.17]} exploded={[0, -2.75, 1.3]} assemblyEnabled={assemblyEnabled} selectionRadius={2.38}>
        <IndoorDrainPan />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-vertical-vanes" home={[0, -0.76, 0.62]} exploded={[0, -2.25, 2.3]} assemblyEnabled={assemblyEnabled} selectionRadius={2.3}>
        <IndoorVerticalVanes />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-horizontal-louver" home={[0, -0.96, 0.88]} exploded={[0, -2.85, 3.42]} assemblyEnabled={assemblyEnabled} selectionRadius={2.2} rotation={[0.16, 0, 0]}>
        <IndoorHorizontalLouver />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-control-box" home={[2.24, 0.26, 0.04]} exploded={[3.82, 1.78, 1.45]} assemblyEnabled={assemblyEnabled} selectionRadius={0.88}>
        <IndoorControlAssembly />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-sensor-harness" home={[0.92, 0.56, 0.22]} exploded={[3.05, 3.02, 1.68]} assemblyEnabled={assemblyEnabled} selectionRadius={0.74}>
        <IndoorSensorHarness />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-refrigerant-connections" home={[2.72, -0.08, -0.48]} exploded={[4.22, -0.18, -1.92]} assemblyEnabled={assemblyEnabled} selectionRadius={0.85}>
        <IndoorPipeTerminals />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-fine-filter" home={[0, 0.64, 0.57]} exploded={[0, 2.72, 1.52]} assemblyEnabled={assemblyEnabled} selectionRadius={1.38}>
        <IndoorFineFilterModules />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-filter" home={[0, 0.54, 0.7]} exploded={[0, 2.32, 2.08]} assemblyEnabled={assemblyEnabled} selectionRadius={2.55}>
        <IndoorFilterCassettes />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-intake-grille" home={[0, 0.82, 0.82]} exploded={[0, 3.35, 2.82]} assemblyEnabled={assemblyEnabled} selectionRadius={2.68} rotation={[-0.14, 0, 0]}>
        <IndoorIntakeGrille />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-front-panel" home={[0, 0.03, 1.02]} exploded={[0, 0.78, 4.18]} assemblyEnabled={assemblyEnabled} selectionRadius={2.9}>
        <IndoorFrontPanelCutaway opacity={shellOpacity} />
      </ExplodablePart>
    </group>
  );
}
