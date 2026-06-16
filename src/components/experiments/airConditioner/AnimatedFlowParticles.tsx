import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, Vector3, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";

/** 三维路径控制点，依次对应 x、y、z。 */
export type FlowPoint = [number, number, number];

/**
 * 沿曲线运动的小型示踪粒子。
 *
 * 该组件只用于辅助观察流速和方向，主要通道仍由 AnimatedFlowLines 表达。
 * 粒子数量应保持较少，否则画面会重新变成“珠子串”。
 */
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

  // 使用 ref 直接修改 Three.js Mesh，不通过 React state 更新每一帧位置。
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phaseRef = useRef(0);
  const scratchColor = useRef(new Color());

  const start = useMemo(() => new Color(startColor), [startColor]);
  const end = useMemo(() => new Color(endColor), [endColor]);

  // 把离散控制点转换为平滑曲线。
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

  // 为每条路径预先生成粒子描述。offset 让粒子均匀错开，避免堆在一起。
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

      // getPointAt 使用 0～1 进度取得当前曲线位置。
      particle.position.copy(curves[descriptor.pathIndex].getPointAt(progress));

      // 根据路径进度在起始色和结束色之间插值，例如暖回风逐渐变成冷送风。
      const material = particle.material as MeshStandardMaterial;
      scratchColor.current.lerpColors(start, end, progress);
      material.color.copy(scratchColor.current);
      material.emissive.copy(scratchColor.current).multiplyScalar(0.34);

      // 轻微呼吸缩放让小粒子更容易被看到，但不改变实际流速。
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
