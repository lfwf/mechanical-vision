import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Vector3, type Mesh, type MeshStandardMaterial } from "three";
import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";
import { TubePath } from "../../ScenePrimitives";

interface WaterSystemAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
  isPlaying: boolean;
  speed: number;
  waterLevel: number;
}

function AnimatedFlow({
  points,
  color,
  active,
  isPlaying,
  speed,
  count = 10,
}: {
  points: Array<[number, number, number]>;
  color: string;
  active: boolean;
  isPlaying: boolean;
  speed: number;
  count?: number;
}) {
  const refs = useRef<Array<Mesh | null>>([]);
  const phase = useRef(0);
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        points.map((point) => new Vector3(...point)),
        false,
        "centripetal",
      ),
    [points],
  );

  useFrame((_, delta) => {
    if (active && isPlaying) phase.current += delta * (0.1 + speed / 320);
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = active;
      if (!active) return;
      mesh.position.copy(curve.getPoint((phase.current + index / count) % 1));
      const material = mesh.material as MeshStandardMaterial;
      material.emissiveIntensity = isPlaying ? 0.22 : 0.06;
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      ))}
    </>
  );
}

const clearWaterPath: Array<[number, number, number]> = [
  [-1.55, 2.45, -2.0],
  [-1.52, 2.15, -1.6],
  [-1.45, 2.05, 0.2],
  [-1.42, 1.82, 1.25],
];

const detergentPath: Array<[number, number, number]> = [
  [-1.42, 1.82, 1.25],
  [-1.05, 1.45, 1.08],
  [-0.72, 1.2, 0.78],
  [-0.35, 1.05, 0.52],
  [0, 1.02, 0.35],
];

const pressurePath: Array<[number, number, number]> = [
  [1.22, -0.72, 0.55],
  [1.55, -0.2, 0.08],
  [1.62, 1.1, -0.8],
  [1.45, 2.0, -1.45],
];

/** 排水始终从外筒最低点进入前下方泵体，避免软管横穿筒体和机壳。 */
const sumpPath: Array<[number, number, number]> = [
  [0, -1.48, 0.15],
  [-0.2, -1.62, 0.35],
  [-0.52, -1.78, 0.62],
  [-0.9, -1.9, 0.82],
  [-1.25, -1.9, 1.0],
];

const pumpOutletPath: Array<[number, number, number]> = [
  [-1.25, -1.9, 1.0],
  [-1.62, -1.82, 0.72],
  [-1.9, -1.42, 0.1],
  [-2.0, -0.45, -0.78],
  [-1.95, 0.55, -1.45],
  [-1.88, 1.38, -2.05],
  [-2.38, 1.52, -2.3],
];

