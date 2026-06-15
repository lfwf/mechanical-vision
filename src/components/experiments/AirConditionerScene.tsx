import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { CatmullRomCurve3, Color, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { FlowArrow, TubePath } from "./ScenePrimitives";

const hotGas = new Color("#df5d48");
const warmLiquid = new Color("#e8a244");
const coldMixture = new Color("#4ea9d3");
const coolGas = new Color("#62c4c8");

function CoilBank({ color = "#6aa6b0", width = 3, height = 1.45 }: { color?: string; width?: number; height?: number }) {
  const rows = 7;
  return (
    <group>
      {Array.from({ length: rows }, (_, index) => {
        const y = -height / 2 + (index * height) / (rows - 1);
        return (
          <mesh key={index} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, width, 14]} />
            <meshStandardMaterial color={color} metalness={0.72} roughness={0.25} />
          </mesh>
        );
      })}
      {Array.from({ length: 14 }, (_, index) => (
        <mesh key={`fin-${index}`} position={[-width / 2 + (index * width) / 13, 0, 0]}>
          <boxGeometry args={[0.025, height + 0.32, 0.3]} />
          <meshStandardMaterial color="#b7c7c5" metalness={0.45} roughness={0.35} transparent opacity={0.68} />
        </mesh>
      ))}
    </group>
  );
}

