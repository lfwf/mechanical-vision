import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { ExplodablePart } from "./ExplodablePart";
import { FlowArrow, TubePath } from "./ScenePrimitives";

const HOT_GAS = new Color("#df5d48");
const WARM_LIQUID = new Color("#e7a044");
const COLD_MIXTURE = new Color("#4d9ed0");
const COOL_GAS = new Color("#63c2c4");

function FinCoil({
  width,
  height,
  rows = 8,
  color = "#8ab7bb",
  rotation = [0, 0, 0],
}: {
  width: number;
  height: number;
  rows?: number;
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <group rotation={rotation}>
      {Array.from({ length: rows }, (_, row) => {
        const y = -height / 2 + (row * height) / Math.max(1, rows - 1);
        return (
          <mesh key={`tube-${row}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, width, 12]} />
            <meshStandardMaterial color="#b67c3d" metalness={0.68} roughness={0.24} />
          </mesh>
        );
      })}
      {Array.from({ length: 18 }, (_, index) => (
        <mesh
          key={`fin-${index}`}
          position={[-width / 2 + (index * width) / 17, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.022, height + 0.22, 0.28]} />
          <meshStandardMaterial
            color={color}
            metalness={0.38}
            roughness={0.34}
            transparent
            opacity={0.82}
          />
        </mesh>
      ))}
    </group>
  );
}

function IndoorHeatExchanger() {
  return (
    <group>
      <FinCoil width={3.8} height={1.0} rows={7} rotation={[0.2, 0, 0]} />
      <group position={[0, 0.25, -0.55]} rotation={[-0.45, 0, 0]}>
        <FinCoil width={3.8} height={0.95} rows={7} color="#9fc3c5" />
      </group>
      <mesh position={[1.95, 0.15, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.35, 0.045, 12, 30, Math.PI]} />
        <meshStandardMaterial color="#b67c3d" metalness={0.7} roughness={0.22} />
      </mesh>
    </group>
  );
}

function CrossFlowFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  return (
    <group ref={fanRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 3.75, 48, 1, true]} />
        <meshStandardMaterial color="#496c73" metalness={0.35} roughness={0.32} side={2} />
      </mesh>
      {Array.from({ length: 20 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 20;
        return (
          <mesh
            key={index}
            position={[0, Math.cos(angle) * 0.3, Math.sin(angle) * 0.3]}
            rotation={[angle, 0, 0]}
          >
            <boxGeometry args={[3.55, 0.035, 0.12]} />
            <meshStandardMaterial color="#729298" metalness={0.28} roughness={0.34} />
          </mesh>
        );
      })}
      <mesh position={[-1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 36]} />
        <meshStandardMaterial color="#40575c" metalness={0.48} roughness={0.28} />
      </mesh>
      <mesh position={[1.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 36]} />
        <meshStandardMaterial color="#40575c" metalness={0.48} roughness={0.28} />
      </mesh>
    </group>
  );
}

function AxialFan({ fanRef }: { fanRef: React.RefObject<Group | null> }) {
  return (
    <group ref={fanRef}>
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 0.34, 36]} />
        <meshStandardMaterial color="#394f54" metalness={0.7} roughness={0.2} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => (
        <group key={index} rotation={[0, 0, (index * Math.PI * 2) / 5]}>
          <mesh position={[0.82, 0, 0]} rotation={[0.18, 0.34, 0.25]} castShadow>
            <boxGeometry args={[1.22, 0.38, 0.1]} />
            <meshStandardMaterial color="#779aa0" metalness={0.42} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function OutdoorHeatExchanger() {
  return (
    <group>
      <group position={[0, 0, -0.55]}>
        <FinCoil width={4.0} height={2.8} rows={14} color="#94b9ba" />
      </group>
      <group position={[-2.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <FinCoil width={1.25} height={2.8} rows={14} color="#9dc1c1" />
      </group>
    </group>
  );
}

function FourWayValve() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.72, 28]} />
        <meshStandardMaterial color="#b57a3a" metalness={0.7} roughness={0.22} />
      </mesh>
      {[-0.24, 0.24].map((x) =>
        [-0.26, 0.26].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.36, z]}>
            <cylinderGeometry args={[0.045, 0.045, 0.7, 12]} />
            <meshStandardMaterial color="#b67d3d" metalness={0.72} roughness={0.21} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.34, 24]} />
        <meshStandardMaterial color="#3f555a" metalness={0.52} roughness={0.3} />
      </mesh>
    </group>
  );
}

function AirConditionerAssembly() {
  const indoorFanRef = useRef<Group>(null);
  const outdoorFanRef = useRef<Group>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const phaseRef = useRef(0);
  const speed = useExperimentStore((state) => state.speed);
  const transparency = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const assemblyEnabled = variant === 1;
  const shellOpacity = Math.max(0.12, 1 - transparency / 100);

  const flowCurves = useMemo(() => {
    const paths: Array<Array<[number, number, number]>> = [
      [[5.25, -0.85, -0.3], [5.15, 0.0, -0.45], [4.5, 0.8, -0.65]],
      [[4.5, 0.8, -0.65], [3.7, 1.25, -0.65], [4.65, -0.3, -0.7]],
      [[4.65, -0.3, -0.7], [1.8, -0.8, -0.75], [-3.8, 0.35, -0.35]],
      [[-3.8, 0.35, -0.35], [-1.2, -0.5, -0.55], [4.9, -0.6, -0.45], [5.25, -0.85, -0.3]],
    ];
    return paths.map(
      (points) =>
        new CatmullRomCurve3(
          points.map((point) => new Vector3(...point)),
          false,
          "centripetal",
        ),
    );
  }, []);
  const particles = useMemo(() => Array.from({ length: 48 }, (_, index) => index / 48), []);

  useFrame((_, delta) => {
    if (isPlaying && !assemblyEnabled) {
      const animationSpeed = 0.7 + speed / 60;
      phaseRef.current += delta * (0.055 + speed / 900);
      if (indoorFanRef.current) indoorFanRef.current.rotation.x += delta * animationSpeed * 2.4;
      if (outdoorFanRef.current) outdoorFanRef.current.rotation.z -= delta * animationSpeed * 2.0;
    }

    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      particle.visible = !assemblyEnabled;
      if (assemblyEnabled) return;
      const progress = (particles[index] + phaseRef.current) % 1;
      const segmentIndex = Math.min(3, Math.floor(progress * 4));
      const local = progress * 4 - segmentIndex;
      particle.position.copy(flowCurves[segmentIndex].getPoint(local));
      const color = [HOT_GAS, WARM_LIQUID, COLD_MIXTURE, COOL_GAS][segmentIndex];
      const material = particle.material as MeshStandardMaterial;
      material.color.copy(color);
      material.emissive.copy(color).multiplyScalar(0.42);
    });
  });

  return (
    <group>
      <group position={[-4.0, 0.2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[5.0, 1.9, 1.7]} />
          <meshPhysicalMaterial
            color="#e8ece7"
            roughness={0.36}
            transparent
            opacity={shellOpacity * 0.72}
            transmission={Math.min(0.55, transparency / 145)}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -0.93, 0]}>
          <boxGeometry args={[4.85, 0.12, 1.58]} />
          <meshStandardMaterial color="#c9d0cc" metalness={0.12} roughness={0.42} />
        </mesh>
      </group>

      <ExplodablePart id="ac-indoor-front-panel" home={[-4.0, 0.65, 0.95]} exploded={[-4.0, 3.0, 3.0]} assemblyEnabled={assemblyEnabled} selectionRadius={2.0}>
        <mesh castShadow>
          <boxGeometry args={[4.85, 1.45, 0.14]} />
          <meshStandardMaterial color="#f2f1eb" roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.55, 0.09]}>
          <boxGeometry args={[3.7, 0.16, 0.04]} />
          <meshStandardMaterial color="#d7dfda" roughness={0.45} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-filter" home={[-4.0, 0.45, 0.72]} exploded={[-4.0, 2.45, 1.45]} assemblyEnabled={assemblyEnabled} selectionRadius={1.8}>
        {[-1.05, 1.05].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[1.9, 1.0, 0.05]} />
            <meshStandardMaterial color="#c6d3cf" wireframe transparent opacity={0.75} />
          </mesh>
        ))}
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-heat-exchanger" home={[-4.0, 0.45, -0.1]} exploded={[-4.0, 2.5, -1.0]} assemblyEnabled={assemblyEnabled} selectionRadius={2.2}>
        <IndoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-crossflow-fan" home={[-4.15, -0.45, 0.25]} exploded={[-4.15, -2.1, 1.7]} assemblyEnabled={assemblyEnabled} selectionRadius={1.2}>
        <CrossFlowFan fanRef={indoorFanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-fan-motor" home={[-1.95, -0.45, 0.25]} exploded={[-0.55, -1.35, 0.65]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.72, 36]} />
          <meshStandardMaterial color="#425b60" metalness={0.62} roughness={0.25} />
        </mesh>
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.45, 20]} />
          <meshStandardMaterial color="#889492" metalness={0.78} roughness={0.18} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-drain-pan" home={[-4.0, -0.72, -0.02]} exploded={[-4.0, -2.0, -0.7]} assemblyEnabled={assemblyEnabled} selectionRadius={2.0}>
        <mesh castShadow>
          <boxGeometry args={[4.55, 0.24, 1.12]} />
          <meshStandardMaterial color="#8ea9a6" metalness={0.08} roughness={0.46} />
        </mesh>
        <mesh position={[2.35, -0.02, -0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.7, 20]} />
          <meshStandardMaterial color="#6b8582" roughness={0.42} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-louver" home={[-4.0, -1.0, 0.75]} exploded={[-4.0, -2.15, 2.55]} assemblyEnabled={assemblyEnabled} selectionRadius={1.8} rotation={[0.18, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.35, 0.12, 0.62]} />
          <meshStandardMaterial color="#f3f2ec" roughness={0.4} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-indoor-control-box" home={[-1.85, 0.5, 0.05]} exploded={[-0.35, 1.35, 1.55]} assemblyEnabled={assemblyEnabled} selectionRadius={0.75}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 1.1, 0.62]} />
          <meshStandardMaterial color="#4b656a" metalness={0.32} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0, 0.33]}>
          <boxGeometry args={[0.58, 0.82, 0.04]} />
          <meshStandardMaterial color="#6ca77e" metalness={0.18} roughness={0.45} />
        </mesh>
      </ExplodablePart>

      <group position={[4.3, 0, 0]}>
        <mesh position={[0, -1.62, 0]} receiveShadow>
          <boxGeometry args={[4.6, 0.25, 2.0]} />
          <meshStandardMaterial color="#657472" metalness={0.28} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.96]}>
          <boxGeometry args={[4.55, 3.15, 0.08]} />
          <meshStandardMaterial color="#cfd7d2" transparent opacity={shellOpacity * 0.45} depthWrite={false} />
        </mesh>
      </group>

      <ExplodablePart id="ac-outdoor-top-panel" home={[4.3, 0, 0]} exploded={[4.3, 3.9, 2.8]} assemblyEnabled={assemblyEnabled} selectionRadius={2.3}>
        <mesh position={[0, 1.62, 0]} castShadow>
          <boxGeometry args={[4.65, 0.18, 2.05]} />
          <meshStandardMaterial color="#e3e8e3" metalness={0.12} roughness={0.38} />
        </mesh>
        <mesh position={[-0.65, 0.15, 1.04]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.09, 18, 64]} />
          <meshStandardMaterial color="#788784" metalness={0.3} roughness={0.36} />
        </mesh>
        {Array.from({ length: 9 }, (_, index) => (
          <mesh key={index} position={[-0.65, 0.15, 1.04]} rotation={[0, 0, (index * Math.PI) / 9]}>
            <boxGeometry args={[2.25, 0.035, 0.05]} />
            <meshStandardMaterial color="#788784" metalness={0.3} roughness={0.36} />
          </mesh>
        ))}
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-condenser" home={[4.3, 0, -0.1]} exploded={[7.3, 0.7, -2.2]} assemblyEnabled={assemblyEnabled} selectionRadius={2.2}>
        <OutdoorHeatExchanger />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-axial-fan" home={[3.65, 0.15, 0.92]} exploded={[1.8, 0.7, 3.4]} assemblyEnabled={assemblyEnabled} selectionRadius={1.4}>
        <AxialFan fanRef={outdoorFanRef} />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-fan-motor" home={[3.65, 0.15, 0.38]} exploded={[3.65, 0.15, 3.15]} assemblyEnabled={assemblyEnabled} selectionRadius={0.6}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.64, 36]} />
          <meshStandardMaterial color="#42585d" metalness={0.62} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.55, 18]} />
          <meshStandardMaterial color="#899592" metalness={0.76} roughness={0.18} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-compressor" home={[5.45, -0.75, -0.28]} exploded={[7.7, -1.0, -0.25]} assemblyEnabled={assemblyEnabled} selectionRadius={0.85}>
        <mesh castShadow>
          <cylinderGeometry args={[0.62, 0.72, 1.7, 48]} />
          <meshStandardMaterial color="#2e4449" metalness={0.56} roughness={0.27} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.32, 0.46, 0.24, 36]} />
          <meshStandardMaterial color="#445b60" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.35, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.75, 14]} />
          <meshStandardMaterial color="#b57b3d" metalness={0.72} roughness={0.2} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-control-box" home={[5.45, 1.0, -0.15]} exploded={[7.4, 2.35, 0.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.9}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 0.9, 0.7]} />
          <meshStandardMaterial color="#4a6267" metalness={0.3} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0, 0.37]}>
          <boxGeometry args={[1.05, 0.68, 0.04]} />
          <meshStandardMaterial color="#6ba278" metalness={0.15} roughness={0.45} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-four-way-valve" home={[5.05, 0.15, -0.3]} exploded={[7.05, 0.45, -1.3]} assemblyEnabled={assemblyEnabled} selectionRadius={0.65}>
        <FourWayValve />
      </ExplodablePart>

      <ExplodablePart id="ac-outdoor-expansion-valve" home={[4.65, -0.35, -0.55]} exploded={[6.55, -0.25, -1.9]} assemblyEnabled={assemblyEnabled} selectionRadius={0.45}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.2, 0.5, 28]} />
          <meshStandardMaterial color="#b9823d" metalness={0.68} roughness={0.23} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.22, 24]} />
          <meshStandardMaterial color="#3e565b" metalness={0.5} roughness={0.3} />
        </mesh>
      </ExplodablePart>

      {!assemblyEnabled && (
        <>
          <TubePath points={[[5.25, -0.85, -0.3], [5.15, 0.0, -0.45], [4.5, 0.8, -0.65]]} color="#df5d48" radius={0.055} />
          <TubePath points={[[4.5, 0.8, -0.65], [3.7, 1.25, -0.65], [4.65, -0.3, -0.7]]} color="#e7a044" radius={0.055} />
          <TubePath points={[[4.65, -0.3, -0.7], [1.8, -0.8, -0.75], [-3.8, 0.35, -0.35]]} color="#4d9ed0" radius={0.055} />
          <TubePath points={[[-3.8, 0.35, -0.35], [-1.2, -0.5, -0.55], [4.9, -0.6, -0.45], [5.25, -0.85, -0.3]]} color="#63c2c4" radius={0.055} />
          {particles.map((_, index) => (
            <mesh key={index} ref={(node) => { particleRefs.current[index] = node; }}>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshStandardMaterial color="#df5d48" emissive="#812a20" emissiveIntensity={0.35} />
            </mesh>
          ))}
          <FlowArrow position={[-4.0, 0.3, 2.0]} rotation={[Math.PI / 2, 0, 0]} color="#5daed4" scale={0.75} />
          <FlowArrow position={[3.65, 0.15, 2.25]} rotation={[Math.PI / 2, 0, 0]} color="#df6b52" scale={0.85} />
        </>
      )}

      <mesh position={[0, -2.45, 0]} receiveShadow>
        <boxGeometry args={[13.5, 0.32, 6.6]} />
        <meshStandardMaterial color="#344b4f" metalness={0.35} roughness={0.42} />
      </mesh>

      <SceneLabel position={[-4.0, 2.05, 0]}>FTXM35R 室内机</SceneLabel>
      <SceneLabel position={[4.3, 2.25, 0]}>RXM35R 室外机</SceneLabel>
      {!assemblyEnabled && <SceneLabel position={[0, 3.3, -0.8]}>制冷剂：压缩 → 冷凝 → 节流 → 蒸发</SceneLabel>}
    </group>
  );
}

export default function AirConditionerScene() {
  return (
    <ExperimentCanvas
      camera={[12.8, 8.2, 15.8]}
      target={[0, 0.15, 0]}
      gridY={-2.65}
      shadowY={-2.6}
      minDistance={10}
      maxDistance={28}
    >
      <AirConditionerAssembly />
    </ExperimentCanvas>
  );
}
