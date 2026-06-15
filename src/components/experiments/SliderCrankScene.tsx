import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3, type Group, type Mesh } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";

const ORIGIN_X = -2.8;
const ROD_PLANE_Y = 0.48;
const crankPoint = new Vector3();
const sliderPoint = new Vector3();
const midpoint = new Vector3();

function SliderCrankMechanism() {
  const crankRef = useRef<Group>(null);
  const sliderRef = useRef<Group>(null);
  const rodBodyRef = useRef<Mesh>(null);
  const rodEyeARef = useRef<Group>(null);
  const rodEyeBRef = useRef<Group>(null);
  const angle = useRef(0);

  const speed = useExperimentStore((state) => state.speed);
  const radius = useExperimentStore((state) => state.primary);
  const lengthRatio = useExperimentStore((state) => state.secondary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const rodLength = radius * lengthRatio;

  useFrame((_, delta) => {
    if (isPlaying) angle.current += rpmToRadiansPerSecond(speed * direction) * delta;

    const cos = Math.cos(angle.current);
    const sin = Math.sin(angle.current);
    crankPoint.set(ORIGIN_X + radius * cos, ROD_PLANE_Y, -radius * sin);
    const sliderX = crankPoint.x + Math.sqrt(Math.max(rodLength ** 2 - crankPoint.z ** 2, 0));
    sliderPoint.set(sliderX, ROD_PLANE_Y, 0);

    if (crankRef.current) crankRef.current.rotation.y = angle.current;
    if (sliderRef.current) sliderRef.current.position.x = sliderX;

    const dx = sliderPoint.x - crankPoint.x;
    const dz = sliderPoint.z - crankPoint.z;
    const currentLength = Math.hypot(dx, dz);
    midpoint.copy(crankPoint).add(sliderPoint).multiplyScalar(0.5);

    if (rodBodyRef.current) {
      rodBodyRef.current.position.copy(midpoint);
      rodBodyRef.current.rotation.set(0, -Math.atan2(dz, dx), 0);
      rodBodyRef.current.scale.set(currentLength, 1, 1);
    }
    if (rodEyeARef.current) rodEyeARef.current.position.copy(crankPoint);
    if (rodEyeBRef.current) rodEyeBRef.current.position.copy(sliderPoint);
  });

  return (
    <group>
      <group ref={crankRef} position={[ORIGIN_X, 0, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.72, 48]} />
          <meshStandardMaterial color="#405459" metalness={0.82} roughness={0.18} />
        </mesh>
        <mesh position={[radius / 2, 0.06, 0]} castShadow>
          <boxGeometry args={[radius, 0.28, 0.38]} />
          <meshStandardMaterial color="#bd8435" metalness={0.67} roughness={0.24} />
        </mesh>
        <mesh position={[-0.42, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.3, 56]} />
          <meshStandardMaterial color="#9a6a2c" metalness={0.64} roughness={0.26} />
        </mesh>
        <mesh position={[radius, ROD_PLANE_Y / 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, ROD_PLANE_Y + 0.45, 36]} />
          <meshStandardMaterial color="#32494e" metalness={0.84} roughness={0.17} />
        </mesh>
      </group>

      <mesh ref={rodBodyRef} castShadow receiveShadow>
        <boxGeometry args={[1, 0.18, 0.34]} />
        <meshStandardMaterial color="#6795a0" metalness={0.62} roughness={0.24} />
      </mesh>
      <group ref={rodEyeARef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.27, 0.08, 18, 48]} />
          <meshStandardMaterial color="#5e8790" metalness={0.68} roughness={0.22} />
        </mesh>
      </group>
      <group ref={rodEyeBRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.27, 0.08, 18, 48]} />
          <meshStandardMaterial color="#5e8790" metalness={0.68} roughness={0.22} />
        </mesh>
      </group>

      <group ref={sliderRef}>
        <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.78, 1.35]} />
          <meshStandardMaterial color="#4f7d87" metalness={0.48} roughness={0.3} />
        </mesh>
        <mesh position={[0, ROD_PLANE_Y / 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, ROD_PLANE_Y + 0.46, 36]} />
          <meshStandardMaterial color="#334b50" metalness={0.84} roughness={0.17} />
        </mesh>
      </group>

      <mesh position={[1.6, -0.8, 0]} receiveShadow>
        <boxGeometry args={[10.6, 0.3, 2.05]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[1.6, -0.45, 0.83]}>
        <boxGeometry args={[10.6, 0.18, 0.18]} />
        <meshStandardMaterial color="#7a8986" metalness={0.45} roughness={0.34} />
      </mesh>
      <mesh position={[1.6, -0.45, -0.83]}>
        <boxGeometry args={[10.6, 0.18, 0.18]} />
        <meshStandardMaterial color="#7a8986" metalness={0.45} roughness={0.34} />
      </mesh>

      <SceneLabel position={[ORIGIN_X, 1.65, 0]}>曲柄与配重 · 独立轴向层</SceneLabel>
      <SceneLabel position={[2.7, 1.5, 0]}>连杆</SceneLabel>
      <SceneLabel position={[5.3, 1.5, 0]}>滑块 · 仅沿导轨移动</SceneLabel>
    </group>
  );
}

export default function SliderCrankScene() {
  return (
    <ExperimentCanvas camera={[8.8, 6.2, 11.8]} target={[1.1, 0, 0]} gridY={-1} shadowY={-0.95} minDistance={7} maxDistance={20}>
      <SliderCrankMechanism />
    </ExperimentCanvas>
  );
}
