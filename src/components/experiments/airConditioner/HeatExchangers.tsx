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

export function IndoorHeatExchanger() {
  return (
    <group>
      <group position={[0, 0.05, 0.12]} rotation={[0.16, 0, 0]}><FinCoil width={4.95} height={1.02} rows={8} fins={34} /></group>
      <group position={[0, 0.28, -0.45]} rotation={[-0.55, 0, 0]}><FinCoil width={4.95} height={0.9} rows={7} fins={34} color="#a0c3c4" /></group>
      <mesh position={[2.5, 0.16, -0.12]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.04, 12, 30, Math.PI]} />
        <meshStandardMaterial color="#b87938" metalness={0.75} roughness={0.22} />
      </mesh>
    </group>
  );
}

export function OutdoorHeatExchanger() {
  return (
    <group>
      <group position={[0, 0, -0.58]}><FinCoil width={4.2} height={2.75} depth={0.3} rows={14} fins={32} /></group>
      <group position={[-2.07, 0, -0.02]} rotation={[0, Math.PI / 2, 0]}><FinCoil width={1.15} height={2.75} depth={0.3} rows={14} fins={12} color="#9fc1c2" /></group>
    </group>
  );
}
