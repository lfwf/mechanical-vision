import { Html } from "@react-three/drei";
import { forwardRef, useEffect, useMemo } from "react";
import type { Group } from "three";
import { createGearGeometry } from "./createGearGeometry";
import { getPitchRadius, getRootRadius } from "../../lib/gearMath";
import type { GearPartId } from "../../types/lab";

interface ProceduralGearProps {
  teeth: number;
  label: string;
  rpmLabel: string;
  partId: Extract<GearPartId, "driver" | "driven">;
  position: [number, number, number];
  selected: boolean;
  showPitchCircle: boolean;
  showLabel: boolean;
  onSelect: (partId: GearPartId) => void;
  materialVariant: "driver" | "driven";
}

export const ProceduralGear = forwardRef<Group, ProceduralGearProps>(
  function ProceduralGear(
    {
      teeth,
      label,
      rpmLabel,
      partId,
      position,
      selected,
      showPitchCircle,
      showLabel,
      onSelect,
      materialVariant,
    },
    ref,
  ) {
    const geometry = useMemo(() => createGearGeometry(teeth), [teeth]);
    const pitchRadius = getPitchRadius(teeth);
    const boreRadius = Math.max(0.18, getRootRadius(teeth) * 0.2);

    useEffect(() => () => geometry.dispose(), [geometry]);

    return (
      <group position={position}>
        <group ref={ref}>
          <mesh
            geometry={geometry}
            castShadow
            receiveShadow
            onClick={(event) => {
              event.stopPropagation();
              onSelect(partId);
            }}
            onPointerEnter={(event) => {
              event.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              document.body.style.cursor = "default";
            }}
          >
            <meshStandardMaterial
              color={materialVariant === "driver" ? "#c9903d" : "#5f8fa2"}
              metalness={0.62}
              roughness={0.28}
              emissive={selected ? "#f3d889" : "#000000"}
              emissiveIntensity={selected ? 0.26 : 0}
            />
          </mesh>

          <mesh castShadow>
            <cylinderGeometry args={[boreRadius * 0.86, boreRadius * 0.86, 0.9, 32]} />
            <meshStandardMaterial color="#39464b" metalness={0.85} roughness={0.2} />
          </mesh>

          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[boreRadius * 1.35, boreRadius * 1.35, 0.18, 32]} />
            <meshStandardMaterial color="#56656a" metalness={0.78} roughness={0.22} />
          </mesh>
        </group>

        {showPitchCircle && (
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
            <ringGeometry args={[pitchRadius - 0.012, pitchRadius + 0.012, 96]} />
            <meshBasicMaterial
              color={materialVariant === "driver" ? "#f6cf7a" : "#9ad4e2"}
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
        )}

        {showLabel && (
          <Html
            center
            position={[0, 1.12, 0]}
            distanceFactor={8}
            style={{ pointerEvents: "none" }}
          >
            <div className={`gear-label gear-label-${materialVariant}`}>
              <strong>{label}</strong>
              <span>{teeth} 齿 · {rpmLabel}</span>
            </div>
          </Html>
        )}
      </group>
    );
  },
);
