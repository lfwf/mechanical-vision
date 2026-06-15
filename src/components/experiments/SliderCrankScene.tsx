import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Quaternion, Vector3, type Group, type Mesh } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";

const UP = new Vector3(0, 1, 0);

function alignRod(mesh: Mesh, start: Vector3, end: Vector3) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
  mesh.quaternion.copy(new Quaternion().setFromUnitVectors(UP, direction.normalize()));
  mesh.scale.set(1, length, 1);
}

function SliderCrankMechanism() {
  const crankRef = useRef<Group>(null);
  const sliderRef = useRef<Group>(null);
  const rodRef = useRef<Mesh>(null);
  const angle = useRef(0);
  const speed = useExperimentStore((state) => state.speed);
  const radius = useExperimentStore((state) => state.primary);
  const lengthRatio = useExperimentStore((state) => state.secondary);
  const direction = useExperimentStore((state) => state.direction);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const rodLength = radius * lengthRatio;

  useFrame((_, delta) => {
    if (isPlaying) {
      angle.current += rpmToRadiansPerSecond(speed * direction) * delta;
    }
    const crankPin = new Vector3(
      radius * Math.cos(angle.current),
      0,
      -radius * Math.sin(angle.current),
    );
    const sliderX = crankPin.x + Math.sqrt(Math.max(rodLength ** 2 - crankPin.z ** 2, 0));
    const sliderPin = new Vector3(sliderX, 0, 0);

    if (crankRef.current) crankRef.current.rotation.y = angle.current;
    if (sliderRef.current) sliderRef.current.position.x = sliderX;
    if (rodRef.current) alignRod(rodRef.current, crankPin, sliderPin);
  });

  return (
    <group position={[-2.3, 0, 0]}>
      <group ref={crankRef}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[radius * 0.72, radius * 0.72, 0.34, 64]} />
          <meshStandardMaterial color="#c58c3b" metalness={0.7} roughness={0.23} />
        </mesh>
        <mesh position={[radius, 0, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.19, 0.78, 32]} />
          <meshStandardMaterial color="#3c5055" metalness={0.82} roughness={0.18} />
        </mesh>
        <mesh position={[radius / 2, 0, 0]}>
          <boxGeometry args={[radius, 0.22, 0.2]} />
          <meshStandardMaterial color="#a97836" metalness={0.65} roughness={0.25} />
        </mesh>
      </group>

      <mesh ref={rodRef} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.14, 1, 32]} />
        <meshStandardMaterial color="#648f99" metalness={0.64} roughness={0.25} />
      </mesh>

      <group ref={sliderRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.85, 1.25]} />
          <meshStandardMaterial color="#507d87" metalness={0.48} roughness={0.3} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.19, 0.19, 1.5, 32]} />
          <meshStandardMaterial color="#3e5054" metalness={0.82} roughness={0.18} />
        </mesh>
      </group>

      <mesh position={[3.2, -0.72, 0]} receiveShadow>
        <boxGeometry args={[8.6, 0.3, 1.65]} />
        <meshStandardMaterial color="#354c50" metalness={0.35} roughness={0.42} />
      </mesh>
      <mesh position={[3.2, -0.4, 0.72]}>
        <boxGeometry args={[8.6, 0.22, 0.18]} />
        <meshStandardMaterial color="#778683" metalness={0.45} roughness={0.34} />
      </mesh>
      <mesh position={[3.2, -0.4, -0.72]}>
        <boxGeometry args={[8.6, 0.22, 0.18]} />
        <meshStandardMaterial color="#778683" metalness={0.45} roughness={0.34} />
      </mesh>

      <SceneLabel position={[0, 1.7, 0]}>曲柄 · r = {radius.toFixed(1)}</SceneLabel>
      <SceneLabel position={[3.7, 1.5, 0]}>滑块 · 往复直线运动</SceneLabel>
    </group>
  );
}

export default function SliderCrankScene() {
  return (
    <ExperimentCanvas camera={[8, 6, 11]} target={[1.3, 0, 0]} gridY={-0.9} shadowY={-0.85}>
      <SliderCrankMechanism />
    </ExperimentCanvas>
  );
}
