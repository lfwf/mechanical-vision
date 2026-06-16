import { RoundedBox } from "@react-three/drei";
import { TubePath } from "../ScenePrimitives";

/**
 * 室外机低层级零件几何体。
 *
 * OutdoorUnit.tsx 负责零件装配位置，本文件只负责零件自身形状和材质。
 * 尺寸均为场景单位下的比例化表达，不可直接作为维修测量尺寸。
 */
const CASING = "#eeefeb";
const CASING_EDGE = "#d8ddd9";
const STEEL = "#7f8b88";
const DARK_STEEL = "#4c5957";
const COPPER = "#b66f2f";

/** 两条室外机安装脚，包含橡胶减振垫和固定螺栓。 */
export function OutdoorMountingFeet() {
  return (
    <group>
      {[-1.45, 1.45].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <RoundedBox args={[0.72, 0.16, 1.48]} radius={0.045} smoothness={3} castShadow>
            <meshStandardMaterial color="#596663" metalness={0.55} roughness={0.32} />
          </RoundedBox>
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.58, 0.09, 1.28]} />
            <meshStandardMaterial color="#252d2c" roughness={0.82} />
          </mesh>
          {[-0.48, 0.48].map((z) => (
            <mesh key={z} position={[0, 0.12, z]}>
              <cylinderGeometry args={[0.065, 0.065, 0.16, 18]} />
              <meshStandardMaterial color="#8d9793" metalness={0.85} roughness={0.18} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** 室外机底盘、边缘翻边、舱室隔板和排水孔。 */
export function OutdoorBasePan() {
  return (
    <group>
      <RoundedBox args={[4.58, 0.22, 1.78]} radius={0.07} smoothness={3} receiveShadow>
        <meshStandardMaterial color="#687572" metalness={0.54} roughness={0.31} />
      </RoundedBox>
      <mesh position={[0, 0.16, -0.77]}><boxGeometry args={[4.42, 0.28, 0.08]} /><meshStandardMaterial color={STEEL} metalness={0.54} roughness={0.31} /></mesh>
      <mesh position={[-2.15, 0.16, 0]}><boxGeometry args={[0.08, 0.28, 1.55]} /><meshStandardMaterial color={STEEL} metalness={0.54} roughness={0.31} /></mesh>
      <mesh position={[2.15, 0.16, 0]}><boxGeometry args={[0.08, 0.28, 1.55]} /><meshStandardMaterial color={STEEL} metalness={0.54} roughness={0.31} /></mesh>
      <mesh position={[0.66, 0.58, 0]}><boxGeometry args={[0.08, 1.05, 1.55]} /><meshStandardMaterial color="#909a97" metalness={0.58} roughness={0.29} /></mesh>
      <mesh position={[-0.72, 0.14, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 24]} />
        <meshStandardMaterial color="#2f3b39" metalness={0.32} roughness={0.38} />
      </mesh>
    </group>
  );
}

/** 轴流风扇电机、三臂支架、导风圈和电机线束。 */
export function OutdoorFanMotorAssembly() {
  return (
    <group>
      <mesh position={[0, 0, -0.23]}>
        <torusGeometry args={[1.31, 0.09, 18, 96]} />
        <meshStandardMaterial color="#65716f" metalness={0.5} roughness={0.31} />
      </mesh>
      {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle) => (
        <mesh key={angle} position={[Math.cos(angle) * 0.69, Math.sin(angle) * 0.69, -0.28]} rotation={[0, 0, angle]}>
          <boxGeometry args={[1.35, 0.09, 0.08]} />
          <meshStandardMaterial color="#737f7c" metalness={0.55} roughness={0.29} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.4, 0.62, 48]} />
        <meshStandardMaterial color="#354749" metalness={0.64} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.58, 20]} />
        <meshStandardMaterial color="#a3aba7" metalness={0.86} roughness={0.16} />
      </mesh>
      <TubePath points={[[0.2, -0.18, -0.48], [0.58, -0.45, -0.58], [1.06, -0.52, -0.5]]} color="#2f3838" radius={0.025} />
    </group>
  );
}

/**
 * 全封闭变频压缩机。
 * 上部铜管为排气管，下部较粗铜管为吸气管，底部四个橡胶脚用于减振。
 */
export function OutdoorCompressor() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.59, 0.67, 1.62, 56]} />
        <meshPhysicalMaterial color="#172426" metalness={0.6} roughness={0.22} clearcoat={0.18} />
      </mesh>
      <mesh position={[0, 0.89, 0]}>
        <sphereGeometry args={[0.53, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#1d2e31" metalness={0.58} roughness={0.23} clearcoat={0.18} />
      </mesh>
      <mesh position={[0, -0.86, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.12, 48]} />
        <meshStandardMaterial color="#263638" metalness={0.58} roughness={0.26} />
      </mesh>
      <mesh position={[0.48, 0.22, 0.08]} castShadow>
        <boxGeometry args={[0.28, 0.42, 0.24]} />
        <meshStandardMaterial color="#11191a" metalness={0.2} roughness={0.38} />
      </mesh>
      <TubePath points={[[0.05, 0.82, -0.08], [0.3, 1.12, -0.12], [0.72, 1.18, -0.18]]} color={COPPER} radius={0.055} />
      <TubePath points={[[-0.22, 0.56, -0.08], [-0.58, 0.78, -0.18], [-0.82, 0.72, -0.34]]} color={COPPER} radius={0.075} />
      {[-0.42, 0.42].flatMap((x) => [-0.34, 0.34].map((z) => (
        <group key={`${x}-${z}`} position={[x, -0.95, z]}>
          <mesh><cylinderGeometry args={[0.12, 0.15, 0.18, 20]} /><meshStandardMaterial color="#222a29" roughness={0.82} /></mesh>
          <mesh position={[0, -0.11, 0]}><cylinderGeometry args={[0.09, 0.09, 0.06, 18]} /><meshStandardMaterial color="#57615e" metalness={0.65} roughness={0.25} /></mesh>
        </group>
      )))}
    </group>
  );
}

