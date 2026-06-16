import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { MathUtils, type Group } from "three";

export interface TimeTravelSceneProps {
  year: number;
  playing: boolean;
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
}

const eras = [800, 1400, 1900, 2026, 2080] as const;

function opacityBetween(year: number, start: number, peak: number, end: number) {
  if (year <= start || year >= end) return 0;
  if (year <= peak) return MathUtils.smoothstep(year, start, peak);
  return 1 - MathUtils.smoothstep(year, peak, end);
}

function FadeGroup({ opacity, children }: { opacity: number; children: React.ReactNode }) {
  return <group visible={opacity > 0.01}>{children}</group>;
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 24]} />
        <meshStandardMaterial color="#dfe9df" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 26]} />
        <meshStandardMaterial color="#8fc8d8" roughness={0.45} transparent opacity={0.84} />
      </mesh>
      <mesh position={[-7.5, 0.22, -1]} rotation={[-Math.PI / 2, 0, -0.06]} receiveShadow>
        <planeGeometry args={[11, 3.2]} />
        <meshStandardMaterial color="#c7b894" roughness={0.92} />
      </mesh>
      <mesh position={[7.5, 0.22, 1]} rotation={[-Math.PI / 2, 0, 0.04]} receiveShadow>
        <planeGeometry args={[11, 3.8]} />
        <meshStandardMaterial color="#d1d5cf" roughness={0.9} />
      </mesh>
    </>
  );
}

function Tree({ position, scale = 1, color = "#80a987" }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.42, 0]}><cylinderGeometry args={[0.08, 0.11, 0.84, 12]} /><meshStandardMaterial color="#8d745d" roughness={0.9} /></mesh>
      <mesh castShadow position={[0, 1.15, 0]}><sphereGeometry args={[0.65, 18, 14]} /><meshStandardMaterial color={color} roughness={0.95} /></mesh>
    </group>
  );
}

function Bridge({ era, selected, onSelect }: { era: "ancient" | "medieval" | "industrial" | "modern" | "future"; selected: boolean; onSelect: () => void }) {
  const colors = {
    ancient: "#a98d69",
    medieval: "#a79a82",
    industrial: "#7a7f83",
    modern: "#e5e9ec",
    future: "#bdeaf1",
  };
  const y = era === "future" ? 1.05 : 0.55;
  return (
    <group position={[0, y, 0]} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      <RoundedBox args={[8.4, era === "future" ? 0.24 : 0.35, 1.2]} radius={0.18} smoothness={6} castShadow>
        <meshStandardMaterial color={colors[era]} roughness={era === "future" ? 0.35 : 0.7} emissive={selected ? "#8be7f4" : "#000"} emissiveIntensity={selected ? 0.35 : 0} />
      </RoundedBox>
      {era === "future" && <mesh position={[0, 0.45, 0]}><torusGeometry args={[3.4, 0.06, 12, 64]} /><meshStandardMaterial color="#78d8e7" emissive="#78d8e7" emissiveIntensity={0.55} /></mesh>}
    </group>
  );
}

function Village({ opacity, onSelect, selected }: { opacity: number; onSelect: () => void; selected: boolean }) {
  return (
    <FadeGroup opacity={opacity}>
      <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        {[[-7, 0, -4], [-5.2, 0, -2.6], [-8.3, 0, -1.5], [-6.2, 0, 1.2]].map((position, index) => (
          <group key={index} position={position as [number, number, number]}>
            <RoundedBox args={[1.6, 1.1, 1.25]} radius={0.08} smoothness={4} position={[0, 0.55, 0]} castShadow>
              <meshStandardMaterial color="#d9c9a8" roughness={0.92} transparent opacity={opacity} emissive={selected ? "#d9b56b" : "#000"} emissiveIntensity={selected ? 0.22 : 0} />
            </RoundedBox>
            <mesh position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1.15, 0.8, 4]} /><meshStandardMaterial color="#8e684a" roughness={0.95} transparent opacity={opacity} /></mesh>
          </group>
        ))}
      </group>
    </FadeGroup>
  );
}

