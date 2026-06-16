import { Edges, RoundedBox } from "@react-three/drei";
import { DoubleSide } from "three";
import { Fasteners } from "./DetailGeometry";

const GHOST_COLOR = "#ccebed";
const GHOST_EDGE = "#4f9ca4";

function shellState(opacity: number) {
  const ghost = opacity < 0.98;
  return {
    ghost,
    color: ghost ? GHOST_COLOR : "#f1f2ee",
    depthWrite: !ghost,
    castShadow: !ghost,
  };
}

export function IndoorRearChassisCutaway({ opacity }: { opacity: number }) {
  const state = shellState(opacity);
  return (
    <group>
      <RoundedBox args={[5.86, 1.72, 0.52]} radius={0.18} smoothness={5} castShadow={state.castShadow} renderOrder={8}>
        <meshPhysicalMaterial color={state.ghost ? "#bddfe1" : "#d9deda"} roughness={state.ghost ? 0.2 : 0.42} metalness={0.02} transparent={state.ghost} opacity={Math.max(0.16, opacity * 0.78)} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      <mesh position={[0, -0.55, 0.3]} castShadow={state.castShadow} renderOrder={8}>
        <boxGeometry args={[5.42, 0.46, 0.5]} />
        <meshStandardMaterial color={state.ghost ? "#b9dcde" : "#cbd2ce"} roughness={state.ghost ? 0.24 : 0.43} transparent={state.ghost} opacity={Math.max(0.18, opacity * 0.82)} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </mesh>
      <mesh position={[-1.25, 0.38, 0.3]}>
        <boxGeometry args={[2.78, 0.58, 0.17]} />
        <meshStandardMaterial color="#bdc6c1" roughness={0.82} />
      </mesh>
      <mesh position={[1.45, 0.24, 0.3]}>
        <boxGeometry args={[1.28, 0.78, 0.18]} />
        <meshStandardMaterial color="#bdc6c1" roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.2, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.08, 18, 72, Math.PI]} />
        <meshStandardMaterial color="#aeb9b4" roughness={0.5} />
      </mesh>
      <Fasteners points={[[-2.56, 0.64, 0.26], [2.56, 0.64, 0.26], [-2.56, -0.62, 0.26], [2.56, -0.62, 0.26]]} />
    </group>
  );
}

export function IndoorFrontPanelCutaway({ opacity }: { opacity: number }) {
  const state = shellState(opacity);
  const detailOpacity = state.ghost ? Math.max(0.12, opacity * 0.7) : 1;
  return (
    <group>
      <RoundedBox args={[5.92, 1.5, 0.28]} radius={0.24} smoothness={6} position={[0, 0.06, 0]} castShadow={state.castShadow} renderOrder={9}>
        <meshPhysicalMaterial color={state.color} roughness={state.ghost ? 0.16 : 0.25} metalness={0.01} clearcoat={state.ghost ? 0.12 : 0.42} clearcoatRoughness={0.28} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      <RoundedBox args={[5.58, 0.28, 0.34]} radius={0.12} smoothness={4} position={[0, 0.73, -0.02]} rotation={[-0.08, 0, 0]} castShadow={state.castShadow} renderOrder={9}>
        <meshPhysicalMaterial color={state.color} roughness={state.ghost ? 0.18 : 0.27} clearcoat={state.ghost ? 0.1 : 0.36} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      <RoundedBox args={[5.38, 0.22, 0.38]} radius={0.1} smoothness={4} position={[0, -0.68, 0.02]} rotation={[0.05, 0, 0]} castShadow={state.castShadow} renderOrder={9}>
        <meshPhysicalMaterial color={state.ghost ? "#c4e5e6" : "#e9ece7"} roughness={state.ghost ? 0.2 : 0.3} clearcoat={state.ghost ? 0.08 : 0.26} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      <mesh position={[1.78, -0.35, 0.16]} renderOrder={10}>
        <boxGeometry args={[0.72, 0.13, 0.035]} />
        <meshPhysicalMaterial color="#1b2729" roughness={0.22} clearcoat={0.3} transparent={state.ghost} opacity={detailOpacity} depthWrite={state.depthWrite} />
      </mesh>
      <group renderOrder={10}>
        <mesh position={[-1.93, -0.4, 0.16]} rotation={[0, 0, -0.42]}>
          <boxGeometry args={[0.37, 0.07, 0.03]} />
          <meshStandardMaterial color="#2e9ec1" roughness={0.3} transparent={state.ghost} opacity={detailOpacity} depthWrite={state.depthWrite} />
        </mesh>
        <mesh position={[-1.66, -0.4, 0.16]} rotation={[0, 0, -0.42]}>
          <boxGeometry args={[0.2, 0.07, 0.03]} />
          <meshStandardMaterial color="#1c7191" roughness={0.3} transparent={state.ghost} opacity={detailOpacity} depthWrite={state.depthWrite} />
        </mesh>
      </group>
      {!state.ghost && <Fasteners points={[[-2.72, 0.58, -0.06], [2.72, 0.58, -0.06], [-2.72, -0.58, -0.06], [2.72, -0.58, -0.06]]} />}
    </group>
  );
}

