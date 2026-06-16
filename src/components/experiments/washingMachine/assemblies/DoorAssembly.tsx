import { WashingMachineMode } from "../../../../data/experiments/washingMachineModes";
import { ExplodablePart } from "../../ExplodablePart";

interface DoorAssemblyProps {
  mode: WashingMachineMode;
  assemblyEnabled: boolean;
}

/**
 * 门组件沿 Z 轴布置。
 * 门封外唇连接前面板，内唇连接外筒前口；两个卡箍分别压紧两侧安装槽。
 */
export function DoorAssembly({ mode, assemblyEnabled }: DoorAssemblyProps) {
  const visible =
    assemblyEnabled ||
    mode === WashingMachineMode.WashWaterPath ||
    mode === WashingMachineMode.SpinSuspension;

  if (!visible) return null;

  return (
    <group>
      <ExplodablePart
        id="wm-door"
        home={[0, 0.25, 2.38]}
        exploded={[-3.35, 0.25, 5.15]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={1.15}
      >
        <mesh castShadow>
          <torusGeometry args={[1.12, 0.18, 28, 72]} />
          <meshStandardMaterial color="#53666a" metalness={0.38} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.035]}>
          <circleGeometry args={[0.94, 64]} />
          <meshPhysicalMaterial
            color="#8eb2b9"
            transparent
            opacity={0.28}
            transmission={0.72}
            roughness={0.2}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[-1.18, 0, -0.02]} castShadow>
          <boxGeometry args={[0.26, 0.48, 0.2]} />
          <meshStandardMaterial color="#4a5d61" metalness={0.5} roughness={0.28} />
        </mesh>
        <mesh position={[1.16, 0, -0.03]} castShadow>
          <boxGeometry args={[0.18, 0.34, 0.16]} />
          <meshStandardMaterial color="#9ba5a2" metalness={0.5} roughness={0.28} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart
        id="wm-bellow-outer-clamp"
        home={[0, 0.25, 2.16]}
        exploded={[0, 0.25, 4.95]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={1.05}
      >
        <mesh>
          <torusGeometry args={[1.17, 0.022, 10, 72]} />
          <meshStandardMaterial color="#9ba6a4" metalness={0.76} roughness={0.2} />
        </mesh>
        <mesh position={[1.12, -0.16, 0]}>
          <boxGeometry args={[0.16, 0.09, 0.07]} />
          <meshStandardMaterial color="#7b8785" metalness={0.76} roughness={0.22} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart
        id="wm-door-lock"
        home={[1.35, 0.25, 2.02]}
        exploded={[3.2, 0.25, 4.25]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={0.3}
      >
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.56, 0.3]} />
          <meshStandardMaterial color="#52676b" metalness={0.28} roughness={0.35} />
        </mesh>
        <mesh position={[-0.11, 0, 0.17]}>
          <boxGeometry args={[0.1, 0.18, 0.14]} />
          <meshStandardMaterial color="#a4adaa" metalness={0.56} roughness={0.25} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart
        id="wm-bellow-inner-clamp"
        home={[0, 0.25, 1.71]}
        exploded={[2.8, 0.25, 3.85]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={1.16}
      >
        <mesh>
          <torusGeometry args={[1.21, 0.025, 10, 72]} />
          <meshStandardMaterial color="#87928f" metalness={0.72} roughness={0.24} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart
        id="wm-bellow"
        home={[0, 0.25, 1.91]}
        exploded={[3.3, 0.45, 3.45]}
        assemblyEnabled={assemblyEnabled}
        selectionRadius={1.18}
      >
        <mesh castShadow>
          <torusGeometry args={[1.16, 0.22, 28, 72]} />
          <meshStandardMaterial color="#697775" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0, -0.12]}>
          <torusGeometry args={[1.06, 0.08, 20, 72]} />
          <meshStandardMaterial color="#5e6d6b" roughness={0.62} />
        </mesh>
        <mesh position={[0, -1.08, 0.02]}>
          <torusGeometry args={[0.19, 0.04, 12, 36, Math.PI]} />
          <meshStandardMaterial color="#566563" roughness={0.55} />
        </mesh>
      </ExplodablePart>
    </group>
  );
}
