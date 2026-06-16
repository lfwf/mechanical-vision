import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Vector3, type Mesh } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import type { FlowPoint } from "./AnimatedFlowParticles";

/**
 * 冷凝水滴动画。
 *
 * 与普通流动粒子不同，水滴的运动进度使用幂函数重新映射：
 * 前半段移动较慢，后半段移动较快，用来近似重力下落的加速效果。
 */
interface AnimatedWaterDropletsProps {
  active: boolean;
  paths: FlowPoint[][];
  countPerPath?: number;
  size?: number;
  speedMultiplier?: number;
  gravityBias?: number;
}

export function AnimatedWaterDroplets({
  active,
  paths,
  countPerPath = 5,
  size = 0.045,
  speedMultiplier = 1,
  gravityBias = 1.55,
}: AnimatedWaterDropletsProps) {
  const speed = useExperimentStore((state) => state.speed);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const refs = useRef<Array<Mesh | null>>([]);
  const phaseRef = useRef(0);

  const curves = useMemo(
    () => paths.map((path) =>
      new CatmullRomCurve3(
        path.map((point) => new Vector3(...point)),
        false,
        "centripetal",
      ),
    ),
    [paths],
  );

  // 每条凝水路径放置若干水滴，并用 offset 错开出现时间。
  const particles = useMemo(
    () => curves.flatMap((_, pathIndex) =>
      Array.from({ length: countPerPath }, (_, particleIndex) => ({
        pathIndex,
        offset: (particleIndex / countPerPath + pathIndex * 0.17) % 1,
      })),
    ),
    [countPerPath, curves],
  );

  useFrame((_, delta) => {
    if (!active) return;
    if (isPlaying) phaseRef.current += delta * (0.045 + speed / 1450) * speedMultiplier;

    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const particle = particles[index];
      const linear = (particle.offset + phaseRef.current) % 1;

      // progress = linear^gravityBias：起步慢、下落末段快。
      const progress = Math.pow(linear, gravityBias);
      mesh.position.copy(curves[particle.pathIndex].getPointAt(progress));

      // 下落过程中把球体纵向拉长，形成水滴外观。
      mesh.scale.set(size * 0.72, size * (1.25 + progress * 0.9), size * 0.72);
      mesh.rotation.z = Math.sin((linear + index * 0.19) * Math.PI * 2) * 0.08;
    });
  });

  if (!active) return null;

  return (
    <>
      {particles.map((particle, index) => (
        <mesh
          key={`${particle.pathIndex}-${index}`}
          ref={(node) => { refs.current[index] = node; }}
          renderOrder={18}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshPhysicalMaterial
            color="#72c7e2"
            emissive="#2f7f9d"
            emissiveIntensity={0.14}
            roughness={0.12}
            metalness={0}
            transmission={0.18}
            thickness={0.2}
            transparent
            opacity={0.88}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}