/** 逆变电控盒、PCB、功率器件和出线。 */
export function OutdoorControlAssembly() {
  return (
    <group>
      <RoundedBox args={[1.28, 0.96, 0.72]} radius={0.06} smoothness={3} castShadow>
        <meshStandardMaterial color="#bfc7c3" metalness={0.45} roughness={0.31} />
      </RoundedBox>
      <mesh position={[0, 0, 0.38]}><boxGeometry args={[1.08, 0.77, 0.045]} /><meshStandardMaterial color="#468d62" metalness={0.12} roughness={0.45} /></mesh>
      {[-0.38, -0.12, 0.18, 0.4].map((x, index) => (
        <mesh key={x} position={[x, index % 2 === 0 ? 0.2 : -0.14, 0.43]} castShadow>
          <boxGeometry args={[index === 0 ? 0.2 : 0.13, index === 0 ? 0.28 : 0.16, 0.12]} />
          <meshStandardMaterial color={index === 0 ? "#20282a" : index === 1 ? "#d6b75d" : "#2f3b3c"} metalness={0.28} roughness={0.34} />
        </mesh>
      ))}
      <mesh position={[0.48, 0.05, 0.44]}><boxGeometry args={[0.14, 0.64, 0.1]} /><meshStandardMaterial color="#a7aaa0" metalness={0.65} roughness={0.24} /></mesh>
      <TubePath points={[[-0.54, -0.42, 0.24], [-0.5, -0.72, 0.08], [-0.25, -0.94, -0.04]]} color="#252d2e" radius={0.022} />
    </group>
  );
}

/**
 * 早期版本的完整室外机钣金外壳。
 * 当前拆装模式主要使用 CutawayShellGeometry 中的 OutdoorCabinetPanelsCutaway，
 * 该组件保留作为不带轮廓线的基础版本。
 */
