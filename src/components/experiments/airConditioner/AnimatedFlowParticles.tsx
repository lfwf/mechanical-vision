import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, Vector3, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";

export type FlowPoint = [number, number, number];

interface AnimatedFlowParticlesProps {
  active: boolean;
  paths: FlowPoint[][];
  startColor: string;
  endColor: string;
  countPerPath?: number;
  size?: number;
  speedMultiplier?: number;
  opacity?: number;
  depthTest?: boolean;
  reverse?: boolean;
}

export function AnimatedFlowParticles({
  active,
  paths,
  startColor,
  endColor,
  countPerPath = 10,
  size = 0.055,
  speedMultiplier = 1,
  opacity = 0.92,
  depthTest = false,
  reverse = false,
}: AnimatedFlowParticlesProps) {
  const speed = useExperimentStore((state) => state.speed);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phaseRef = useRef(0);
  const scratchColor = useRef(new Color());
  const start = useMemo(() => new Color(startColor), [startColor]);
  const end = useMemo(() => new Color(endColor), [endColor]);
  const curves = useMemo(
    () => paths.map((path) => new CatmullRomCurve3(path.map((point) => new Vector3(...point)), false, "centripetal")),
    [paths],
  );
  const particles = useMemo(
    () => curves.flatMap((_, pathIndex) =>
      Array.from({ length: countPerPath }, (_, particleIndex) => ({
        pathIndex,
        offset: (particleIndex / countPerPath + pathIndex * 0.13) % 1,
      })),
    ),
    [countPerPath, curves],
  );

  useFrame((_, delta) => {
    if (!active) return;
    if (isPlaying) phaseRef.current += delta * (0.07 + speed / 950) * speedMultiplier;

    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      const descriptor = particles[index];
      const rawProgress = (descriptor.offset + phaseRef.current) % 1;
      const progress = reverse ? 1 - rawProgress : rawProgress;
      particle.position.copy(curves[descriptor.pathIndex].getPointAt(progress));
      const material = particle.material as MeshStandardMaterial;
      scratchColor.current.lerpColors(start, end, progress);
      material.color.copy(scratchColor.current);
      material.emissive.copy(scratchColor.current).multiplyScalar(0.34);
      const pulse = 0.88 + Math.sin((rawProgress + index * 0.11) * Math.PI * 2) * 0.12;
      particle.scale.setScalar(pulse);
    });
  });

  if (!active) return null;

  return (
    <>
      {particles.map((particle, index) => (
        <mesh
          key={`${particle.pathIndex}-${index}`}
          ref={(node) => { particleRefs.current[index] = node; }}
          renderOrder={20}
        >
          <sphereGeometry args={[size, 14, 12]} />
          <meshStandardMaterial
            color={startColor}
            emissive={startColor}
            emissiveIntensity={0.34}
            transparent
            opacity={opacity}
            depthWrite={false}
            depthTest={depthTest}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}
