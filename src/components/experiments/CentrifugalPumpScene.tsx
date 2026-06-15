import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";

function PumpMechanism() {
  const impellerRef = useRef<Group>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phase = useRef(0);
  const speed = useExperimentStore((state) => state.speed);
  const flowSpeed = useExperimentStore((state) => state.primary);
  const casingTransparency = useExperimentStore((state) => state.secondary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const particles = useMemo(() => Array.from({ length: 28 }, (_, index) => index / 28), []);

  useFrame((_, delta) => {
    if (isPlaying) {
      phase.current += delta * (0.18 + flowSpeed / 90);
      if (impellerRef.current) {
        impellerRef.current.rotation.y +=
          rpmToRadiansPerSecond(speed * direction) * delta * 0.08;
      }
    }

    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      const progress = (particles[index] + phase.current) % 1;
      if (progress < 0.32) {
        const local = progress / 0.32;
        particle.position.set(0, 3.8 - local * 3.8, 0);
      } else if (progress < 0.76) {
        const local = (progress - 0.32) / 0.44;
        const radius = 0.2 + local * 2.2;
        const angle = local * Math.PI * 2.2 + index * 0.7;
        particle.position.set(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        );
      } else {
        const local = (progress - 0.76) / 0.24;
        particle.position.set(2.1 + local * 3.1, 0, 1.25);
      }
    });
  });

  const casingOpacity = Math.max(0.12, 1 - casingTransparency / 100);

  return (
    <group>
      <group ref={impellerRef}>
        <mesh castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.72, 48]} />
          <meshStandardMaterial color="#b77f34" metalness={0.7} roughness={0.23} />
        </mesh>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 8;
          return (
            <group key={index} rotation={[0, -angle, 0]}>
              <mesh position={[1.15, 0, 0.25]} rotation={[0, -0.42, 0]} castShadow>
                <boxGeometry args={[1.7, 0.38, 0.22]} />
                <meshStandardMaterial color="#d09a4c" metalness={0.66} roughness={0.24} />
              </mesh>
            </group>
          );
        })}
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 3.4, 36]} />
          <meshStandardMaterial color="#384b50" metalness={0.84} roughness={0.18} />
        </mesh>
      </group>

      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.2, 0.48, 32, 120]} />
        <meshPhysicalMaterial
          color="#5e92a1"
          metalness={0.25}
          roughness={0.25}
          transparent
          opacity={casingOpacity}
          transmission={Math.min(0.72, casingTransparency / 120)}
          thickness={0.35}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.82, 4.7, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#6c99a4"
          metalness={0.2}
          roughness={0.3}
          transparent
          opacity={casingOpacity}
          transmission={Math.min(0.65, casingTransparency / 130)}
          side={2}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[3.55, 0, 1.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 3.2, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#6c99a4"
          metalness={0.2}
          roughness={0.3}
          transparent
          opacity={casingOpacity}
          transmission={Math.min(0.65, casingTransparency / 130)}
          side={2}
          depthWrite={false}
        />
      </mesh>

      {particles.map((_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color="#56b6d2"
            emissive="#2f8ca7"
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.72, 0]} receiveShadow>
        <boxGeometry args={[6.6, 0.32, 5.8]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-2.6, 1.3, 0]}>叶轮</SceneLabel>
      <SceneLabel position={[0, 4.9, 0]}>入口 · 轴向吸入</SceneLabel>
      <SceneLabel position={[5.2, 1.05, 1.25]}>出口 · 汇集排出</SceneLabel>
    </group>
  );
}

export default function CentrifugalPumpScene() {
  return (
    <ExperimentCanvas camera={[9, 7.5, 11.5]} target={[0.8, 0.8, 0.4]} gridY={-0.92} shadowY={-0.88}>
      <PumpMechanism />
    </ExperimentCanvas>
  );
}
