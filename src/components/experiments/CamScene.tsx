import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { Spring } from "./ScenePrimitives";

const CAM_RADIUS = 1.55;
const FOLLOWER_Y = 0.42;
const GUIDE_TOP_Z = 5.2;

function CamMechanism() {
  const camRef = useRef<Group>(null);
  const followerRef = useRef<Group>(null);
  const rodRef = useRef<Mesh>(null);
  const springRef = useRef<Group>(null);
  const angle = useRef(0);

  const speed = useExperimentStore((state) => state.speed);
  const eccentricity = useExperimentStore((state) => state.primary);
  const rollerRadius = useExperimentStore((state) => state.secondary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);

  useFrame((_, delta) => {
    if (isPlaying) angle.current += rpmToRadiansPerSecond(speed * direction) * delta;
    if (camRef.current) camRef.current.rotation.y = angle.current;

    const centerX = eccentricity * Math.cos(angle.current);
    const centerZ = -eccentricity * Math.sin(angle.current);
    const surfaceZ = centerZ + Math.sqrt(Math.max(CAM_RADIUS ** 2 - centerX ** 2, 0));
    const rollerCenterZ = surfaceZ + rollerRadius;
    const rodTopZ = GUIDE_TOP_Z - 0.5;

    if (followerRef.current) followerRef.current.position.z = rollerCenterZ;
    if (rodRef.current) {
      const rodLength = Math.max(0.5, rodTopZ - rollerCenterZ);
      rodRef.current.position.set(0, FOLLOWER_Y, rollerCenterZ + rodLength / 2);
      rodRef.current.scale.set(1, 1, rodLength);
    }

    if (springRef.current) {
      const springBottom = rollerCenterZ + rollerRadius + 0.5;
      const springTop = GUIDE_TOP_Z - 0.42;
      const springLength = Math.max(0.55, springTop - springBottom);
      springRef.current.position.set(0, FOLLOWER_Y, (springBottom + springTop) / 2);
      springRef.current.scale.set(springLength, 1, 1);
    }
  });

  return (
    <group>
      <RoundedBox args={[6.2, 0.42, 8.2]} radius={0.14} smoothness={5} position={[0, -0.95, 2.0]} receiveShadow castShadow>
        <meshStandardMaterial color="#30494d" metalness={0.3} roughness={0.44} />
      </RoundedBox>

      {[-0.78, 0.78].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <RoundedBox args={[1.15, 0.34, 1.4]} radius={0.1} smoothness={5} position={[0, -0.2, 0]} castShadow>
            <meshStandardMaterial color="#3b555a" metalness={0.4} roughness={0.35} />
          </RoundedBox>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.38, 0.11, 18, 48]} />
            <meshStandardMaterial color="#8b9896" metalness={0.72} roughness={0.2} />
          </mesh>
        </group>
      ))}

      <group ref={camRef}>
        <mesh position={[eccentricity, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[CAM_RADIUS, CAM_RADIUS, 0.54, 112]} />
          <meshStandardMaterial color="#b97d2f" metalness={0.7} roughness={0.23} />
        </mesh>
        <mesh position={[eccentricity, 0.29, 0]} castShadow>
          <torusGeometry args={[CAM_RADIUS - 0.12, 0.06, 16, 96]} />
          <meshStandardMaterial color="#d2a05b" metalness={0.6} roughness={0.22} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.9, 48]} />
          <meshStandardMaterial color="#2d4146" metalness={0.86} roughness={0.16} />
        </mesh>
        <mesh position={[eccentricity, 0.3, 0]} castShadow>
          <boxGeometry args={[0.16, 0.08, 0.46]} />
          <meshStandardMaterial color="#f0ce7c" metalness={0.5} roughness={0.2} />
        </mesh>
      </group>

      <group ref={followerRef} position={[0, 0, CAM_RADIUS + rollerRadius]}>
        <mesh position={[0, FOLLOWER_Y, 0]} castShadow>
          <cylinderGeometry args={[rollerRadius, rollerRadius, 0.66, 56]} />
          <meshStandardMaterial color="#6d99a2" metalness={0.72} roughness={0.21} />
        </mesh>
        <mesh position={[0, FOLLOWER_Y - 0.39, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[rollerRadius + 0.08, 0.055, 16, 48]} />
          <meshStandardMaterial color="#445b60" metalness={0.58} roughness={0.26} />
        </mesh>
        <RoundedBox args={[0.74, 0.22, 0.38]} radius={0.06} smoothness={4} position={[0, FOLLOWER_Y, rollerRadius + 0.22]} castShadow>
          <meshStandardMaterial color="#536d72" metalness={0.58} roughness={0.28} />
        </RoundedBox>
      </group>

      <mesh ref={rodRef} castShadow>
        <boxGeometry args={[0.16, 0.16, 1]} />
        <meshStandardMaterial color="#7c8987" metalness={0.74} roughness={0.22} />
      </mesh>

      <group ref={springRef} rotation={[0, -Math.PI / 2, 0]}>
        <Spring length={1} radius={0.27} turns={8} color="#727e80" />
      </group>

      <RoundedBox args={[1.5, 0.86, 2.8]} radius={0.12} smoothness={5} position={[0, FOLLOWER_Y, 4.02]} castShadow>
        <meshStandardMaterial color="#344e53" metalness={0.38} roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.94, 2.45]} radius={0.08} smoothness={4} position={[0, FOLLOWER_Y, 4.0]}>
        <meshStandardMaterial color="#223b40" metalness={0.28} roughness={0.46} />
      </RoundedBox>
      <mesh position={[0, FOLLOWER_Y, GUIDE_TOP_Z]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.28, 56]} />
        <meshStandardMaterial color="#5e6f72" metalness={0.48} roughness={0.3} />
      </mesh>
      <mesh position={[0, FOLLOWER_Y, GUIDE_TOP_Z - 0.18]}>
        <torusGeometry args={[0.34, 0.055, 16, 48]} />
        <meshStandardMaterial color="#909a98" metalness={0.66} roughness={0.22} />
      </mesh>

      <SceneLabel position={[-2.15, 1.15, 0]}>偏心圆盘凸轮</SceneLabel>
      <SceneLabel position={[1.45, 1.2, 2.25]}>滚子从动件</SceneLabel>
      <SceneLabel position={[1.6, 1.15, 4.55]}>导向套与回位弹簧</SceneLabel>
    </group>
  );
}

export default function CamScene() {
  return (
    <ExperimentCanvas camera={[7.4, 6.1, 11.8]} target={[0, 0.25, 2.1]} gridY={-1.18} shadowY={-1.12} minDistance={7} maxDistance={21}>
      <CamMechanism />
    </ExperimentCanvas>
  );
}
