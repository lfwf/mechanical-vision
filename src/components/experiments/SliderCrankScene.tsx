import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3, type Group, type Mesh } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";

const ORIGIN_X = -2.8;
const ROD_PLANE_Y = 0.52;
const crankPoint = new Vector3();
const sliderPoint = new Vector3();
const midpoint = new Vector3();

function BearingPedestal({ x }: { x: number }) {
  return (
    <group position={[x, -0.12, 0]}>
      <RoundedBox args={[1.28, 0.72, 1.5]} radius={0.12} smoothness={5} castShadow>
        <meshStandardMaterial color="#355157" metalness={0.4} roughness={0.34} />
      </RoundedBox>
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.36, 0.12, 18, 52]} />
        <meshStandardMaterial color="#8a9998" metalness={0.72} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 1.72, 36]} />
        <meshStandardMaterial color="#273c42" metalness={0.86} roughness={0.16} />
      </mesh>
    </group>
  );
}

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
      <RoundedBox args={[11.4, 0.42, 3.0]} radius={0.12} smoothness={5} position={[1.25, -0.92, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f484d" metalness={0.32} roughness={0.44} />
      </RoundedBox>

      <BearingPedestal x={ORIGIN_X} />

      <group ref={crankRef} position={[ORIGIN_X, 0.18, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.34, 64]} />
          <meshStandardMaterial color="#9c6728" metalness={0.66} roughness={0.25} />
        </mesh>
        <RoundedBox args={[radius, 0.32, 0.42]} radius={0.11} smoothness={5} position={[radius / 2, 0.03, 0]} castShadow>
          <meshStandardMaterial color="#c18531" metalness={0.68} roughness={0.22} />
        </RoundedBox>
        <mesh position={[-0.45, -0.02, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.72, 0.26, 64]} />
          <meshStandardMaterial color="#8b5b24" metalness={0.62} roughness={0.27} />
        </mesh>
        <mesh position={[radius, ROD_PLANE_Y / 2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, ROD_PLANE_Y + 0.44, 36]} />
          <meshStandardMaterial color="#263f45" metalness={0.86} roughness={0.16} />
        </mesh>
      </group>

      <mesh ref={rodBodyRef} castShadow receiveShadow>
        <boxGeometry args={[1, 0.16, 0.28]} />
        <meshStandardMaterial color="#6f9aa3" metalness={0.64} roughness={0.23} />
      </mesh>
      {[rodEyeARef, rodEyeBRef].map((ref, index) => (
        <group key={index} ref={ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.24, 0.07, 18, 48]} />
            <meshStandardMaterial color="#638b94" metalness={0.7} roughness={0.21} />
          </mesh>
        </group>
      ))}

      <group ref={sliderRef}>
        <RoundedBox args={[1.36, 0.82, 1.42]} radius={0.1} smoothness={5} position={[0, -0.02, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#4c7882" metalness={0.5} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, ROD_PLANE_Y / 2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, ROD_PLANE_Y + 0.44, 36]} />
          <meshStandardMaterial color="#2d474d" metalness={0.86} roughness={0.16} />
        </mesh>
        {[-0.54, 0.54].map((z) => (
          <RoundedBox key={z} args={[1.12, 0.12, 0.18]} radius={0.03} smoothness={3} position={[0, -0.48, z]}>
            <meshStandardMaterial color="#84928f" metalness={0.5} roughness={0.3} />
          </RoundedBox>
        ))}
      </group>

      {[-0.86, 0.86].map((z) => (
        <group key={z}>
          <RoundedBox args={[10.7, 0.16, 0.18]} radius={0.035} smoothness={3} position={[1.45, -0.44, z]} castShadow>
            <meshStandardMaterial color="#879491" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[10.7, 0.12, 0.12]} radius={0.025} smoothness={3} position={[1.45, -0.64, z]}>
            <meshStandardMaterial color="#56676a" metalness={0.42} roughness={0.36} />
          </RoundedBox>
        </group>
      ))}

      <SceneLabel position={[ORIGIN_X, 1.55, 0]}>曲柄、配重与主轴</SceneLabel>
      <SceneLabel position={[2.1, 1.35, -0.1]}>锻造连杆</SceneLabel>
      <SceneLabel position={[5.2, 1.35, 0]}>滑块与双导轨</SceneLabel>
    </group>
  );
}

export default function SliderCrankScene() {
  return (
    <ExperimentCanvas camera={[8.4, 5.4, 10.8]} target={[1, 0, 0]} gridY={-1.18} shadowY={-1.12} minDistance={7} maxDistance={20}>
      <SliderCrankMechanism />
    </ExperimentCanvas>
  );
}
