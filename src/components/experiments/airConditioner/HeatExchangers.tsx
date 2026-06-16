export function FinCoil({ width, height, depth = 0.34, rows = 9, fins = 28, color = "#94babc", rotation = [0, 0, 0] }: { width: number; height: number; depth?: number; rows?: number; fins?: number; color?: string; rotation?: [number, number, number] }) {
  return (
    <group rotation={rotation}>
      {Array.from({ length: fins }, (_, index) => (
        <mesh key={`fin-${index}`} position={[-width / 2 + (index * width) / Math.max(1, fins - 1), 0, 0]} castShadow>
          <boxGeometry args={[0.018, height, depth]} />
          <meshStandardMaterial color={color} metalness={0.42} roughness={0.31} transparent opacity={0.86} />
        </mesh>
      ))}
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

function IndoorCoilFace({ width, height, depth, fins, rows, color }: { width: number; height: number; depth: number; fins: number; rows: number; color: string }) {
  const rowPositions = Array.from({ length: rows }, (_, row) => -height / 2 + 0.1 + (row * (height - 0.2)) / Math.max(1, rows - 1));
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
      <mesh position={[0, height / 2 + 0.035, 0]}><boxGeometry args={[width + 0.08, 0.06, depth + 0.04]} /><meshStandardMaterial color="#778783" metalness={0.52} roughness={0.3} /></mesh>
      <mesh position={[0, -height / 2 - 0.035, 0]}><boxGeometry args={[width + 0.08, 0.06, depth + 0.04]} /><meshStandardMaterial color="#778783" metalness={0.52} roughness={0.3} /></mesh>
    </group>
  );
}

export function IndoorHeatExchanger() {
  return (
    <group>
      <group position={[0, 0.14, 0.18]} rotation={[0.2, 0, 0]}>
        <IndoorCoilFace width={5.02} height={0.78} depth={0.28} fins={58} rows={6} color="#8fb3b7" />
      </group>
      <group position={[0, 0.44, -0.34]} rotation={[-0.58, 0, 0]}>
        <IndoorCoilFace width={5.02} height={0.78} depth={0.28} fins={58} rows={6} color="#9abcbf" />
      </group>
      <group position={[0, -0.08, -0.38]} rotation={[0.64, 0, 0]}>
        <IndoorCoilFace width={5.02} height={0.58} depth={0.24} fins={58} rows={5} color="#88acb0" />
      </group>
      <mesh position={[2.58, 0.24, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 1.34, 20]} />
        <meshStandardMaterial color="#b67534" metalness={0.8} roughness={0.19} />
      </mesh>
      {[-0.38, -0.16, 0.08, 0.32, 0.54].map((y, index) => (
        <mesh key={y} position={[2.65, y, -0.02 + index * 0.025]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <torusGeometry args={[0.11, 0.024, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#b67534" metalness={0.8} roughness={0.19} />
        </mesh>
      ))}
      <mesh position={[-2.58, 0.16, -0.12]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 20]} />
        <meshStandardMaterial color="#a96c31" metalness={0.78} roughness={0.2} />
      </mesh>
    </group>
  );
}

function OutdoorCoilFace({ width, height, depth, fins, rows }: { width: number; height: number; depth: number; fins: number; rows: number }) {
  const rowPositions = Array.from({ length: rows }, (_, row) => -height / 2 + 0.16 + (row * (height - 0.32)) / Math.max(1, rows - 1));
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
      {rowPositions.slice(0, -1).filter((_, index) => index % 2 === 0).map((y, index) => (
        <mesh key={`return-bend-${index}`} position={[width / 2 + 0.07, y + (rowPositions[1] - rowPositions[0]) / 2, depth * 0.18]} rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <torusGeometry args={[(rowPositions[1] - rowPositions[0]) / 2, 0.027, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#b46f2f" metalness={0.82} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, height / 2 + 0.045, 0]}><boxGeometry args={[width + 0.12, 0.08, depth + 0.05]} /><meshStandardMaterial color="#748481" metalness={0.55} roughness={0.3} /></mesh>
      <mesh position={[0, -height / 2 - 0.045, 0]}><boxGeometry args={[width + 0.12, 0.08, depth + 0.05]} /><meshStandardMaterial color="#748481" metalness={0.55} roughness={0.3} /></mesh>
    </group>
  );
}

export function OutdoorHeatExchanger() {
  return (
    <group>
      <group position={[0.02, 0, -0.66]}>
        <OutdoorCoilFace width={4.22} height={2.94} depth={0.22} fins={58} rows={12} />
      </group>
      <group position={[-2.08, 0, -0.03]} rotation={[0, Math.PI / 2, 0]}>
        <OutdoorCoilFace width={1.42} height={2.94} depth={0.22} fins={22} rows={12} />
      </group>
      <mesh position={[-1.98, 0, 0.67]}><boxGeometry args={[0.14, 2.95, 0.12]} /><meshStandardMaterial color="#778784" metalness={0.52} roughness={0.31} /></mesh>
      <mesh position={[2.13, 0, -0.58]}><boxGeometry args={[0.12, 2.95, 0.14]} /><meshStandardMaterial color="#778784" metalness={0.52} roughness={0.31} /></mesh>
    </group>
  );
}