function WalledTown({ opacity, onSelect, selected }: { opacity: number; onSelect: () => void; selected: boolean }) {
  return (
    <FadeGroup opacity={opacity}>
      <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        <RoundedBox args={[7.5, 1.1, 5.4]} radius={0.18} smoothness={5} position={[-6.5, 0.55, -0.2]} castShadow>
          <meshStandardMaterial color="#c9b99a" roughness={0.95} transparent opacity={opacity} emissive={selected ? "#c89c5a" : "#000"} emissiveIntensity={selected ? 0.22 : 0} />
        </RoundedBox>
        {[-9.4, -3.6].map((x) => <mesh key={x} position={[x, 1.7, -2.4]} castShadow><cylinderGeometry args={[0.55, 0.7, 2.2, 20]} /><meshStandardMaterial color="#aa9a7f" transparent opacity={opacity} /></mesh>)}
      </group>
    </FadeGroup>
  );
}

function IndustrialTown({ opacity, onSelect, selected }: { opacity: number; onSelect: () => void; selected: boolean }) {
  return (
    <FadeGroup opacity={opacity}>
      <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        {[[-8, 1.2, -3], [-5.6, 1.5, -1], [-8.2, 1.4, 2.2]].map((position, index) => (
          <RoundedBox key={index} args={[2.4, position[1] * 2, 1.8]} radius={0.08} smoothness={4} position={[position[0], position[1], position[2]]} castShadow>
            <meshStandardMaterial color="#8b8f91" roughness={0.82} transparent opacity={opacity} emissive={selected ? "#d18d55" : "#000"} emissiveIntensity={selected ? 0.22 : 0} />
          </RoundedBox>
        ))}
        <mesh position={[-4.4, 3, -2]}><cylinderGeometry args={[0.35, 0.48, 6, 24]} /><meshStandardMaterial color="#6d6c68" transparent opacity={opacity} /></mesh>
      </group>
    </FadeGroup>
  );
}

function ModernCity({ opacity, onSelect, selected }: { opacity: number; onSelect: () => void; selected: boolean }) {
  return (
    <FadeGroup opacity={opacity}>
      <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        {[[-8.5, 2.3, -3], [-5.8, 3.2, -1], [-8.1, 2.8, 2.2], [6.3, 2.1, -2], [8.5, 3.5, 1]].map((position, index) => (
          <RoundedBox key={index} args={[1.9, position[1] * 2, 1.9]} radius={0.2} smoothness={6} position={[position[0], position[1], position[2]]} castShadow>
            <meshStandardMaterial color={index < 3 ? "#eff2f3" : "#dce8ec"} roughness={0.6} transparent opacity={opacity} emissive={selected ? "#76cfe5" : "#000"} emissiveIntensity={selected ? 0.18 : 0} />
          </RoundedBox>
        ))}
      </group>
    </FadeGroup>
  );
}

function FutureCity({ opacity, onSelect, selected }: { opacity: number; onSelect: () => void; selected: boolean }) {
  const ring = useRef<Group>(null);
  useFrame((_, delta) => { if (ring.current) ring.current.rotation.y += delta * 0.1; });
  return (
    <FadeGroup opacity={opacity}>
      <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        {[[-7.5, 3.2, -2.8], [-5, 4.4, 0], [7.2, 3.6, -1.5], [8.6, 4.7, 2.4]].map((position, index) => (
          <group key={index} position={[position[0], 0, position[2]]}>
            <mesh position={[0, position[1] / 2, 0]} castShadow><cylinderGeometry args={[0.7, 1.4, position[1], 28]} /><meshStandardMaterial color="#d8f2f3" roughness={0.38} transparent opacity={opacity} emissive={selected ? "#73e7ee" : "#a8edf0"} emissiveIntensity={selected ? 0.45 : 0.14} /></mesh>
            <mesh position={[0, position[1] + 0.35, 0]}><sphereGeometry args={[0.65, 20, 16]} /><meshStandardMaterial color="#bce5cf" transparent opacity={opacity} /></mesh>
          </group>
        ))}
        <group ref={ring} position={[0, 4.2, -3]}><mesh><torusGeometry args={[2.4, 0.08, 12, 64]} /><meshStandardMaterial color="#85dfe9" transparent opacity={opacity} emissive="#85dfe9" emissiveIntensity={0.55} /></mesh></group>
      </group>
    </FadeGroup>
  );
}

