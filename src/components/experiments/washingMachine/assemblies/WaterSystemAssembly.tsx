import { RoundedBox } from "@react-three/drei";
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

function AnimatedFlow({ points, color, active, isPlaying, speed, count = 10 }: { points: Array<[number, number, number]>; color: string; active: boolean; isPlaying: boolean; speed: number; count?: number }) {
  const refs = useRef<Array<Mesh | null>>([]);
  const phase = useRef(0);
  const curve = useMemo(() => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal"), [points]);

  useFrame((_, delta) => {
    if (active && isPlaying) phase.current += delta * (0.1 + speed / 320);
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = active;
      if (!active) return;
      mesh.position.copy(curve.getPoint((phase.current + index / count) % 1));
      (mesh.material as MeshStandardMaterial).emissiveIntensity = isPlaying ? 0.22 : 0.06;
    });
  });

  return <>{Array.from({ length: count }, (_, index) => <mesh key={index} ref={(mesh) => { refs.current[index] = mesh; }}><sphereGeometry args={[0.045, 10, 8]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} /></mesh>)}</>;
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

/** 外筒最低点到泵体的集水波纹管，全部位于筒体下方。 */
const sumpPath: Array<[number, number, number]> = [
  [0, -1.48, 0.12],
  [-0.18, -1.7, 0.28],
  [-0.46, -1.96, 0.5],
  [-0.82, -2.12, 0.72],
  [-1.18, -2.14, 0.9],
];

/** 泵后排水软管先贴底盘走向侧后方，再沿后壁上升并从机后引出。 */
const pumpOutletPath: Array<[number, number, number]> = [
  [-1.18, -2.14, 0.9],
  [-1.55, -2.12, 0.52],
  [-1.82, -2.02, 0.05],
  [-1.98, -1.78, -0.55],
  [-2.02, -1.1, -1.15],
  [-2.0, -0.1, -1.68],
  [-1.94, 0.88, -2.0],
  [-1.88, 1.5, -2.14],
  [-2.28, 1.58, -2.28],
];

function DrainPumpMount() {
  return (
    <group>
      <RoundedBox args={[1.42, 0.16, 1.0]} radius={0.06} smoothness={4} position={[-1.18, -2.42, 0.92]} castShadow>
        <meshStandardMaterial color="#5b6769" metalness={0.46} roughness={0.34} />
      </RoundedBox>
      {[-1.62, -0.74].map((x) => (
        <mesh key={x} position={[x, -2.3, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 18]} />
          <meshStandardMaterial color="#9aa3a1" metalness={0.7} roughness={0.22} />
        </mesh>
      ))}
      <RoundedBox args={[0.78, 0.62, 0.1]} radius={0.04} smoothness={4} position={[-1.58, -1.88, 2.02]} castShadow>
        <meshStandardMaterial color="#d7dbd7" metalness={0.12} roughness={0.42} />
      </RoundedBox>
    </group>
  );
}

