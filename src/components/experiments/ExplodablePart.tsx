import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type PropsWithChildren } from "react";
import { MathUtils, type Group } from "three";
import { useExperimentStore } from "../../store/useExperimentStore";

interface ExplodablePartProps extends PropsWithChildren {
  id: string;
  home: [number, number, number];
  exploded: [number, number, number];
  assemblyEnabled: boolean;
  selectionRadius?: number;
  rotation?: [number, number, number];
}

export function ExplodablePart({
  id,
  home,
  exploded,
  assemblyEnabled,
  selectionRadius = 0.55,
  rotation = [0, 0, 0],
  children,
}: ExplodablePartProps) {
  const groupRef = useRef<Group>(null);
  const selectedPartId = useExperimentStore((state) => state.selectedPartId);
  const detached = useExperimentStore((state) => state.detachedPartIds.includes(id));
  const selectPart = useExperimentStore((state) => state.selectPart);
  const target = assemblyEnabled && detached ? exploded : home;
  const selected = selectedPartId === id;
  const indicatorRadius = Math.min(Math.max(selectionRadius * 0.58, 0.24), 1.15);
  const indicatorTube = Math.min(Math.max(indicatorRadius * 0.018, 0.01), 0.024);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.position.set(...target);
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const step = Math.min(delta, 0.05);
    group.position.x = MathUtils.damp(group.position.x, target[0], 10, step);
    group.position.y = MathUtils.damp(group.position.y, target[1], 10, step);
    group.position.z = MathUtils.damp(group.position.z, target[2], 10, step);
  });

  return (
    <group
      ref={groupRef}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        selectPart(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {children}
      {selected && (
        <group renderOrder={30}>
          <mesh>
            <torusGeometry args={[indicatorRadius, indicatorTube, 10, 64]} />
            <meshBasicMaterial color="#55c2cd" transparent opacity={0.72} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[indicatorRadius, indicatorTube, 10, 64]} />
            <meshBasicMaterial color="#55c2cd" transparent opacity={0.42} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[indicatorRadius * 0.06, 16, 12]} />
            <meshBasicMaterial color="#b9f1f5" transparent opacity={0.9} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}
