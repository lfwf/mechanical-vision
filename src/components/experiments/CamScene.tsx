import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { Spring } from "./ScenePrimitives";

function CamMechanism() {
  const camRef = useRef<Group>(null);
  const followerRef = useRef<Group>(null);
  const angle = useRef(0);
  const speed = useExperimentStore((state) => state.speed);
  const eccentricity = useExperimentStore((state) => state.primary);
  const rollerRadius = useExperimentStore((state) => state.secondary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const camRadius = 1.65;

  useFrame((_, delta) => {
    if (isPlaying) {
      angle.current += rpmToRadiansPerSecond(speed * direction) * delta;
    }
    if (camRef.current) camRef.current.rotation.y = angle.current;

    const centerX = eccentricity * Math.cos(angle.current);
    const centerZ = -eccentricity * Math.sin(angle.current);
    const surfaceZ = centerZ + Math.sqrt(Math.max(camRadius ** 2 - centerX ** 2, 0));
    if (followerRef.current) followerRef.current.position.z = surfaceZ + rollerRadius;
  });

  return (
    <group>
      <group ref={camRef}>
        <mesh position={[eccentricity, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[camRadius, camRadius, 0.48, 96]} />
          <meshStandardMaterial color="#c58b3c" metalness={0.68} roughness={0.24} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 40]} />
          <meshStandardMaterial color="#3c4d51" metalness={0.84} roughness={0.18} />
        </mesh>
      </group>

      <group ref={followerRef} position={[0, 0, camRadius + rollerRadius]}>
        <mesh castShadow>
          <cylinderGeometry args={[rollerRadius, rollerRadius, 0.62, 48]} />
          <meshStandardMaterial color="#67949e" metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 1.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 2.5, 32]} />
          <meshStandardMaterial color="#52676b" metalness={0.7} roughness={0.24} />
        </mesh>
        <Spring
          length={1.35}
          radius={0.3}
          turns={6}
          position={[0, 0, 2.85]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>

      <mesh position={[0, 0, 3.9]}>
        <boxGeometry args={[1.15, 1.1, 0.85]} />
        <meshStandardMaterial color="#354d51" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0, -0.72, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.32, 4.4]} />
        <meshStandardMaterial color="#334a4e" metalness={0.34} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-2.2, 1.1, 0]}>偏心圆盘凸轮</SceneLabel>
      <SceneLabel position={[1.5, 1.1, 3.4]}>滚子从动件</SceneLabel>
    </group>
  );
}

export default function CamScene() {
  return (
    <ExperimentCanvas camera={[7.5, 6.5, 11.5]} target={[0, 0, 1.4]} gridY={-0.92} shadowY={-0.88}>
      <CamMechanism />
    </ExperimentCanvas>
  );
}
