import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { CatmullRomCurve3, Quaternion, Vector3, type Group } from "three";
import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface SuspensionProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
  tubGroupRef: RefObject<Group | null>;
}

function updateLink(group: Group, start: Vector3, end: Vector3) {
  const direction = end.clone().sub(start);
  const length = Math.max(direction.length(), 0.001);
  group.position.copy(start.clone().add(end).multiplyScalar(0.5));
  group.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize()));
  group.scale.set(1, length, 1);
}

function DynamicDamper({ start, tubAnchor, tubGroupRef }: { start: [number, number, number]; tubAnchor: [number, number, number]; tubGroupRef: RefObject<Group | null> }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const link = ref.current;
    const tub = tubGroupRef.current;
    if (!link || !tub) return;
    updateLink(link, new Vector3(...start), new Vector3(...tubAnchor).add(tub.position));
  });
  return <group ref={ref}><mesh><cylinderGeometry args={[0.12, 0.12, 1, 24]} /><meshStandardMaterial color="#566b70" metalness={0.56} roughness={0.3} /></mesh><mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.18, 0.18, 0.42, 24]} /><meshStandardMaterial color="#41575c" metalness={0.44} roughness={0.34} /></mesh></group>;
}

function DynamicSpring({ start, tubAnchor, tubGroupRef }: { start: [number, number, number]; tubAnchor: [number, number, number]; tubGroupRef: RefObject<Group | null> }) {
  const ref = useRef<Group>(null);
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const turns = 7;
    for (let index = 0; index <= turns * 24; index += 1) {
      const progress = index / (turns * 24);
      const angle = progress * turns * Math.PI * 2;
      points.push(new Vector3(Math.cos(angle) * 0.13, -0.5 + progress, Math.sin(angle) * 0.13));
    }
    return new CatmullRomCurve3(points);
  }, []);
  useFrame(() => {
    const link = ref.current;
    const tub = tubGroupRef.current;
    if (!link || !tub) return;
    updateLink(link, new Vector3(...start), new Vector3(...tubAnchor).add(tub.position));
  });
  return <group ref={ref}><mesh><tubeGeometry args={[curve, 168, 0.026, 8, false]} /><meshStandardMaterial color="#637679" metalness={0.74} roughness={0.22} /></mesh></group>;
}

export function TubMountedSuspensionParts({ mode, assemblyEnabled }: Omit<SuspensionProps, "tubGroupRef">) {
  if (!assemblyEnabled && mode !== WashingMachineMode.SpinSuspension) return null;
  return <group>
    <ExplodablePart id="wm-front-counterweight" home={[0, 0, 1.18]} exploded={[3.85, 0.4, 1.8]} assemblyEnabled={assemblyEnabled} selectionRadius={1.25}><mesh position={[0, 1.05, 0]} castShadow><boxGeometry args={[2.75, 0.58, 0.5]} /><meshStandardMaterial color="#777b76" roughness={0.64} /></mesh><mesh position={[0, -1.05, 0]} castShadow><boxGeometry args={[2.5, 0.5, 0.48]} /><meshStandardMaterial color="#727772" roughness={0.64} /></mesh></ExplodablePart>
    <ExplodablePart id="wm-top-counterweight" home={[0, 1.62, 0]} exploded={[0, 4.05, 0.4]} assemblyEnabled={assemblyEnabled} selectionRadius={1.12}><mesh castShadow><boxGeometry args={[2.35, 0.52, 0.75]} /><meshStandardMaterial color="#737873" roughness={0.64} /></mesh></ExplodablePart>
  </group>;
}

export function SuspensionLinks({ mode, assemblyEnabled, tubGroupRef }: SuspensionProps) {
  if (!assemblyEnabled && mode !== WashingMachineMode.SpinSuspension) return null;
  return <group>
    <ExplodablePart id="wm-left-spring" home={[0, 0, 0]} exploded={[-4.2, 2.7, 0.2]} assemblyEnabled={assemblyEnabled} selectionRadius={0.7}><DynamicSpring start={[-1.35, 2.5, -0.05]} tubAnchor={[-1.12, 1.62, 0]} tubGroupRef={tubGroupRef} /></ExplodablePart>
    <ExplodablePart id="wm-right-spring" home={[0, 0, 0]} exploded={[4.2, 2.7, 0.2]} assemblyEnabled={assemblyEnabled} selectionRadius={0.7}><DynamicSpring start={[1.35, 2.5, -0.05]} tubAnchor={[1.12, 1.62, 0]} tubGroupRef={tubGroupRef} /></ExplodablePart>
    <ExplodablePart id="wm-left-damper" home={[0, 0, 0]} exploded={[-4.2, -1.6, 0.6]} assemblyEnabled={assemblyEnabled} selectionRadius={0.82}><DynamicDamper start={[-1.42, -2.5, 0.65]} tubAnchor={[-1.05, -1.22, 0.12]} tubGroupRef={tubGroupRef} /></ExplodablePart>
    <ExplodablePart id="wm-right-damper" home={[0, 0, 0]} exploded={[4.2, -1.6, 0.6]} assemblyEnabled={assemblyEnabled} selectionRadius={0.82}><DynamicDamper start={[1.42, -2.5, 0.65]} tubAnchor={[1.05, -1.22, 0.12]} tubGroupRef={tubGroupRef} /></ExplodablePart>
  </group>;
}
