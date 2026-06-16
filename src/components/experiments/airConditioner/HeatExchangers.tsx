/**
 * 室内外换热器的程序化几何体。
 *
 * 换热器由两类重复结构组成：
 * - 铝翅片：增加与空气接触的表面积；
 * - 铜管：制冷剂在管内流动并与翅片换热。
 *
 * 这里为了网页性能只建立教学级数量，不等同于实机真实翅片片数和管排数。
 */

/** 通用平面翅片盘管，可供其他实验复用。 */
export function FinCoil({
  width,
  height,
  depth = 0.34,
  rows = 9,
  fins = 28,
  color = "#94babc",
  rotation = [0, 0, 0],
}: {
  width: number;
  height: number;
  depth?: number;
  rows?: number;
  fins?: number;
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <group rotation={rotation}>
      {/* 沿 X 方向均匀排列铝翅片。 */}
      {Array.from({ length: fins }, (_, index) => (
        <mesh key={`fin-${index}`} position={[-width / 2 + (index * width) / Math.max(1, fins - 1), 0, 0]} castShadow>
          <boxGeometry args={[0.018, height, depth]} />
          <meshStandardMaterial color={color} metalness={0.42} roughness={0.31} transparent opacity={0.86} />
        </mesh>
      ))}

      {/* 铜管沿宽度方向横穿翅片。 */}
      {Array.from({ length: rows }, (_, row) => {
        const y = -height / 2 + 0.12 + (row * (height - 0.24)) / Math.max(1, rows - 1);
        return (
          <mesh key={`tube-${row}`} position={[0, y, depth * 0.23]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.031, 0.031, width + 0.1, 12]} />
            <meshStandardMaterial color="#b87938" metalness={0.75} roughness={0.22} />
          </mesh>
        );
      })}
    </group>
  );
}

/** 室内蒸发器的一块翅片盘管面。 */
function IndoorCoilFace({ width, height, depth, fins, rows, color }: { width: number; height: number; depth: number; fins: number; rows: number; color: string }) {
  const rowPositions = Array.from(
    { length: rows },
    (_, row) => -height / 2 + 0.1 + (row * (height - 0.2)) / Math.max(1, rows - 1),
  );

  return (
    <group>
      {Array.from({ length: fins }, (_, index) => (
        <mesh key={`indoor-fin-${index}`} position={[-width / 2 + (index * width) / Math.max(1, fins - 1), 0, 0]} castShadow>
          <boxGeometry args={[0.014, height, depth]} />
          <meshStandardMaterial color={color} metalness={0.46} roughness={0.3} transparent opacity={0.9} />
        </mesh>
      ))}

      {rowPositions.map((y, row) => (
        <mesh key={`indoor-tube-${row}`} position={[0, y, depth * 0.22]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, width + 0.08, 12]} />
          <meshStandardMaterial color="#b67534" metalness={0.8} roughness={0.19} />
        </mesh>
      ))}

      {/* 上下边框固定翅片盘管。 */}
      <mesh position={[0, height / 2 + 0.035, 0]}>
        <boxGeometry args={[width + 0.08, 0.06, depth + 0.04]} />
        <meshStandardMaterial color="#778783" metalness={0.52} roughness={0.3} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.035, 0]}>
        <boxGeometry args={[width + 0.08, 0.06, depth + 0.04]} />
        <meshStandardMaterial color="#778783" metalness={0.52} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * 室内机三段折弯蒸发器。
 * 三块盘管以不同角度包覆在贯流风轮上方，增加有限机身深度内的换热面积。
 */
