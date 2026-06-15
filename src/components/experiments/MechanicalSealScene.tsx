import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { Spring } from "./ScenePrimitives";

function MechanicalSealMechanism() {
  const rotatingRef = useRef<Group>(null);
  const speed = useExperimentStore((state) => state.speed);
  const exploded = useExperimentStore((state) => state.primary) / 100;
  const transparency = useExperimentStore((state) => state.secondary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const opacity = Math.max(0.12, 1 - transparency / 100);

  useFrame((_, delta) => {
    if (isPlaying && rotatingRef.current) {
      rotatingRef.current.rotation.x +=
        rpmToRadiansPerSecond(speed * direction) * delta * 0.12;
    }
  });

  const rotaryX = -0.2 - exploded * 0.65;
  const stationaryX = 0.2 + exploded * 0.65;

  return (
    <group rotation={[0, 0, 0]}>
      <group ref={rotatingRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 7.5, 56]} />
          <meshStandardMaterial color="#46585c" metalness={0.82} roughness={0.18} />
        </mesh>
        <mesh position={[-1.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.82, 0.82, 1.5, 56]} />
          <meshStandardMaterial color="#6f8588" metalness={0.68} roughness={0.22} />
        </mesh>
        <mesh position={[rotaryX, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.25, 1.25, 0.48, 64]} />
          <meshStandardMaterial color="#c58b3c" metalness={0.5} roughness={0.22} />
        </mesh>
        <mesh position={[rotaryX + 0.27, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.82, 0.12, 24, 72]} />
          <meshStandardMaterial color="#324c50" metalness={0.2} roughness={0.5} />
        </mesh>
      </group>

      <mesh position={[stationaryX, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.28, 1.28, 0.5, 64]} />
        <meshStandardMaterial color="#6c9ca4" metalness={0.42} roughness={0.23} />
      </mesh>
      <mesh position={[stationaryX + 0.32, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.84, 0.12, 24, 72]} />
        <meshStandardMaterial color="#344d51" metalness={0.2} roughness={0.5} />
      </mesh>

      <Spring
        length={1.4 + exploded * 0.8}
        radius={0.72}
        turns={7}
        position={[-1.25 - exploded * 0.25, 0, 0]}
      />

      <mesh position={[1.85, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.7, 1.7, 2.5, 72, 1, true]} />
        <meshPhysicalMaterial
          color="#5f8f9a"
          metalness={0.2}
          roughness={0.3}
          transparent
          opacity={opacity}
          transmission={Math.min(0.7, transparency / 120)}
          side={2}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[3.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.55, 0.18, 28, 80]} />
        <meshStandardMaterial color="#41595d" metalness={0.55} roughness={0.27} />
      </mesh>

      <mesh position={[0, -2.05, 0]} receiveShadow>
        <boxGeometry args={[9.2, 0.34, 5.2]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-1.4, 1.8, 0]}>动环 · 随轴旋转</SceneLabel>
      <SceneLabel position={[0.9, 1.8, 0]}>静环 · 固定</SceneLabel>
      <SceneLabel position={[2.7, 2.25, 0]}>介质侧腔体</SceneLabel>
    </group>
  );
}

export default function MechanicalSealScene() {
  return (
    <ExperimentCanvas camera={[10, 6.5, 10]} target={[0.3, 0, 0]} gridY={-2.3} shadowY={-2.25}>
      <MechanicalSealMechanism />
    </ExperimentCanvas>
  );
}