export function OutdoorCabinetPanels({ opacity }: { opacity: number }) {
  const transparent = opacity < 0.98;
  return (
    <group>
      <RoundedBox args={[4.64, 0.18, 1.78]} radius={0.09} smoothness={4} position={[0, 1.66, 0]} castShadow>
        <meshPhysicalMaterial color={CASING} roughness={0.31} metalness={0.1} clearcoat={0.22} transparent={transparent} opacity={opacity} />
      </RoundedBox>
      <mesh position={[2.23, 0, -0.02]} castShadow>
        <boxGeometry args={[0.16, 3.18, 1.68]} />
        <meshPhysicalMaterial color={CASING} roughness={0.33} metalness={0.12} clearcoat={0.18} transparent={transparent} opacity={opacity} />
      </mesh>
      <RoundedBox args={[1.36, 2.94, 0.16]} radius={0.07} smoothness={3} position={[1.53, 0, 0.88]} castShadow>
        <meshPhysicalMaterial color={CASING} roughness={0.32} metalness={0.1} clearcoat={0.2} transparent={transparent} opacity={opacity} />
      </RoundedBox>
      {[-0.72, -0.36, 0, 0.36, 0.72].map((y) => (
        <mesh key={y} position={[1.62, y - 0.12, 0.98]}>
          <boxGeometry args={[0.86, 0.045, 0.035]} />
          <meshStandardMaterial color={CASING_EDGE} metalness={0.18} roughness={0.34} transparent={transparent} opacity={opacity} />
        </mesh>
      ))}
      <group position={[1.52, 0.95, 0.99]}>
        <mesh position={[-0.22, 0.03, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.42, 0.14, 0.025]} /><meshStandardMaterial color="#2d9fc1" roughness={0.28} /></mesh>
        <mesh position={[0.12, 0.03, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.28, 0.14, 0.026]} /><meshStandardMaterial color="#1d6f91" roughness={0.28} /></mesh>
      </group>
      <RoundedBox args={[0.92, 1.32, 0.08]} radius={0.05} smoothness={3} position={[2.32, -0.45, 0.18]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <meshStandardMaterial color="#e5e8e4" metalness={0.14} roughness={0.35} transparent={transparent} opacity={opacity} />
      </RoundedBox>
      <mesh position={[0.66, 0, -0.02]}><boxGeometry args={[0.07, 3.1, 1.6]} /><meshStandardMaterial color="#8d9794" metalness={0.55} roughness={0.29} /></mesh>
      <mesh position={[-2.22, 0, 0]}><boxGeometry args={[0.09, 3.05, 1.66]} /><meshStandardMaterial color="#d4d9d5" metalness={0.2} roughness={0.35} transparent opacity={Math.max(0.3, opacity * 0.8)} /></mesh>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={index} position={[-2.28, -1.18 + index * 0.34, 0]}>
          <boxGeometry args={[0.035, 0.12, 1.38]} />
          <meshStandardMaterial color="#aeb7b3" metalness={0.28} roughness={0.33} />
        </mesh>
      ))}
    </group>
  );
}

/** 四通阀、压缩机和服务阀之间的简化铜管连接。 */
export function OutdoorValvePiping() {
  return (
    <group>
      <TubePath points={[[-0.45, -0.34, -0.2], [-0.18, -0.6, -0.32], [0.18, -0.72, -0.26], [0.5, -0.58, -0.08]]} color={COPPER} radius={0.055} />
      <TubePath points={[[0.12, 0.26, -0.12], [0.52, 0.48, -0.18], [0.78, 0.3, -0.28], [0.9, -0.12, -0.3]]} color={COPPER} radius={0.045} />
      <TubePath points={[[0.5, -0.58, -0.08], [0.88, -0.76, 0.08], [1.18, -0.78, 0.24]]} color={COPPER} radius={0.07} />
      <mesh position={[0.78, -0.38, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.42, 24]} />
        <meshStandardMaterial color={DARK_STEEL} metalness={0.52} roughness={0.28} />
      </mesh>
    </group>
  );
}
