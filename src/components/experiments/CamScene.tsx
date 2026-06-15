import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { Spring } from "./ScenePrimitives";

const CAM_RADIUS = 1.55;
const FOLLOWER_Y = 0.4;
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
    const rodTopZ = GUIDE_TOP_Z - 0.45;

    if (followerRef.current) followerRef.current.position.z = rollerCenterZ;
    if (rodRef.current) {
      const rodLength = Math.max(0.5, rodTopZ - rollerCenterZ);
      rodRef.current.position.set(0, FOLLOWER_Y, rollerCenterZ + rodLength / 2);
      rodRef.current.scale.set(1, 1, rodLength);
    }

    if (springRef.current) {
      const springBottom = rollerCenterZ + rollerRadius + 0.48;
      const springTop = GUIDE_TOP_Z - 0.35;
      const springLength = Math.max(0.55, springTop - springBottom);
      springRef.current.position.set(0, FOLLOWER_Y, (springBottom + springTop) / 2);
      springRef.current.scale.set(springLength, 1, 1);
    }
  });

  return (
    <group>
      <group ref={camRef}>
        <mesh position={[eccentricity, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[CAM_RADIUS, CAM_RADIUS, 0.5, 96]} />
          <meshStandardMaterial color="#c58b3c" metalness={0.68} roughness={0.24} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.32, 1.1, 44]} />
          <meshStandardMaterial color="#3c4d51" metalness={0.84} roughness={0.18} />
        </mesh>
        <mesh position={[eccentricity, 0.28, 0]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.5]} />
          <meshStandardMaterial color="#f3d58b" metalness={0.5} roughness={0.2} />
        </mesh>
      </group>

      <group ref={followerRef} position={[0, 0, CAM_RADIUS + rollerRadius]}>
        <mesh position={[0, FOLLOWER_Y, 0]} castShadow>
          <cylinderGeometry args={[rollerRadius, rollerRadius, 0.72, 52]} />
          <meshStandardMaterial color="#67949e" metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, FOLLOWER_Y, rollerRadius + 0.25]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.16, 40]} />
          <meshStandardMaterial color="#4d666a" metalness={0.62} roughness={0.27} />
        </mesh>
      </group>

      <mesh ref={rodRef} castShadow>
        <boxGeometry args={[0.18, 0.18, 1]} />
        <meshStandardMaterial color="#50676b" metalness={0.72} roughness={0.23} />
      </mesh>

      <group ref={springRef} rotation={[0, -Math.PI / 2, 0]}>
        <Spring length={1} radius={0.29} turns={7} color="#6a777a" />
      </group>

      <mesh position={[-0.52, FOLLOWER_Y, 4.05]} castShadow>
        <boxGeometry args={[0.18, 0.8, 2.25]} />
        <meshStandardMaterial color="#354d51" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0.52, FOLLOWER_Y, 4.05]} castShadow>
        <boxGeometry args={[0.18, 0.8, 2.25]} />
        <meshStandardMaterial color="#354d51" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[0, FOLLOWER_Y, GUIDE_TOP_Z]} castShadow>
        <boxGeometry args={[1.55, 0.9, 0.35]} />
        <meshStandardMaterial color="#30494d" metalness={0.38} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.75, 1.9]} receiveShadow>
        <boxGeometry args={[5.8, 0.32, 7.8]} />
        <meshStandardMaterial color="#334a4e" metalness={0.34} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-2.1, 1.05, 0]}>偏心圆盘 · 中心绕轴公转</SceneLabel>
      <SceneLabel position={[1.55, 1.2, 2.3]}>滚子从动件</SceneLabel>
      <SceneLabel position={[1.45, 1.15, 4.5]}>弹簧随升程压缩</SceneLabel>
    </group>
  );
}

export default function CamScene() {
  return (
    <ExperimentCanvas camera={[7.8, 6.8, 12.8]} target={[0, 0.3, 2.2]} gridY={-0.95} shadowY={-0.9} minDistance={7} maxDistance={21}>
      <CamMechanism />
    </ExperimentCanvas>
  );
}
