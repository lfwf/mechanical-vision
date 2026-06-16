import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Vector3, type Group, type Material } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import type { FlowPoint } from "./AnimatedFlowParticles";

interface AnimatedFlowLinesProps {
  active: boolean;
  paths: FlowPoint[][];
  color: string;
  lineWidth?: number;
  opacity?: number;
  dashSize?: number;
  gapSize?: number;
  speedMultiplier?: number;
  depthTest?: boolean;
}

type DashMaterial = Material & { dashOffset?: number };

export function AnimatedFlowLines({
  active,
  paths,
  color,
  lineWidth = 1.2,
  opacity = 0.48,
  dashSize = 0.18,
  gapSize = 0.12,
  speedMultiplier = 1,
  depthTest = true,
}: AnimatedFlowLinesProps) {
  const groupRef = useRef<Group>(null);
  const speed = useExperimentStore((state) => state.speed);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const sampledPaths = useMemo(
    () => paths.map((path) => new CatmullRomCurve3(path.map((point) => new Vector3(...point)), false, "centripetal").getPoints(72)),
    [paths],
  );

  useFrame((_, delta) => {
    if (!active || !isPlaying || !groupRef.current) return;
    const offset = delta * (0.55 + speed / 90) * speedMultiplier;
    groupRef.current.traverse((object) => {
      const material = (object as { material?: Material | Material[] }).material;
      const materials = Array.isArray(material) ? material : material ? [material] : [];
      for (const entry of materials) {
        const dashed = entry as DashMaterial;
        if (typeof dashed.dashOffset === "number") dashed.dashOffset -= offset;
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {sampledPaths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={color}
          lineWidth={lineWidth}
          dashed
          dashSize={dashSize}
          gapSize={gapSize}
          transparent
          opacity={opacity}
          depthWrite={false}
          depthTest={depthTest}
          renderOrder={12}
        />
      ))}
    </group>
  );
}
