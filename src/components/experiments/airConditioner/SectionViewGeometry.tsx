import { Edges, RoundedBox } from "@react-three/drei";

/**
 * 运行演示专用的剖视辅助结构。
 *
 * 这些几何体不是空调的独立零件，只是用于保留机体轮廓。
 * 与整块透明外壳相比，细框不会在透明排序时反复遮挡内部零件，
 * 也更接近技术插图常见的“切掉外板、保留截面边缘”表达方式。
 */

/** 室内机前部切开后保留下来的四周截面边框。 */
export function IndoorSectionFrame({ intensity = 1 }: { intensity?: number }) {
  const opacity = Math.max(0.18, Math.min(0.58, intensity));
  const material = (
    <meshStandardMaterial
      color="#91a5a3"
      metalness={0.08}
      roughness={0.42}
      transparent
      opacity={opacity}
      depthWrite={false}
    />
  );

  return (
    <group position={[0, 0.02, 0.88]} renderOrder={10}>
      <RoundedBox args={[5.82, 0.075, 0.1]} radius={0.03} smoothness={3} position={[0, 0.76, 0]}>{material}</RoundedBox>
      <RoundedBox args={[5.82, 0.075, 0.1]} radius={0.03} smoothness={3} position={[0, -0.72, 0]}>{material}</RoundedBox>
      <RoundedBox args={[0.075, 1.4, 0.1]} radius={0.03} smoothness={3} position={[-2.86, 0.02, 0]}>{material}</RoundedBox>
      <RoundedBox args={[0.075, 1.4, 0.1]} radius={0.03} smoothness={3} position={[2.86, 0.02, 0]}>{material}</RoundedBox>
    </group>
  );
}

/**
 * 室外机运行状态下保留的钣金骨架。
 * 只画顶盖、左右立柱和压缩机舱隔板，不再把整台外机包在透明盒子里。
 */
export function OutdoorOperatingFrame() {
  return (
    <group>
      <RoundedBox args={[4.64, 0.16, 1.76]} radius={0.07} smoothness={4} position={[0, 1.66, 0]} castShadow>
        <meshPhysicalMaterial color="#e5e9e6" roughness={0.38} metalness={0.08} clearcoat={0.12} />
      </RoundedBox>

      <mesh position={[-2.22, 0, -0.02]} castShadow>
        <boxGeometry args={[0.11, 3.1, 1.68]} />
        <meshStandardMaterial color="#c9d0cd" metalness={0.16} roughness={0.42} />
      </mesh>
      <mesh position={[2.22, 0, -0.02]} castShadow>
        <boxGeometry args={[0.11, 3.1, 1.68]} />
        <meshStandardMaterial color="#d7ddda" metalness={0.14} roughness={0.4} />
      </mesh>
      <mesh position={[0.66, 0, -0.02]} castShadow>
        <boxGeometry args={[0.075, 3.08, 1.6]} />
        <meshStandardMaterial color="#8e9996" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* 右侧服务舱只保留淡色轮廓，便于观察压缩机和电控板。 */}
      <RoundedBox args={[1.34, 2.92, 0.08]} radius={0.05} smoothness={3} position={[1.52, 0, 0.88]}>
        <meshStandardMaterial color="#b9c7c4" transparent opacity={0.22} depthWrite={false} roughness={0.38} />
        <Edges threshold={10} color="#7d918e" />
      </RoundedBox>
    </group>
  );
}

/** 室外轴流风扇的导风圈边界，用于说明叶尖包络和风道位置。 */
export function OutdoorFanSectionRing({ opacity = 0.32 }: { opacity?: number }) {
  return (
    <group position={[-0.72, 0.02, 0.84]} renderOrder={10}>
      <mesh>
        <torusGeometry args={[1.29, 0.024, 12, 96]} />
        <meshStandardMaterial color="#899b99" metalness={0.16} roughness={0.38} transparent opacity={opacity} depthWrite={false} />
      </mesh>
    </group>
  );
}
