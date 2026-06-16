import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, Vector3, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { TubePath } from "../ScenePrimitives";

const STAGE_COLORS = [new Color("#df604b"), new Color("#e5a044"), new Color("#4d9ed0"), new Color("#62c2c4")];
const PATHS: Array<Array<[number, number, number]>> = [
  [[5.55, -0.55, -0.1], [5.25, 0.35, -0.15], [4.55, 1.02, -0.48]],
  [[4.55, 1.02, -0.48], [3.3, 1.1, -0.68], [4.72, -0.5, -0.65]],
  [[4.72, -0.5, -0.65], [1.8, -0.82, -0.72], [-1.35, 0.72, -0.48], [-4.2, 1.18, -0.12]],
  [[-4.2, 1.18, -0.12], [-1.5, 0.1, -0.55], [4.7, -0.7, -0.35], [5.55, -0.55, -0.1]],
];

export function CoolingCycle() {
  const speed = useExperimentStore((state) => state.speed);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phaseRef = useRef(0);
  const curves = useMemo(() => PATHS.map((points) => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal")), []);
  const particles = useMemo(() => Array.from({ length: 56 }, (_, index) => index / 56), []);

  useFrame((_, delta) => {
    if (variant !== 0) return;
    if (isPlaying) phaseRef.current += delta * (0.055 + speed / 880);
    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      const progress = (particles[index] + phaseRef.current) % 1;
      const stage = Math.min(3, Math.floor(progress * 4));
      particle.position.copy(curves[stage].getPoint(progress * 4 - stage));
      const material = particle.material as MeshStandardMaterial;
      material.color.copy(STAGE_COLORS[stage]);
      material.emissive.copy(STAGE_COLORS[stage]).multiplyScalar(0.4);
    });
  });

  if (variant !== 0) return null;
  return (
    <>
      <TubePath points={PATHS[0]} color="#df604b" radius={0.058} />
      <TubePath points={PATHS[1]} color="#e5a044" radius={0.052} />
      <TubePath points={PATHS[2]} color="#4d9ed0" radius={0.052} />
      <TubePath points={PATHS[3]} color="#62c2c4" radius={0.065} />
      {particles.map((_, index) => (
        <mesh key={index} ref={(node) => { particleRefs.current[index] = node; }}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#df604b" emissive="#812b21" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <SceneLabel position={[0, 4.2, -0.5]}>压缩 → 室外放热 → 电子膨胀阀节流 → 室内吸热</SceneLabel>
    </>
  );
}