export function IndoorHeatExchanger() {
  return (
    <group>
      {/* 前上段。 */}
      <group position={[0, 0.14, 0.18]} rotation={[0.2, 0, 0]}>
        <IndoorCoilFace width={5.02} height={0.78} depth={0.28} fins={58} rows={6} color="#8fb3b7" />
      </group>

      {/* 后上段。 */}
      <group position={[0, 0.44, -0.34]} rotation={[-0.58, 0, 0]}>
        <IndoorCoilFace width={5.02} height={0.78} depth={0.28} fins={58} rows={6} color="#9abcbf" />
      </group>

      {/* 后下段。 */}
      <group position={[0, -0.08, -0.38]} rotation={[0.64, 0, 0]}>
        <IndoorCoilFace width={5.02} height={0.58} depth={0.24} fins={58} rows={5} color="#88acb0" />
      </group>

      {/* 右侧集管。 */}
      <mesh position={[2.58, 0.24, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 1.34, 20]} />
        <meshStandardMaterial color="#b67534" metalness={0.8} roughness={0.19} />
      </mesh>

      {/* 铜管 U 形回弯，表示相邻管排串联。 */}
      {[-0.38, -0.16, 0.08, 0.32, 0.54].map((y, index) => (
        <mesh key={y} position={[2.65, y, -0.02 + index * 0.025]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <torusGeometry args={[0.11, 0.024, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#b67534" metalness={0.8} roughness={0.19} />
        </mesh>
      ))}

      {/* 左侧辅助集管。 */}
      <mesh position={[-2.58, 0.16, -0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 20]} />
        <meshStandardMaterial color="#a96c31" metalness={0.78} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** 室外冷凝器的一块盘管面。 */
function OutdoorCoilFace({ width, height, depth, fins, rows }: { width: number; height: number; depth: number; fins: number; rows: number }) {
  const rowPositions = Array.from(
    { length: rows },
    (_, row) => -height / 2 + 0.16 + (row * (height - 0.32)) / Math.max(1, rows - 1),
  );

  return (
    <group>
      {Array.from({ length: fins }, (_, index) => (
        <mesh key={`outdoor-fin-${index}`} position={[-width / 2 + (index * width) / Math.max(1, fins - 1), 0, 0]} castShadow>
          <boxGeometry args={[0.012, height, depth]} />
          <meshStandardMaterial color="#78999e" metalness={0.5} roughness={0.3} transparent opacity={0.9} />
        </mesh>
      ))}

      {rowPositions.map((y, row) => (
        <mesh key={`outdoor-tube-${row}`} position={[0, y, depth * 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.027, 0.027, width + 0.12, 14]} />
          <meshStandardMaterial color="#b46f2f" metalness={0.82} roughness={0.18} />
        </mesh>
      ))}

      {/* 只画部分 U 形回弯，控制几何体数量。 */}
      {rowPositions.slice(0, -1).filter((_, index) => index % 2 === 0).map((y, index) => (
        <mesh key={`return-bend-${index}`} position={[width / 2 + 0.07, y + (rowPositions[1] - rowPositions[0]) / 2, depth * 0.18]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <torusGeometry args={[(rowPositions[1] - rowPositions[0]) / 2, 0.027, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#b46f2f" metalness={0.82} roughness={0.18} />
        </mesh>
      ))}

      <mesh position={[0, height / 2 + 0.045, 0]}>
        <boxGeometry args={[width + 0.12, 0.08, depth + 0.05]} />
        <meshStandardMaterial color="#748481" metalness={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.045, 0]}>
        <boxGeometry args={[width + 0.12, 0.08, depth + 0.05]} />
        <meshStandardMaterial color="#748481" metalness={0.55} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * 室外机 L 形冷凝器。
 * 后侧大盘管和左侧小盘管形成 L 形，空气可从后方和左侧进入。
 */
export function OutdoorHeatExchanger() {
  return (
    <group>
      <group position={[0.02, 0, -0.66]}>
        <OutdoorCoilFace width={4.22} height={2.94} depth={0.22} fins={58} rows={12} />
      </group>
      <group position={[-2.08, 0, -0.03]} rotation={[0, Math.PI / 2, 0]}>
        <OutdoorCoilFace width={1.42} height={2.94} depth={0.22} fins={22} rows={12} />
      </group>

      {/* 两侧钣金端板固定换热器。 */}
      <mesh position={[-1.98, 0, 0.67]}>
        <boxGeometry args={[0.14, 2.95, 0.12]} />
        <meshStandardMaterial color="#778784" metalness={0.52} roughness={0.31} />
      </mesh>
      <mesh position={[2.13, 0, -0.58]}>
        <boxGeometry args={[0.12, 2.95, 0.14]} />
        <meshStandardMaterial color="#778784" metalness={0.52} roughness={0.31} />
      </mesh>
    </group>
  );
}
