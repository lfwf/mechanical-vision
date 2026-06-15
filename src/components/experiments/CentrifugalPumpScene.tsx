import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { FlowArrow } from "./ScenePrimitives";

const inletColor = new Color("#4aa8d2");
const eyeColor = new Color("#57c5d0");
const impellerColor = new Color("#efaa4c");
const outletColor = new Color("#df6650");

function PumpMechanism() {
  const impellerRef = useRef<Group>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phase = useRef(0);
  const speed = useExperimentStore((state) => state.speed);
  const disassembly = useExperimentStore((state) => state.primary) / 100;
  const casingTransparency = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const particles = useMemo(() => Array.from({ length: 36 }, (_, index) => index / 36), []);
  const exploded = variant === 1 ? disassembly : 0;

  useFrame((_, delta) => {
    if (isPlaying) {
      phase.current += delta * (0.18 + speed / 4200);
      if (impellerRef.current) {
        const visualAngularSpeed = Math.min(Math.abs(rpmToRadiansPerSecond(speed)) * 0.055, 12) * direction;
        impellerRef.current.rotation.x += visualAngularSpeed * delta;
      }
    }

    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      particle.visible = variant === 0;
      if (variant !== 0) return;

      const progress = (particles[index] + phase.current) % 1;
      let color = inletColor;
      if (progress < 0.28) {
        const local = progress / 0.28;
        particle.position.set(-5.3 + local * 5.0, 0, 0);
      } else if (progress < 0.55) {
        const local = (progress - 0.28) / 0.27;
        const radius = 0.18 + local * 1.65;
        const angle = local * Math.PI * 2.1 + index * 0.22;
        particle.position.set(-0.05, Math.cos(angle) * radius, Math.sin(angle) * radius);
        color = local < 0.45 ? eyeColor : impellerColor;
      } else if (progress < 0.82) {
        const local = (progress - 0.55) / 0.27;
        const angle = -Math.PI * 0.15 + local * Math.PI * 1.7;
        const radius = 1.86 + local * 0.28;
        particle.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
        color = impellerColor;
      } else {
        const local = (progress - 0.82) / 0.18;
        particle.position.set(0, 1.9 + local * 3.2, -1.15);
        color = outletColor;
      }
      const material = particle.material as MeshStandardMaterial;
      material.color.copy(color);
      material.emissive.copy(color).multiplyScalar(0.45);
    });
  });

  const casingOpacity = Math.max(0.13, 1 - casingTransparency / 100);

  return (
    <group>
      <group position={[-1.15 * exploded, 0, 0]}>
        <mesh position={[-3.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.72, 0.72, 3.3, 64, 1, true]} />
          <meshPhysicalMaterial color="#6096a5" metalness={0.18} roughness={0.3} transparent opacity={casingOpacity} transmission={0.35} side={2} depthWrite={false} />
        </mesh>
        <mesh position={[-2.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.72, 0.12, 24, 64]} />
          <meshStandardMaterial color="#39565c" metalness={0.55} roughness={0.28} />
        </mesh>
      </group>

      <group ref={impellerRef} position={[0.65 * exploded, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.9, 48]} />
          <meshStandardMaterial color="#3d5055" metalness={0.84} roughness={0.17} />
        </mesh>
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.48, 1.48, 0.13, 72]} />
          <meshStandardMaterial color="#b97f35" metalness={0.68} roughness={0.23} />
        </mesh>
        <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.48, 1.48, 0.13, 72]} />
          <meshStandardMaterial color="#d49b4a" metalness={0.64} roughness={0.24} transparent opacity={0.72} />
        </mesh>
        {Array.from({ length: 7 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 7;
          return (
            <group key={index} rotation={[angle, 0, 0]}>
              <mesh position={[0, 0.82, 0.22]} rotation={[0.15, 0.05, -0.38]} castShadow>
                <boxGeometry args={[0.48, 1.18, 0.17]} />
                <meshStandardMaterial color="#d59a47" metalness={0.66} roughness={0.23} />
              </mesh>
            </group>
          );
        })}
      </group>

      <group position={[0, 0, -1.0 * exploded]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <torusGeometry args={[1.95, 0.52, 36, 140, Math.PI * 1.76]} />
          <meshPhysicalMaterial color="#5f93a0" metalness={0.2} roughness={0.26} transparent opacity={casingOpacity} transmission={Math.min(0.7, casingTransparency / 120)} thickness={0.35} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.72, 1.72, 0.18, 72, 1, true]} />
          <meshStandardMaterial color="#6b939b" metalness={0.22} roughness={0.3} transparent opacity={0.25} side={2} depthWrite={false} />
        </mesh>
      </group>

      <group position={[0, 0.85 * exploded, 0]}>
        <mesh position={[0, 3.35, -1.15]} castShadow>
          <cylinderGeometry args={[0.66, 0.66, 3.0, 64, 1, true]} />
          <meshPhysicalMaterial color="#648f99" metalness={0.2} roughness={0.3} transparent opacity={casingOpacity} transmission={0.32} side={2} depthWrite={false} />
        </mesh>
        <mesh position={[0, 1.85, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.66, 0.12, 24, 64]} />
          <meshStandardMaterial color="#3e585d" metalness={0.55} roughness={0.27} />
        </mesh>
      </group>

      {particles.map((_, index) => (
        <mesh key={index} ref={(node) => { particleRefs.current[index] = node; }}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#4aa8d2" emissive="#2b7e9a" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {variant === 0 && (
        <>
          <FlowArrow position={[-5.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]} color="#4aa8d2" scale={0.75} />
          <FlowArrow position={[0, 4.4, -1.15]} color="#df6650" scale={0.75} />
        </>
      )}

      <mesh position={[0, -2.75, 0]} receiveShadow>
        <boxGeometry args={[12, 0.34, 6.6]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-4.4, 1.0, 0]}>① 低压液体沿轴向进入叶轮眼</SceneLabel>
      <SceneLabel position={[0.3, 1.0, 0]}>② 叶轮旋转对流体做功</SceneLabel>
      <SceneLabel position={[2.6, 1.3, 0.3]}>③ 蜗壳汇集并把部分速度能转为压力能</SceneLabel>
      <SceneLabel position={[0, 5.25, -1.15]}>④ 较高压力从出口排出</SceneLabel>
    </group>
  );
}

export default function CentrifugalPumpScene() {
  return (
    <ExperimentCanvas camera={[10.5, 8.2, 13]} target={[-0.2, 0.7, 0]} gridY={-2.95} shadowY={-2.9} minDistance={8} maxDistance={24}>
      <PumpMechanism />
    </ExperimentCanvas>
  );
}
