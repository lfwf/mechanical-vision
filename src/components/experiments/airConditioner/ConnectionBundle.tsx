import { SceneLabel } from "../ExperimentCanvas";
import { TubePath } from "../ScenePrimitives";

export const GAS_LINE_PATH: Array<[number, number, number]> = [
  [-1.12, 0.58, -0.48],
  [-0.5, 0.28, -0.62],
  [0.8, -0.05, -0.72],
  [2.6, -0.45, -0.68],
  [4.7, -0.78, -0.25],
  [6.35, -0.83, 0.18],
  [6.65, -0.78, 0.28],
];

export const LIQUID_LINE_PATH: Array<[number, number, number]> = [
  [-1.0, 0.67, -0.6],
  [-0.42, 0.37, -0.74],
  [0.9, 0.05, -0.84],
  [2.65, -0.37, -0.8],
  [4.75, -0.68, -0.36],
  [6.28, -0.68, 0.08],
  [6.55, -0.63, 0.2],
];

export const DRAIN_LINE_PATH: Array<[number, number, number]> = [
  [-1.36, 0.3, 0.09],
  [-0.62, 0.04, -0.08],
  [0.75, -0.32, -0.24],
  [2.55, -0.72, -0.22],
  [4.15, -1.08, 0.04],
  [5.3, -1.46, 0.34],
];

export const COMMUNICATION_LINE_PATH: Array<[number, number, number]> = [
  [-0.98, 0.44, -0.18],
  [-0.18, 0.08, -0.32],
  [1.3, -0.2, -0.44],
  [2.9, -0.48, -0.38],
  [4.65, -0.58, -0.05],
  [5.65, 0.38, 0],
  [5.8, 0.9, -0.05],
];

const WRAPPED_SECTION: Array<[number, number, number]> = [
  [-0.45, 0.18, -0.5],
  [0.8, -0.12, -0.62],
  [2.55, -0.5, -0.57],
  [4.45, -0.77, -0.2],
  [5.25, -0.78, 0.04],
];

function HexNut({ position, radius }: { position: [number, number, number]; radius: number }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, 0.18, 6]} />
      <meshStandardMaterial color="#bd8740" metalness={0.72} roughness={0.22} />
    </mesh>
  );
}

function BundleClamp({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[0.18, 0.026, 10, 36]} />
        <meshStandardMaterial color="#9da6a2" metalness={0.46} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.21, 0]}>
        <boxGeometry args={[0.12, 0.2, 0.08]} />
        <meshStandardMaterial color="#7d8985" metalness={0.5} roughness={0.29} />
      </mesh>
    </group>
  );
}

export function ConnectionBundle({ variant }: { variant: number }) {
  const showRefrigerantLabels = variant === 0 || variant === 3;
  const showDrainLabel = variant === 2 || variant === 3;
  const showCableLabel = variant === 3;
  const wrapOpacity = variant === 3 ? 0.12 : variant === 0 ? 0.18 : 0.28;

  return (
    <group>
      <TubePath points={WRAPPED_SECTION} color="#ece9df" radius={0.2} opacity={wrapOpacity} />

      <TubePath points={GAS_LINE_PATH} color="#3e4948" radius={0.105} />
      <TubePath points={LIQUID_LINE_PATH} color="#596361" radius={0.073} />
      <TubePath points={DRAIN_LINE_PATH} color="#d5ddd8" radius={0.08} opacity={0.94} />
      <TubePath points={COMMUNICATION_LINE_PATH} color="#2b3435" radius={0.034} />
      <TubePath points={COMMUNICATION_LINE_PATH.map(([x, y, z]) => [x, y + 0.035, z + 0.028] as [number, number, number])} color="#d2b64e" radius={0.013} />

      <TubePath points={[[-1.12, 0.58, -0.48], [-0.86, 0.47, -0.55], [-0.6, 0.34, -0.6]]} color="#b57031" radius={0.061} />
      <TubePath points={[[-1.0, 0.67, -0.6], [-0.78, 0.56, -0.67], [-0.55, 0.43, -0.72]]} color="#b57031" radius={0.039} />
      <TubePath points={[[6.18, -0.84, 0.12], [6.42, -0.82, 0.2], [6.65, -0.78, 0.28]]} color="#b57031" radius={0.061} />
      <TubePath points={[[6.08, -0.72, 0.02], [6.34, -0.68, 0.12], [6.55, -0.63, 0.2]]} color="#b57031" radius={0.039} />

      <HexNut position={[-1.08, 0.59, -0.49]} radius={0.12} />
      <HexNut position={[-0.97, 0.68, -0.6]} radius={0.085} />
      <HexNut position={[6.62, -0.78, 0.27]} radius={0.12} />
      <HexNut position={[6.52, -0.63, 0.19]} radius={0.085} />

      <BundleClamp position={[0.82, -0.11, -0.61]} rotation={[0.12, 0.18, -0.08]} />
      <BundleClamp position={[2.62, -0.5, -0.56]} rotation={[0.08, 0.18, -0.06]} />
      <BundleClamp position={[4.46, -0.77, -0.19]} rotation={[0.04, 0.12, -0.03]} />

      <mesh position={[5.32, -1.48, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.14, 24]} />
        <meshStandardMaterial color="#859a94" roughness={0.44} />
      </mesh>

      {showRefrigerantLabels && <SceneLabel position={[1.55, 0.48, -0.82]}>粗气管（低压回气） / 细液管（高压液体）</SceneLabel>}
      {showDrainLabel && <SceneLabel position={[2.15, -1.05, -0.52]}>冷凝水排水管：从接水盘出口持续向下排放</SceneLabel>}
      {showCableLabel && <SceneLabel position={[4.25, 0.05, -0.22]}>室内外电源与通信线</SceneLabel>}
    </group>
  );
}