export function WaterSystemAssembly({ mode, assemblyEnabled, isPlaying, speed, waterLevel }: WaterSystemAssemblyProps) {
  const showInlet = assemblyEnabled || mode === WashingMachineMode.WashWaterPath;
  const showDrain = assemblyEnabled || mode === WashingMachineMode.DrainPath;
  const showPressure = showInlet;

  return (
    <group>
      {showInlet && (
        <>
          <ExplodablePart id="wm-inlet-valve" home={[-1.55, 2.15, -1.62]} exploded={[-3.8, 3.35, -2.8]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
            <mesh castShadow><boxGeometry args={[0.9, 0.56, 0.62]} /><meshStandardMaterial color="#4e686d" metalness={0.28} roughness={0.34} /></mesh>
            {[-0.22, 0.22].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.11, 0.11, 0.34, 20]} /><meshStandardMaterial color="#71868a" metalness={0.42} roughness={0.3} /></mesh>)}
          </ExplodablePart>

          <ExplodablePart id="wm-dispenser" home={[-1.42, 1.78, 1.18]} exploded={[-3.75, 2.75, 3.3]} assemblyEnabled={assemblyEnabled} selectionRadius={0.82}>
            <RoundedBox args={[1.25, 0.62, 1.4]} radius={0.08} smoothness={5} castShadow><meshStandardMaterial color="#cbd4d0" roughness={0.42} /></RoundedBox>
            {[-0.35, 0, 0.35].map((x) => <mesh key={x} position={[x, 0.08, 0.1]}><boxGeometry args={[0.3, 0.42, 1.08]} /><meshStandardMaterial color="#e8ebe6" roughness={0.45} /></mesh>)}
          </ExplodablePart>

          <ExplodablePart id="wm-inlet-hose" home={[0, 0, 0]} exploded={[-3.1, 1.2, 0.3]} assemblyEnabled={assemblyEnabled} selectionRadius={0.7}>
            <TubePath points={detergentPath} color="#7d9f9f" radius={0.105} opacity={0.92} />
          </ExplodablePart>

          {!assemblyEnabled && (
            <>
              <TubePath points={clearWaterPath} color="#79b9d1" radius={0.04} opacity={0.78} />
              <TubePath points={detergentPath} color="#8ebfc2" radius={0.05} opacity={0.82} />
              <AnimatedFlow points={clearWaterPath} color="#79b9d1" active isPlaying={isPlaying} speed={speed} count={8} />
              <AnimatedFlow points={detergentPath} color="#8ebfc2" active isPlaying={isPlaying} speed={speed} count={9} />
              <mesh position={[0, -1.18 + waterLevel * 0.006, 0.15]}><boxGeometry args={[2.85, 0.18 + waterLevel * 0.008, 2.45]} /><meshPhysicalMaterial color="#78aebe" transparent opacity={0.18} transmission={0.25} depthWrite={false} roughness={0.2} /></mesh>
            </>
          )}
        </>
      )}

      {showPressure && (
        <>
          <ExplodablePart id="wm-pressure-sensor" home={[1.45, 2.0, -1.42]} exploded={[3.75, 3.2, -2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={0.48}>
            <mesh castShadow><cylinderGeometry args={[0.38, 0.38, 0.32, 36]} /><meshStandardMaterial color="#5f7478" metalness={0.28} roughness={0.36} /></mesh>
            <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.08, 0.08, 0.3, 16]} /><meshStandardMaterial color="#8e9b99" roughness={0.4} /></mesh>
          </ExplodablePart>
          <ExplodablePart id="wm-pressure-chamber" home={[0, 0, 0]} exploded={[3.2, -0.7, 1.0]} assemblyEnabled={assemblyEnabled} selectionRadius={0.62}>
            <mesh position={[1.22, -0.74, 0.55]} castShadow><cylinderGeometry args={[0.2, 0.28, 0.66, 28]} /><meshStandardMaterial color="#7b8d8b" roughness={0.48} /></mesh>
            <TubePath points={pressurePath} color="#a48db5" radius={0.023} opacity={0.86} />
          </ExplodablePart>
        </>
      )}

      {showDrain && (
        <>
          <DrainPumpMount />
          <ExplodablePart id="wm-drain-filter" home={[-1.58, -1.88, 2.08]} exploded={[-3.7, -1.95, 3.9]} assemblyEnabled={assemblyEnabled} selectionRadius={0.34}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.26, 0.26, 0.24, 36]} /><meshStandardMaterial color="#6f6b62" metalness={0.2} roughness={0.44} /></mesh>
            <mesh position={[0, 0, 0.13]}><torusGeometry args={[0.22, 0.025, 12, 36]} /><meshStandardMaterial color="#9b9588" roughness={0.4} /></mesh>
          </ExplodablePart>

          <ExplodablePart id="wm-drain-pump" home={[-1.18, -2.14, 0.9]} exploded={[-3.4, -2.25, 2.85]} assemblyEnabled={assemblyEnabled} selectionRadius={0.48}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.34, 0.34, 0.5, 40]} /><meshStandardMaterial color="#40595e" metalness={0.42} roughness={0.32} /></mesh>
            <mesh position={[0.38, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.105, 0.105, 0.5, 24]} /><meshStandardMaterial color="#657a7d" metalness={0.34} roughness={0.36} /></mesh>
            <mesh position={[-0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.13, 0.13, 0.22, 24]} /><meshStandardMaterial color="#566a6e" roughness={0.38} /></mesh>
          </ExplodablePart>

          <ExplodablePart id="wm-sump-hose" home={[0, 0, 0]} exploded={[-2.5, -1.75, 0.55]} assemblyEnabled={assemblyEnabled} selectionRadius={0.52}>
            <TubePath points={sumpPath} color="#6f8588" radius={0.12} opacity={0.94} />
          </ExplodablePart>

          <ExplodablePart id="wm-drain-hose" home={[0, 0, 0]} exploded={[-3.55, 0.2, -2.1]} assemblyEnabled={assemblyEnabled} selectionRadius={0.58}>
            <TubePath points={pumpOutletPath} color="#667d82" radius={0.085} opacity={0.94} />
          </ExplodablePart>

          {!assemblyEnabled && (
            <>
              <TubePath points={sumpPath} color="#547f9c" radius={0.037} opacity={0.88} />
              <TubePath points={pumpOutletPath} color="#547f9c" radius={0.037} opacity={0.88} />
              <AnimatedFlow points={sumpPath} color="#547f9c" active isPlaying={isPlaying} speed={speed} count={8} />
              <AnimatedFlow points={pumpOutletPath} color="#547f9c" active isPlaying={isPlaying} speed={speed} count={12} />
              <mesh position={[-1.42, -2.05, 1.04]}><sphereGeometry args={[0.075, 14, 10]} /><meshStandardMaterial color="#a48b64" roughness={0.48} /></mesh>
            </>
          )}
        </>
      )}
    </group>
  );
}
