import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, Vector3, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { SceneLabel } from "../ExperimentCanvas";
import { TubePath } from "../ScenePrimitives";
import { GAS_LINE_PATH, LIQUID_LINE_PATH } from "./ConnectionBundle";

const STAGE_COLORS = [new Color("#df604b"), new Color("#e5a044"), new Color("#4d9ed0"), new Color("#62c2c4")];
const LIQUID_TO_INDOOR = [...LIQUID_LINE_PATH].reverse();
const PATHS: Array<Array<[number, number, number]>> = [
  [[6.5, 0.6, -0.3], [6.05, 0.82, -0.42], [5.2, 1.02, -0.58], [4.4, 1.1, -0.66]],
  [[4.4, 1.1, -0.66], [4.18, 0.45, -0.72], [4.68, -0.2, -0.68], [5.32, -0.64, -0.58]],
  [[5.32, -0.64, -0.58], [5.9, -0.66, -0.2], ...LIQUID_TO_INDOOR, [-2.55, 0.95, -0.35], [-4.2, 1.25, -0.1]],
  [[-4.2, 1.25, -0.1], [-2.6, 0.9, -0.35], ...GAS_LINE_PATH, [6.25, -0.15, 0.02], [6.5, 0.6, -0.3]],
];

export function CoolingCycle() {
  const speed = useExperimentStore((state) => state.speed);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phaseRef = useRef(0);
  const curves = useMemo(() => PATHS.map((points) => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal")), []);
  const particles = useMemo(() => Array.from({ length: 64 }, (_, index) => index / 64), []);

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
      <TubePath points={PATHS[0]} color="#df604b" radius={0.044} opacity={0.82} />
      <TubePath points={PATHS[1]} color="#e5a044" radius={0.04} opacity={0.82} />
      <TubePath points={PATHS[2]} color="#4d9ed0" radius={0.038} opacity={0.84} />
      <TubePath points={PATHS[3]} color="#62c2c4" radius={0.047} opacity={0.84} />
      {particles.map((_, index) => (
        <mesh key={index} ref={(node) => { particleRefs.current[index] = node; }}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#df604b" emissive="#812b21" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <SceneLabel position={[0.5, 4.15, -0.55]}>压缩 → 室外放热 → 节流 → 室内吸热 → 回气</SceneLabel>
    </>
  );
}
