import { Html } from "@react-three/drei";
import { forwardRef, useEffect, useMemo } from "react";
import type { Group } from "three";
import {
  getBaseRadius,
  getOuterRadius,
  getPitchRadius,
  getRootRadius,
} from "../../lib/gearMath";
import type { GearPartId } from "../../types/lab";
import { createGearGeometry } from "./createGearGeometry";

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

interface ReferenceRingProps {
  radius: number;
  color: string;
  opacity: number;
  lineWidth?: number;
}

function ReferenceRing({
  radius,
  color,
  opacity,
  lineWidth = 0.009,
}: ReferenceRingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.255, 0]}>
      <ringGeometry args={[radius - lineWidth, radius + lineWidth, 160]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
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
    const baseRadius = getBaseRadius(teeth);
    const outerRadius = getOuterRadius(teeth);
    const rootRadius = getRootRadius(teeth);
    const boreRadius = Math.max(0.18, rootRadius * 0.2);

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
              metalness={0.68}
              roughness={0.24}
              emissive={selected ? "#f3d889" : "#000000"}
              emissiveIntensity={selected ? 0.28 : 0}
            />
          </mesh>

          <mesh castShadow>
            <cylinderGeometry args={[boreRadius * 0.86, boreRadius * 0.86, 0.9, 48]} />
            <meshStandardMaterial color="#39464b" metalness={0.88} roughness={0.18} />
          </mesh>

          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[boreRadius * 1.35, boreRadius * 1.35, 0.18, 48]} />
            <meshStandardMaterial color="#56656a" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {showPitchCircle && (
          <group>
            <ReferenceRing radius={rootRadius} color="#bf6d6d" opacity={0.55} />
            <ReferenceRing radius={baseRadius} color="#826da8" opacity={0.68} />
            <ReferenceRing
              radius={pitchRadius}
              color={materialVariant === "driver" ? "#ffe09b" : "#bdeaf2"}
              opacity={0.95}
              lineWidth={0.012}
            />
            <ReferenceRing radius={outerRadius} color="#6d8f74" opacity={0.5} />
          </group>
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