function TimelineWorld({ year, selectedObjectId, onSelectObject }: Omit<TimeTravelSceneProps, "playing">) {
  const ancient = 1 - MathUtils.smoothstep(year, 900, 1450);
  const medieval = opacityBetween(year, 1100, 1450, 1880);
  const industrial = opacityBetween(year, 1780, 1920, 2010);
  const modern = opacityBetween(year, 1950, 2026, 2070);
  const future = MathUtils.smoothstep(year, 2035, 2080);
  return (
    <group onPointerMissed={() => onSelectObject(null)}>
      <Ground />
      <Village opacity={ancient} selected={selectedObjectId === "settlement"} onSelect={() => onSelectObject("settlement")} />
      <WalledTown opacity={medieval} selected={selectedObjectId === "settlement"} onSelect={() => onSelectObject("settlement")} />
      <IndustrialTown opacity={industrial} selected={selectedObjectId === "industry"} onSelect={() => onSelectObject("industry")} />
      <ModernCity opacity={modern} selected={selectedObjectId === "city"} onSelect={() => onSelectObject("city")} />
      <FutureCity opacity={future} selected={selectedObjectId === "future"} onSelect={() => onSelectObject("future")} />
      {ancient > 0.02 && <Bridge era="ancient" selected={selectedObjectId === "bridge"} onSelect={() => onSelectObject("bridge")} />}
      {medieval > 0.02 && <Bridge era="medieval" selected={selectedObjectId === "bridge"} onSelect={() => onSelectObject("bridge")} />}
      {industrial > 0.02 && <Bridge era="industrial" selected={selectedObjectId === "bridge"} onSelect={() => onSelectObject("bridge")} />}
      {modern > 0.02 && <Bridge era="modern" selected={selectedObjectId === "bridge"} onSelect={() => onSelectObject("bridge")} />}
      {future > 0.02 && <Bridge era="future" selected={selectedObjectId === "bridge"} onSelect={() => onSelectObject("bridge")} />}
      {Array.from({ length: 20 }, (_, index) => <Tree key={index} position={[-15 + (index % 10) * 3.1, 0, -8 + Math.floor(index / 10) * 16]} scale={0.65 + (index % 3) * 0.12} color={future > 0.5 ? "#8fcab0" : "#7ea081"} />)}
    </group>
  );
}

export function TimeTravelScene(props: TimeTravelSceneProps) {
  return (
    <Canvas orthographic shadows camera={{ position: [18, 18, 18], zoom: 38, near: 0.1, far: 120 }} gl={{ antialias: true, alpha: false, toneMappingExposure: 1.05 }}>
      <color attach="background" args={[props.year >= 2060 ? "#d9f1f4" : props.year < 1700 ? "#e8e0cc" : "#e5edf1"]} />
      <fog attach="fog" args={[props.year >= 2060 ? "#d9f1f4" : "#e5edf1", 34, 78]} />
      <ambientLight intensity={1.0} />
      <hemisphereLight args={["#ffffff", "#9bb0b5", 1]} />
      <directionalLight position={[12, 20, 10]} intensity={1.0} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={22} shadow-camera-bottom={-22} />
      <Suspense fallback={null}><TimelineWorld year={props.year} selectedObjectId={props.selectedObjectId} onSelectObject={props.onSelectObject} /></Suspense>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.18} scale={42} blur={4.5} far={25} />
      <OrbitControls enableRotate={false} enablePan enableZoom screenSpacePanning minZoom={28} maxZoom={55} enableDamping dampingFactor={0.1} />
    </Canvas>
  );
}

export { eras };
