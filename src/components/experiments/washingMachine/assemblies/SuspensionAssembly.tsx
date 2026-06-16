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
  group.quaternion.copy(
    new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize()),
  );
  group.scale.set(1, length, 1);
}

function DynamicDamper({
  start,
  tubAnchor,
  tubGroupRef,
}: {
  start: [number, number, number];
  tubAnchor: [number, number, number];
  tubGroupRef: RefObject<Group | null>;
}) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const link = ref.current;
    const tub = tubGroupRef.current;
    if (!link || !tub) return;
    updateLink(link, new Vector3(...start), new Vector3(...tubAnchor).add(tub.position));
  });

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 1, 24]} />
        <meshStandardMaterial color="#5f6f72" metalness={0.52} roughness={0.32} />
      </mesh>
      <mesh position={[0, -0.29, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.4, 24]} />
        <meshStandardMaterial color="#43575b" metalness={0.4} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 24]} />
        <meshStandardMaterial color="#708084" metalness={0.42} roughness={0.34} />
      </mesh>
    </group>
  );
}

function DynamicSpring({
  start,
  tubAnchor,
  tubGroupRef,
}: {
  start: [number, number, number];
  tubAnchor: [number, number, number];
  tubGroupRef: RefObject<Group | null>;
}) {
  const ref = useRef<Group>(null);
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const turns = 7;
    for (let index = 0; index <= turns * 24; index += 1) {
      const progress = index / (turns * 24);
      const angle = progress * turns * Math.PI * 2;
      points.push(
        new Vector3(
          Math.cos(angle) * 0.115,
          -0.5 + progress,
          Math.sin(angle) * 0.115,
        ),
      );
    }
    return new CatmullRomCurve3(points);
  }, []);

  useFrame(() => {
    const link = ref.current;
    const tub = tubGroupRef.current;
    if (!link || !tub) return;
    updateLink(link, new Vector3(...start), new Vector3(...tubAnchor).add(tub.position));
  });

  return (
    <group ref={ref}>
      <mesh>
        <tubeGeometry args={[curve, 168, 0.023, 8, false]} />
        <meshStandardMaterial color="#657476" metalness={0.72} roughness={0.22} />
      </mesh>
    </group>
  );
}

function TubAnchor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.28, 0.18, 0.22]} />
        <meshStandardMaterial color="#6f7f7c" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 0.34, 18]} />
        <meshStandardMaterial color="#899693" metalness={0.56} roughness={0.28} />
      </mesh>
    </group>
  );
}

export function TubMountedSuspensionParts({
  mode,
  assemblyEnabled,
}: Omit<SuspensionProps, "tubGroupRef">) {
  if (!assemblyEnabled && mode !== WashingMachineMode.SpinSuspension) return null;

  return (
    <group>
      <TubAnchor position={[-1.18, 1.55, 0]} />
      <TubAnchor position={[1.18, 1.55, 0]} />
      <TubAnchor position={[-1.06, -1.18, 0.12]} />
      <TubAnchor position={[1.06, -1.18, 0.12]} />

      <ExplodablePart
        id="wm-front-counterweight"
        home={[0, 0, 1.15]}
        exploded={[3.65, 0.35, 1.7]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={1.15}
      >
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[2.55, 0.52, 0.46]} />
          <meshStandardMaterial color="#797a74" roughness={0.72} />
        </mesh>
        <mesh position={[0, -0.98, 0]} castShadow>
          <boxGeometry args={[2.35, 0.46, 0.44]} />
          <meshStandardMaterial color="#74766f" roughness={0.72} />
        </mesh>
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 1.0, 0.28]}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 18]} />
            <meshStandardMaterial color="#8b8d86" metalness={0.38} roughness={0.34} />
          </mesh>
        ))}
      </ExplodablePart>

      <ExplodablePart
        id="wm-top-counterweight"
        home={[0, 1.58, -0.02]}
        exploded={[0, 3.85, 0.3]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={1.0}
      >
        <mesh castShadow>
          <boxGeometry args={[2.15, 0.46, 0.68]} />
          <meshStandardMaterial color="#777973" roughness={0.72} />
        </mesh>
        {[-0.68, 0.68].map((x) => (
          <mesh key={x} position={[x, 0.26, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 18]} />
            <meshStandardMaterial color="#8b8d86" metalness={0.38} roughness={0.34} />
          </mesh>
        ))}
      </ExplodablePart>
    </group>
  );
}

export function SuspensionLinks({
  mode,
  assemblyEnabled,
  tubGroupRef,
}: SuspensionProps) {
  if (!assemblyEnabled && mode !== WashingMachineMode.SpinSuspension) return null;

  return (
    <group>
      <ExplodablePart
        id="wm-left-spring"
        home={[0, 0, 0]}
        exploded={[-3.85, 2.65, 0.1]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={0.58}
      >
        <DynamicSpring
          start={[-1.35, 2.48, -0.05]}
          tubAnchor={[-1.18, 1.55, 0]}
          tubGroupRef={tubGroupRef}
        />
      </ExplodablePart>
      <ExplodablePart
        id="wm-right-spring"
        home={[0, 0, 0]}
        exploded={[3.85, 2.65, 0.1]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={0.58}
      >
        <DynamicSpring
          start={[1.35, 2.48, -0.05]}
          tubAnchor={[1.18, 1.55, 0]}
          tubGroupRef={tubGroupRef}
        />
      </ExplodablePart>
      <ExplodablePart
        id="wm-left-damper"
        home={[0, 0, 0]}
        exploded={[-3.9, -1.55, 0.5]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={0.65}
      >
        <DynamicDamper
          start={[-1.5, -2.48, 0.72]}
          tubAnchor={[-1.06, -1.18, 0.12]}
          tubGroupRef={tubGroupRef}
        />
      </ExplodablePart>
      <ExplodablePart
        id="wm-right-damper"
        home={[0, 0, 0]}
        exploded={[3.9, -1.55, 0.5]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={0.65}
      >
        <DynamicDamper
          start={[1.5, -2.48, 0.72]}
          tubAnchor={[1.06, -1.18, 0.12]}
          tubGroupRef={tubGroupRef}
        />
      </ExplodablePart>
    </group>
  );
}
