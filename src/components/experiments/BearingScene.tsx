import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { FlowArrow } from "./ScenePrimitives";

function BearingMechanism() {
  const innerRef = useRef<Group>(null);
  const cageRef = useRef<Group>(null);
  const speed = useExperimentStore((state) => state.speed);
  const load = useExperimentStore((state) => state.primary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const ballCount = 12;

  useFrame((_, delta) => {
    if (!isPlaying) return;
    const visualSpeed = rpmToRadiansPerSecond(speed * direction) * 0.12;
    if (innerRef.current) innerRef.current.rotation.y += visualSpeed * delta;
    if (cageRef.current) cageRef.current.rotation.y += visualSpeed * 0.42 * delta;
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.6, 0.52, 36, 128]} />
        <meshStandardMaterial color="#4e737b" metalness={0.72} roughness={0.2} />
      </mesh>
      <group ref={innerRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[1.25, 0.46, 36, 128]} />
          <meshStandardMaterial color="#c28a3d" metalness={0.75} roughness={0.18} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.82, 0.82, 1.5, 56]} />
          <meshStandardMaterial color="#3f5155" metalness={0.82} roughness={0.17} />
        </mesh>
        <mesh position={[1.25, 0.52, 0]} castShadow>
          <boxGeometry args={[0.28, 0.12, 0.18]} />
          <meshStandardMaterial color="#f3d589" metalness={0.45} roughness={0.24} />
        </mesh>
      </group>

      <group ref={cageRef}>
        {Array.from({ length: ballCount }, (_, index) => {
          const angle = (index * Math.PI * 2) / ballCount;
          const loaded = Math.sin(angle) < -0.25 && load > 0;
          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 1.94, 0, Math.sin(angle) * 1.94]}
              castShadow
            >
              <sphereGeometry args={[0.4, 32, 24]} />
              <meshStandardMaterial
                color={loaded ? "#d36e4e" : "#88aeb5"}
                metalness={0.82}
                roughness={0.16}
                emissive={loaded ? "#733020" : "#000000"}
                emissiveIntensity={loaded ? 0.22 * (load / 100) : 0}
              />
            </mesh>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.94, 0.13, 18, 96]} />
          <meshStandardMaterial
            color="#9b8a5d"
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.72}
          />
        </mesh>
      </group>

      {load > 0 && (
        <FlowArrow
          position={[0, 4.2, 0]}
          rotation={[0, 0, Math.PI]}
          color="#c75f47"
          scale={0.7 + load / 140}
        />
      )}

      <mesh position={[0, -3.15, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.32, 6.2]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-3.4, 1.2, 0]}>外圈</SceneLabel>
      <SceneLabel position={[0, 1.2, 0]}>内圈</SceneLabel>
      <SceneLabel position={[3.1, 1.2, 0]}>钢球与保持架</SceneLabel>
    </group>
  );
}

export default function BearingScene() {
  return (
    <ExperimentCanvas camera={[8, 7.5, 11]} target={[0, 0, 0]} gridY={-3.35} shadowY={-3.3}>
      <BearingMechanism />
    </ExperimentCanvas>
  );
}