export function WaterSystemAssembly({
  mode,
  assemblyEnabled,
  isPlaying,
  speed,
  waterLevel,
}: WaterSystemAssemblyProps) {
  const showInlet = assemblyEnabled || mode === WashingMachineMode.WashWaterPath;
  const showDrain = assemblyEnabled || mode === WashingMachineMode.DrainPath;
  const showPressure = showInlet;

  return (
    <group>
      {showInlet && (
        <>
          <ExplodablePart
            id="wm-inlet-valve"
            home={[-1.55, 2.15, -1.62]}
            exploded={[-3.8, 3.35, -2.8]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.55}
          >
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.56, 0.62]} />
              <meshStandardMaterial color="#4e686d" metalness={0.28} roughness={0.34} />
            </mesh>
            {[-0.22, 0.22].map((x) => (
              <mesh key={x} position={[x, 0.38, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.34, 20]} />
                <meshStandardMaterial color="#71868a" metalness={0.42} roughness={0.3} />
              </mesh>
            ))}
          </ExplodablePart>

          <ExplodablePart
            id="wm-dispenser"
            home={[-1.42, 1.78, 1.18]}
            exploded={[-3.75, 2.75, 3.3]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.82}
          >
            <mesh castShadow>
              <boxGeometry args={[1.25, 0.62, 1.4]} />
              <meshStandardMaterial color="#cbd4d0" roughness={0.42} />
            </mesh>
            {[-0.35, 0, 0.35].map((x) => (
              <mesh key={x} position={[x, 0.08, 0.1]}>
                <boxGeometry args={[0.3, 0.42, 1.08]} />
                <meshStandardMaterial color="#e8ebe6" roughness={0.45} />
              </mesh>
            ))}
          </ExplodablePart>

          <ExplodablePart
            id="wm-inlet-hose"
            home={[0, 0, 0]}
            exploded={[-3.1, 1.2, 0.3]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.7}
          >
            <TubePath points={detergentPath} color="#7d9f9f" radius={0.12} opacity={0.92} />
          </ExplodablePart>

          {!assemblyEnabled && (
            <>
              <TubePath points={clearWaterPath} color="#79b9d1" radius={0.04} opacity={0.78} />
              <TubePath points={detergentPath} color="#8ebfc2" radius={0.05} opacity={0.82} />
              <AnimatedFlow points={clearWaterPath} color="#79b9d1" active isPlaying={isPlaying} speed={speed} count={8} />
              <AnimatedFlow points={detergentPath} color="#8ebfc2" active isPlaying={isPlaying} speed={speed} count={9} />
              <mesh position={[0, -1.18 + waterLevel * 0.006, 0.15]}>
                <boxGeometry args={[2.85, 0.18 + waterLevel * 0.008, 2.45]} />
                <meshPhysicalMaterial color="#78aebe" transparent opacity={0.18} transmission={0.25} depthWrite={false} roughness={0.2} />
              </mesh>
            </>
          )}
        </>
      )}

      {showPressure && (
        <>
          <ExplodablePart
            id="wm-pressure-sensor"
            home={[1.45, 2.0, -1.42]}
            exploded={[3.75, 3.2, -2.75]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.48}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.32, 36]} />
              <meshStandardMaterial color="#5f7478" metalness={0.28} roughness={0.36} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
              <meshStandardMaterial color="#8e9b99" roughness={0.4} />
            </mesh>
          </ExplodablePart>

          <ExplodablePart
            id="wm-pressure-chamber"
            home={[0, 0, 0]}
            exploded={[3.2, -0.7, 1.0]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.62}
          >
            <mesh position={[1.22, -0.74, 0.55]} castShadow>
              <cylinderGeometry args={[0.2, 0.28, 0.66, 28]} />
              <meshStandardMaterial color="#7b8d8b" roughness={0.48} />
            </mesh>
            <TubePath points={pressurePath} color="#a48db5" radius={0.023} opacity={0.86} />
          </ExplodablePart>
        </>
      )}

      {showDrain && (
        <>
          <ExplodablePart
            id="wm-drain-filter"
            home={[-1.58, -1.92, 2.03]}
            exploded={[-3.8, -2.0, 4.1]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.42}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.38, 36]} />
              <meshStandardMaterial color="#776f61" metalness={0.22} roughness={0.42} />
            </mesh>
          </ExplodablePart>

          <ExplodablePart
            id="wm-drain-pump"
            home={[-1.25, -1.9, 1.0]}
            exploded={[-3.55, -2.2, 3.1]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.55}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.56, 36]} />
              <meshStandardMaterial color="#40595e" metalness={0.4} roughness={0.32} />
            </mesh>
            <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.62, 22]} />
              <meshStandardMaterial color="#657a7d" metalness={0.34} roughness={0.36} />
            </mesh>
          </ExplodablePart>

          <ExplodablePart
            id="wm-sump-hose"
            home={[0, 0, 0]}
            exploded={[-2.65, -1.72, 0.7]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.6}
          >
            <TubePath points={sumpPath} color="#6f8588" radius={0.13} opacity={0.94} />
          </ExplodablePart>

          <ExplodablePart
            id="wm-drain-hose"
            home={[0, 0, 0]}
            exploded={[-3.7, 0.35, -2.2]}
            assemblyEnabled={assemblyEnabled}
            selectionRadius={0.65}
          >
            <TubePath points={pumpOutletPath} color="#667d82" radius={0.095} opacity={0.94} />
          </ExplodablePart>

          {!assemblyEnabled && (
            <>
              <TubePath points={sumpPath} color="#547f9c" radius={0.04} opacity={0.88} />
              <TubePath points={pumpOutletPath} color="#547f9c" radius={0.04} opacity={0.88} />
              <AnimatedFlow points={sumpPath} color="#547f9c" active isPlaying={isPlaying} speed={speed} count={8} />
              <AnimatedFlow points={pumpOutletPath} color="#547f9c" active isPlaying={isPlaying} speed={speed} count={12} />
              <mesh position={[-1.45, -1.77, 1.18]}>
                <sphereGeometry args={[0.09, 14, 10]} />
                <meshStandardMaterial color="#a48b64" roughness={0.48} />
              </mesh>
            </>
          )}
        </>
      )}
    </group>
  );
}
