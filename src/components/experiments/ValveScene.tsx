import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { Spring } from "./ScenePrimitives";

function PipeStubs({ opacity }: { opacity: number }) {
  return (
    <>
      <mesh position={[-2.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.86, 0.86, 2.7, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#607e83"
          metalness={0.3}
          roughness={0.3}
          transparent
          opacity={opacity}
          transmission={0.35}
          side={2}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[2.65, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.86, 0.86, 2.7, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#607e83"
          metalness={0.3}
          roughness={0.3}
          transparent
          opacity={opacity}
          transmission={0.35}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function BallValve({ opening, opacity }: { opening: number; opacity: number }) {
  const angle = ((100 - opening) / 100) * (Math.PI / 2);
  return (
    <group>
      <PipeStubs opacity={opacity} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.45, 80, 60]} />
        <meshPhysicalMaterial
          color="#587c83"
          metalness={0.25}
          roughness={0.27}
          transparent
          opacity={opacity}
          transmission={0.5}
          depthWrite={false}
        />
      </mesh>
      <group rotation={[0, angle, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1.05, 64, 48]} />
          <meshStandardMaterial color="#c48b3d" metalness={0.72} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.52, 0.52, 2.6, 48]} />
          <meshStandardMaterial color="#315e6a" metalness={0.3} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.7, 32]} />
        <meshStandardMaterial color="#44575a" metalness={0.76} roughness={0.2} />
      </mesh>
      <mesh position={[0.75, 2.75, 0]}>
        <boxGeometry args={[1.7, 0.18, 0.28]} />
        <meshStandardMaterial color="#b47b34" metalness={0.62} roughness={0.26} />
      </mesh>
      <SceneLabel position={[0, 3.35, 0]}>球阀 · 旋转关闭件</SceneLabel>
    </group>
  );
}

function ButterflyValve({ opening, opacity }: { opening: number; opacity: number }) {
  const angle = (opening / 100) * (Math.PI / 2);
  return (
    <group>
      <PipeStubs opacity={opacity} />
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[1.05, 0.32, 30, 90]} />
        <meshPhysicalMaterial
          color="#577b82"
          metalness={0.34}
          roughness={0.3}
          transparent
          opacity={opacity}
          transmission={0.38}
          depthWrite={false}
        />
      </mesh>
      <group rotation={[0, angle, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.92, 0.92, 0.16, 64]} />
          <meshStandardMaterial color="#c28a3c" metalness={0.68} roughness={0.22} />
        </mesh>
      </group>
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 4.1, 28]} />
        <meshStandardMaterial color="#44575a" metalness={0.76} roughness={0.2} />
      </mesh>
      <mesh position={[0.68, 3.55, 0]}>
        <boxGeometry args={[1.5, 0.18, 0.28]} />
        <meshStandardMaterial color="#b47b34" metalness={0.62} roughness={0.26} />
      </mesh>
      <SceneLabel position={[0, 4.1, 0]}>蝶阀 · 蝶板绕阀杆旋转</SceneLabel>
    </group>
  );
}

function GlobeValve({ opening, opacity }: { opening: number; opacity: number }) {
  const lift = (opening / 100) * 1.25;
  return (
    <group>
      <PipeStubs opacity={opacity} />
      <mesh scale={[1.3, 1.2, 1.25]} castShadow>
        <sphereGeometry args={[1.35, 72, 54]} />
        <meshPhysicalMaterial
          color="#5c7d83"
          metalness={0.25}
          roughness={0.3}
          transparent
          opacity={opacity}
          transmission={0.42}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.12, 24, 64]} />
        <meshStandardMaterial color="#3d5559" metalness={0.64} roughness={0.24} />
      </mesh>
      <group position={[0, 0, lift]}>
        <mesh position={[0, 0, 0.25]} castShadow>
          <cylinderGeometry args={[0.68, 0.5, 0.42, 48]} />
          <meshStandardMaterial color="#c28a3c" metalness={0.68} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 3.5, 30]} />
          <meshStandardMaterial color="#44575a" metalness={0.76} roughness={0.2} />
        </mesh>
        <Spring
          length={1.2}
          radius={0.28}
          turns={6}
          position={[0, 0, 3.1]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>
      <mesh position={[0, 0, 4.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.12, 20, 64]} />
        <meshStandardMaterial color="#b47b34" metalness={0.62} roughness={0.26} />
      </mesh>
      <SceneLabel position={[0, 5.0, 0]}>截止阀 · 阀瓣轴向升降</SceneLabel>
    </group>
  );
}

function ValveMechanism() {
  const variant = useExperimentStore((state) => state.variant);
  const opening = useExperimentStore((state) => state.primary);
  const transparency = useExperimentStore((state) => state.secondary);
  const opacity = Math.max(0.16, 1 - transparency / 100);

  return (
    <group>
      {variant === 0 && <BallValve opening={opening} opacity={opacity} />}
      {variant === 1 && <ButterflyValve opening={opening} opacity={opacity} />}
      {variant === 2 && <GlobeValve opening={opening} opacity={opacity} />}
      <mesh position={[0, -1.75, 0]} receiveShadow>
        <boxGeometry args={[8, 0.32, 4.5]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>
    </group>
  );
}

export default function ValveScene() {
  return (
    <ExperimentCanvas camera={[9, 7, 12]} target={[0, 1.1, 0]} gridY={-1.95} shadowY={-1.9}>
      <ValveMechanism />
    </ExperimentCanvas>
  );
}