export function OutdoorCabinetPanelsCutaway({ opacity }: { opacity: number }) {
  const state = shellState(opacity);
  const serviceDetailOpacity = state.ghost ? Math.max(0.12, opacity * 0.65) : 1;
  return (
    <group>
      <RoundedBox args={[4.64, 0.18, 1.78]} radius={0.09} smoothness={4} position={[0, 1.66, 0]} castShadow={state.castShadow} renderOrder={9}>
        <meshPhysicalMaterial color={state.color} roughness={state.ghost ? 0.17 : 0.31} metalness={0.08} clearcoat={state.ghost ? 0.1 : 0.22} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      <mesh position={[2.23, 0, -0.02]} castShadow={state.castShadow} renderOrder={9}>
        <boxGeometry args={[0.16, 3.18, 1.68]} />
        <meshPhysicalMaterial color={state.color} roughness={state.ghost ? 0.18 : 0.33} metalness={0.1} clearcoat={state.ghost ? 0.08 : 0.18} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </mesh>
      <RoundedBox args={[1.36, 2.94, 0.16]} radius={0.07} smoothness={3} position={[1.53, 0, 0.88]} castShadow={state.castShadow} renderOrder={9}>
        <meshPhysicalMaterial color={state.color} roughness={state.ghost ? 0.17 : 0.32} metalness={0.08} clearcoat={state.ghost ? 0.08 : 0.2} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      {[-0.72, -0.36, 0, 0.36, 0.72].map((y) => (
        <mesh key={y} position={[1.62, y - 0.12, 0.98]} renderOrder={10}>
          <boxGeometry args={[0.86, 0.045, 0.035]} />
          <meshStandardMaterial color={state.ghost ? "#93c3c6" : "#d8ddd9"} metalness={0.18} roughness={0.34} transparent={state.ghost} opacity={serviceDetailOpacity} depthWrite={state.depthWrite} />
        </mesh>
      ))}
      <group position={[1.52, 0.95, 0.99]} visible={!state.ghost || opacity > 0.45}>
        <mesh position={[-0.22, 0.03, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.42, 0.14, 0.025]} /><meshStandardMaterial color="#2d9fc1" roughness={0.28} /></mesh>
        <mesh position={[0.12, 0.03, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.28, 0.14, 0.026]} /><meshStandardMaterial color="#1d6f91" roughness={0.28} /></mesh>
      </group>
      <RoundedBox args={[0.92, 1.32, 0.08]} radius={0.05} smoothness={3} position={[2.32, -0.45, 0.18]} rotation={[0, Math.PI / 2, 0]} castShadow={state.castShadow} renderOrder={9}>
        <meshStandardMaterial color={state.ghost ? "#c3e4e5" : "#e5e8e4"} metalness={0.12} roughness={state.ghost ? 0.2 : 0.35} transparent={state.ghost} opacity={opacity} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </RoundedBox>
      <mesh position={[0.66, 0, -0.02]}><boxGeometry args={[0.07, 3.1, 1.6]} /><meshStandardMaterial color="#8d9794" metalness={0.55} roughness={0.29} /></mesh>
      <mesh position={[-2.22, 0, 0]} renderOrder={8}>
        <boxGeometry args={[0.09, 3.05, 1.66]} />
        <meshStandardMaterial color={state.ghost ? "#9fcbd0" : "#d4d9d5"} metalness={0.18} roughness={0.35} transparent={state.ghost} opacity={Math.max(0.18, opacity * 0.75)} depthWrite={state.depthWrite} side={DoubleSide} />
        {state.ghost && <Edges threshold={12} color={GHOST_EDGE} />}
      </mesh>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={index} position={[-2.28, -1.18 + index * 0.34, 0]}>
          <boxGeometry args={[0.035, 0.12, 1.38]} />
          <meshStandardMaterial color="#aeb7b3" metalness={0.28} roughness={0.33} />
        </mesh>
      ))}
    </group>
  );
}
