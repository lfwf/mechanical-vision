import { RoundedBox } from "@react-three/drei";
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

  return (
    <group ref={ref}>
      <mesh><cylinderGeometry args={[0.075, 0.075, 1, 24]} /><meshStandardMaterial color="#87918f" metalness={0.68} roughness={0.24} /></mesh>
      <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.16, 0.16, 0.5, 28]} /><meshStandardMaterial color="#43575b" metalness={0.38} roughness={0.38} /></mesh>
      <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.12, 0.12, 0.28, 24]} /><meshStandardMaterial color="#607276" metalness={0.48} roughness={0.3} /></mesh>
      {[-0.5, 0.5].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.035, 12, 28]} />
          <meshStandardMaterial color="#4c5d61" metalness={0.46} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function DynamicSpring({ start, tubAnchor, tubGroupRef }: { start: [number, number, number]; tubAnchor: [number, number, number]; tubGroupRef: RefObject<Group | null> }) {
  const ref = useRef<Group>(null);
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const turns = 7;
    for (let index = 0; index <= turns * 24; index += 1) {
      const progress = index / (turns * 24);
      const angle = progress * turns * Math.PI * 2;
      points.push(new Vector3(Math.cos(angle) * 0.11, -0.5 + progress, Math.sin(angle) * 0.11));
    }
    return new CatmullRomCurve3(points);
  }, []);

  useFrame(() => {
    const link = ref.current;
    const tub = tubGroupRef.current;
    if (!link || !tub) return;
    updateLink(link, new Vector3(...start), new Vector3(...tubAnchor).add(tub.position));
  });

  return <group ref={ref}><mesh><tubeGeometry args={[curve, 168, 0.021, 8, false]} /><meshStandardMaterial color="#626f71" metalness={0.78} roughness={0.2} /></mesh></group>;
}

function TubAnchor({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.34, 0.18, 0.3]} radius={0.045} smoothness={4} castShadow><meshStandardMaterial color="#687774" roughness={0.46} /></RoundedBox>
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.09, 0.035, 12, 28]} /><meshStandardMaterial color="#899693" metalness={0.58} roughness={0.27} /></mesh>
    </group>
  );
}

function CabinetAnchor({ position, lower = false }: { position: [number, number, number]; lower?: boolean }) {
  return (
    <group position={position}>
      <RoundedBox args={lower ? [0.52, 0.16, 0.48] : [0.42, 0.18, 0.34]} radius={0.045} smoothness={4} castShadow>
        <meshStandardMaterial color="#75817f" metalness={0.42} roughness={0.34} />
      </RoundedBox>
      <mesh position={[0, lower ? 0.11 : -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.032, 12, 28]} /><meshStandardMaterial color="#9aa4a1" metalness={0.64} roughness={0.24} /></mesh>
    </group>
  );
}

export function TubMountedSuspensionParts({ mode, assemblyEnabled }: Omit<SuspensionProps, "tubGroupRef">) {
  if (!assemblyEnabled && mode !== WashingMachineMode.SpinSuspension) return null;

  return (
    <group>
      <TubAnchor position={[-1.18, 1.55, 0]} />
      <TubAnchor position={[1.18, 1.55, 0]} />
      <TubAnchor position={[-1.06, -1.18, 0.12]} rotation={[0, 0, 0.28]} />
      <TubAnchor position={[1.06, -1.18, 0.12]} rotation={[0, 0, -0.28]} />

      <ExplodablePart id="wm-front-counterweight" home={[0, 0, 1.16]} exploded={[3.45, 0.32, 1.72]} assemblyEnabled={assemblyEnabled} selectionRadius={1.05}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.16]} castShadow>
          <torusGeometry args={[1.42, 0.27, 20, 72, Math.PI * 0.68]} />
          <meshStandardMaterial color="#74766f" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI * 1.16]} castShadow>
          <torusGeometry args={[1.42, 0.24, 20, 72, Math.PI * 0.68]} />
          <meshStandardMaterial color="#797a74" roughness={0.78} />
        </mesh>
        {[-0.9, 0.9].map((x) => (
          <mesh key={x} position={[x, 0.92, 0.16]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.075, 0.075, 0.14, 18]} /><meshStandardMaterial color="#90928b" metalness={0.42} roughness={0.32} /></mesh>
        ))}
      </ExplodablePart>

      <ExplodablePart id="wm-top-counterweight" home={[0, 1.6, -0.08]} exploded={[0, 3.72, 0.24]} assemblyEnabled={assemblyEnabled} selectionRadius={0.9}>
        <RoundedBox args={[2.05, 0.5, 0.72]} radius={0.1} smoothness={5} castShadow><meshStandardMaterial color="#777973" roughness={0.76} /></RoundedBox>
        {[-0.62, 0.62].map((x) => (
          <mesh key={x} position={[x, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.12, 18]} /><meshStandardMaterial color="#8f918a" metalness={0.4} roughness={0.32} /></mesh>
        ))}
      </ExplodablePart>
    </group>
  );
}

export function SuspensionLinks({ mode, assemblyEnabled, tubGroupRef }: SuspensionProps) {
  if (!assemblyEnabled && mode !== WashingMachineMode.SpinSuspension) return null;

  return (
    <group>
      <CabinetAnchor position={[-1.35, 2.42, -0.05]} />
      <CabinetAnchor position={[1.35, 2.42, -0.05]} />
      <CabinetAnchor position={[-1.5, -2.38, 0.72]} lower />
      <CabinetAnchor position={[1.5, -2.38, 0.72]} lower />

      <ExplodablePart id="wm-left-spring" home={[0, 0, 0]} exploded={[-3.7, 2.55, 0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.52}>
        <DynamicSpring start={[-1.35, 2.42, -0.05]} tubAnchor={[-1.18, 1.55, 0]} tubGroupRef={tubGroupRef} />
      </ExplodablePart>
      <ExplodablePart id="wm-right-spring" home={[0, 0, 0]} exploded={[3.7, 2.55, 0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.52}>
        <DynamicSpring start={[1.35, 2.42, -0.05]} tubAnchor={[1.18, 1.55, 0]} tubGroupRef={tubGroupRef} />
      </ExplodablePart>
      <ExplodablePart id="wm-left-damper" home={[0, 0, 0]} exploded={[-3.7, -1.5, 0.5]} assemblyEnabled={assemblyEnabled} selectionRadius={0.58}>
        <DynamicDamper start={[-1.5, -2.38, 0.72]} tubAnchor={[-1.06, -1.18, 0.12]} tubGroupRef={tubGroupRef} />
      </ExplodablePart>
      <ExplodablePart id="wm-right-damper" home={[0, 0, 0]} exploded={[3.7, -1.5, 0.5]} assemblyEnabled={assemblyEnabled} selectionRadius={0.58}>
        <DynamicDamper start={[1.5, -2.38, 0.72]} tubAnchor={[1.06, -1.18, 0.12]} tubGroupRef={tubGroupRef} />
      </ExplodablePart>
    </group>
  );
}