function OutdoorFan({ fanRef }: { fanRef: RefObject<Group | null> }) {
  return (
    <group ref={fanRef}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.34, 36]} />
        <meshStandardMaterial color="#3b5358" metalness={0.72} roughness={0.2} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => (
        <group key={index} rotation={[0, 0, (index * Math.PI * 2) / 5]}>
          <mesh position={[0.82, 0, 0]} rotation={[0, 0.25, 0.28]} castShadow>
            <boxGeometry args={[1.2, 0.34, 0.12]} />
            <meshStandardMaterial color="#789da4" metalness={0.42} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AirConditionerMechanism() {
  const indoorFanRef = useRef<Group>(null);
  const outdoorFanRef = useRef<Group>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phase = useRef(0);

  const speed = useExperimentStore((state) => state.speed);
  const progress = useExperimentStore((state) => state.primary) / 100;
  const transparency = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const direction = useExperimentStore((state) => state.direction);

  const explosion = variant === 1 ? progress : variant === 2 ? 1 - progress : 0;
  const workMode = variant === 0;
  const shellOpacity = Math.max(0.14, 1 - transparency / 100);

  const paths = useMemo(() => {
    const segments = [
      [[4.45, -0.65, -0.5], [4.45, 0.35, -0.55], [4.2, 1.45, -0.7]],
      [[4.2, 1.45, -0.7], [2.3, 1.15, -0.85], [0.25, -0.1, -0.9]],
      [[0.25, -0.1, -0.9], [-2.0, -0.25, -0.85], [-4.25, 0.65, -0.65]],
      [[-4.25, 0.65, -0.65], [-2.2, 1.7, -0.55], [1.4, -1.35, -0.65], [4.45, -0.65, -0.5]],
    ] as Array<Array<[number, number, number]>>;
    return segments.map((points) => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal"));
  }, []);

  const particles = useMemo(() => Array.from({ length: 40 }, (_, index) => index / 40), []);

  useFrame((_, delta) => {
    if (isPlaying && workMode) {
      const visualSpeed = (0.8 + speed / 42) * direction;
      if (indoorFanRef.current) indoorFanRef.current.rotation.x += visualSpeed * delta;
      if (outdoorFanRef.current) outdoorFanRef.current.rotation.z -= visualSpeed * 0.82 * delta;
      phase.current += delta * (0.06 + speed / 540);
    }

    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      particle.visible = workMode;
      if (!workMode) return;
      const total = (particles[index] + phase.current) % 1;
      const segmentIndex = Math.min(3, Math.floor(total * 4));
      const local = total * 4 - segmentIndex;
      particle.position.copy(paths[segmentIndex].getPoint(local));
      const color = [hotGas, warmLiquid, coldMixture, coolGas][segmentIndex];
      const material = particle.material as MeshStandardMaterial;
      material.color.copy(color);
      material.emissive.copy(color).multiplyScalar(0.42);
    });
  });

  return (
    <group>
      <group position={[-4.2, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.3, 2.55, 2.25]} />
          <meshPhysicalMaterial color="#e8ece6" metalness={0.08} roughness={0.35} transparent opacity={shellOpacity} transmission={Math.min(0.52, transparency / 150)} depthWrite={false} />
        </mesh>
        <group position={[0, 0.35 + explosion * 1.0, -0.55 - explosion * 0.45]}>
          <CoilBank color="#67a8b4" width={3.35} height={1.35} />
        </group>
        <group ref={indoorFanRef} position={[0, -0.65 - explosion * 0.8, 0.35]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 3.25, 48, 1, true]} />
            <meshStandardMaterial color="#506f76" metalness={0.4} roughness={0.3} side={2} />
          </mesh>
          {Array.from({ length: 16 }, (_, index) => (
            <mesh key={index} rotation={[(index * Math.PI * 2) / 16, 0, 0]} position={[0, 0.34, 0]}>
              <boxGeometry args={[3.0, 0.06, 0.14]} />
              <meshStandardMaterial color="#7a9ba0" metalness={0.35} roughness={0.32} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 0.25, 1.18 + explosion * 1.75]} castShadow>
          <boxGeometry args={[4.0, 2.0, 0.12]} />
          <meshStandardMaterial color="#f4f3ec" metalness={0.05} roughness={0.42} transparent opacity={0.86} />
        </mesh>
        <mesh position={[0, 0.55, 1.02 + explosion * 1.05]}>
          <boxGeometry args={[3.65, 1.4, 0.08]} />
          <meshStandardMaterial color="#c8d4d1" metalness={0.1} roughness={0.5} transparent opacity={0.7} />
        </mesh>
      </group>

      <group position={[4.0, 0.25, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 3.45, 2.8]} />
          <meshPhysicalMaterial color="#dce3df" metalness={0.1} roughness={0.38} transparent opacity={shellOpacity} transmission={Math.min(0.45, transparency / 160)} depthWrite={false} />
        </mesh>
        <group position={[0, 0.95 + explosion * 0.9, -0.95]}>
          <CoilBank color="#bd8762" width={2.75} height={1.85} />
        </group>
        <group position={[0, 0.35, 1.25 + explosion * 1.35]}>
          <OutdoorFan fanRef={outdoorFanRef} />
        </group>
        <group position={[0.75 + explosion * 1.25, -0.9, -0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.58, 0.68, 1.65, 48]} />
            <meshStandardMaterial color="#364e53" metalness={0.58} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.32, 0.45, 0.25, 40]} />
            <meshStandardMaterial color="#526b6f" metalness={0.52} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[0, 0, 1.48 + explosion * 1.9]}>
          <boxGeometry args={[3.2, 3.0, 0.1]} />
          <meshStandardMaterial color="#edf0ea" metalness={0.05} roughness={0.4} transparent opacity={0.82} />
        </mesh>
      </group>

      <group position={[0.25, -0.1, -0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.24, 0.72, 32]} />
          <meshStandardMaterial color="#caa04b" metalness={0.62} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <coneGeometry args={[0.18, 0.28, 28]} />
          <meshStandardMaterial color="#967337" metalness={0.54} roughness={0.28} />
        </mesh>
      </group>

      <TubePath points={[[4.45, -0.65, -0.5], [4.45, 0.35, -0.55], [4.2, 1.45, -0.7]]} color="#df5d48" radius={0.07} opacity={workMode ? 1 : 0.35} />
      <TubePath points={[[4.2, 1.45, -0.7], [2.3, 1.15, -0.85], [0.25, -0.1, -0.9]]} color="#e8a244" radius={0.065} opacity={workMode ? 1 : 0.35} />
      <TubePath points={[[0.25, -0.1, -0.9], [-2.0, -0.25, -0.85], [-4.25, 0.65, -0.65]]} color="#4ea9d3" radius={0.065} opacity={workMode ? 1 : 0.35} />
      <TubePath points={[[-4.25, 0.65, -0.65], [-2.2, 1.7, -0.55], [1.4, -1.35, -0.65], [4.45, -0.65, -0.5]]} color="#62c4c8" radius={0.065} opacity={workMode ? 1 : 0.35} />

      {particles.map((_, index) => (
        <mesh key={index} ref={(node) => { particleRefs.current[index] = node; }}>
          <sphereGeometry args={[0.075, 14, 14]} />
          <meshStandardMaterial color="#df5d48" emissive="#8f2c20" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {workMode && (
        <>
          <FlowArrow position={[-4.2, 0.1, 2.0]} rotation={[Math.PI / 2, 0, 0]} color="#58a9d2" scale={0.8} />
          <FlowArrow position={[4.0, 1.0, 2.15]} rotation={[Math.PI / 2, 0, 0]} color="#df6650" scale={0.9} />
        </>
      )}

      <mesh position={[0, -2.0, 0]} receiveShadow>
        <boxGeometry args={[12.5, 0.32, 6.4]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-4.2, 2.55, 0]}>室内机：蒸发器吸热，贯流风机送出冷风</SceneLabel>
      <SceneLabel position={[4.0, 2.8, 0]}>室外机：压缩机做功，冷凝器向室外放热</SceneLabel>
      <SceneLabel position={[0.2, 0.85, -1.25]}>节流元件：降压后进入蒸发器</SceneLabel>
      {workMode && <SceneLabel position={[0, 3.5, -1.0]}>制冷剂循环：压缩 → 冷凝 → 节流 → 蒸发</SceneLabel>}
    </group>
  );
}

export default function AirConditionerScene() {
  return (
    <ExperimentCanvas camera={[12.5, 8.5, 15.5]} target={[0, 0.25, 0]} gridY={-2.2} shadowY={-2.15} minDistance={10} maxDistance={27}>
      <AirConditionerMechanism />
    </ExperimentCanvas>
  );
}
