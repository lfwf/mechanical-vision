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
        <mesh>
          <sphereGeometry args={[selectionRadius, 24, 18]} />
          <meshBasicMaterial
            color="#f1c35f"
            wireframe
            transparent
            opacity={0.72}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
