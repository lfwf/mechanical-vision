import { Environment, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";

interface SenjerCitySceneProps {
  activeDistrict: "core" | "sky" | "water" | "transit" | "echo" | "research";
  playing: boolean;
  night: boolean;
  bladeAngle: number;
  outputRpm: number;
}

function EnergyTower({ playing, night }: { playing: boolean; night: boolean }) {
  const coreRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && coreRef.current) coreRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group position={[0, 1.2, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[4.3, 4.8, 0.9, 64]} />
        <meshStandardMaterial color={night ? "#3a5360" : "#d9e8ef"} roughness={0.42} />
      </mesh>
      <group ref={coreRef} position={[0, 2.1, 0]}>
        <mesh castShadow>
          <torusGeometry args={[2.15, 0.35, 24, 96]} />
          <meshStandardMaterial color="#d4a24b" metalness={0.66} roughness={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 2.2, 48]} />
          <meshStandardMaterial color="#617e8d" metalness={0.62} roughness={0.24} />
        </mesh>
        {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 1.35, 0, Math.sin(angle) * 1.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.48, 36]} />
            <meshStandardMaterial color="#79b9c8" metalness={0.5} roughness={0.25} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 5.1, 0]}>
        <sphereGeometry args={[0.72, 48, 32]} />
        <meshStandardMaterial color="#62c7d8" emissive="#2e8da0" emissiveIntensity={night ? 1.05 : 0.45} roughness={0.16} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = index / 6 * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 3.4, 5.0, Math.sin(angle) * 3.4]}>
            <boxGeometry args={[0.65, 0.9, 0.18]} />
            <meshStandardMaterial color={index < 3 ? "#8ed9c0" : "#9baeb7"} emissive={index < 3 ? "#2a7766" : "#000000"} emissiveIntensity={index < 3 ? 0.24 : 0} />
          </mesh>
        );
      })}
    </group>
  );
}

function SkyGarden({ playing, bladeAngle, outputRpm }: { playing: boolean; bladeAngle: number; outputRpm: number }) {
  const rotorRef = useRef<Group>(null);
  const platformRef = useRef<Group>(null);
  useFrame(({ clock }, delta) => {
    if (playing && rotorRef.current) rotorRef.current.rotation.z -= delta * 0.28;
    if (platformRef.current) {
      const target = outputRpm >= 18 && outputRpm <= 22 ? 3.4 : 1.15;
      platformRef.current.position.y += (target - platformRef.current.position.y) * Math.min(delta * 1.8, 1);
    }
  });

  return (
    <group position={[-15.5, 2.2, -7.5]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[5.5, 6.2, 1.0, 56]} />
        <meshStandardMaterial color="#dfeef4" roughness={0.48} />
      </mesh>
      <RoundedBox args={[1.4, 7.4, 1.4]} radius={0.22} smoothness={6} position={[-1.1, 3.3, 0]} castShadow>
        <meshStandardMaterial color="#eef4f7" roughness={0.42} />
      </RoundedBox>
      <group ref={rotorRef} position={[-1.1, 5.5, 0.85]} rotation={[0, 0, bladeAngle * Math.PI / 180]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.8, 36]} />
          <meshStandardMaterial color="#617e8d" metalness={0.62} roughness={0.22} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
          <RoundedBox key={angle} args={[0.5, 3.8, 0.18]} radius={0.12} smoothness={5} position={[Math.cos(angle) * 1.9, Math.sin(angle) * 1.9, 0]} rotation={[0, 0, angle]} castShadow>
            <meshStandardMaterial color="#c8dce8" metalness={0.18} roughness={0.3} />
          </RoundedBox>
        ))}
      </group>
      <group ref={platformRef} position={[2.15, 1.15, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 1.8, 0.38, 48]} />
          <meshStandardMaterial color="#eef4f7" roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[1.35, 0.08, 14, 64]} />
          <meshStandardMaterial color="#62c7d8" emissive="#276c77" emissiveIntensity={0.2} />
        </mesh>
      </group>
      {[[-3.6, 0.8, 2.4], [0.8, 0.7, -2.6], [3.5, 0.8, 2.1]].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          <mesh><cylinderGeometry args={[0.55, 0.7, 0.5, 28]} /><meshStandardMaterial color="#b8cfbf" roughness={0.5} /></mesh>
          <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.7, 24, 18]} /><meshStandardMaterial color="#78a88a" roughness={0.6} /></mesh>
        </group>
      ))}
    </group>
  );
}

function WaterGarden({ playing }: { playing: boolean }) {
  const wheelRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && wheelRef.current) wheelRef.current.rotation.z += delta * 0.18;
  });
  return (
    <group position={[15.5, -0.3, 8.2]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[5.9, 6.5, 1.1, 56]} />
        <meshStandardMaterial color="#dceaf1" roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[3.6, 3.9, 0.38, 56]} />
        <meshStandardMaterial color="#7cc1da" transparent opacity={0.68} roughness={0.18} />
      </mesh>
      <group ref={wheelRef} position={[-2.2, 2.4, 0]}>
        <mesh><torusGeometry args={[1.35, 0.18, 18, 64]} /><meshStandardMaterial color="#d4a24b" metalness={0.62} roughness={0.24} /></mesh>
        {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((angle) => (
          <RoundedBox key={angle} args={[0.18, 2.5, 0.32]} radius={0.04} smoothness={4} rotation={[0, 0, angle]}>
            <meshStandardMaterial color="#617e8d" metalness={0.5} roughness={0.28} />
          </RoundedBox>
        ))}
      </group>
      {[-2.1, 0, 2.1].map((x) => (
        <group key={x} position={[x, 1.1, 1.5]}>
          <mesh><cylinderGeometry args={[0.72, 0.9, 0.6, 32]} /><meshStandardMaterial color="#eef4f7" roughness={0.42} /></mesh>
          <mesh position={[0, 1.0, 0]}><cylinderGeometry args={[0.07, 0.14, 1.8, 22]} /><meshStandardMaterial color="#62c7d8" emissive="#2a7784" emissiveIntensity={0.22} /></mesh>
        </group>
      ))}
    </group>
  );
}

function PlaceholderDistrict({ position, color, height }: { position: [number, number, number]; color: string; height: number }) {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <cylinderGeometry args={[4.5, 5.2, 0.8, 48]} />
        <meshStandardMaterial color="#d8e3e8" roughness={0.52} />
      </mesh>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.18}>
        <RoundedBox args={[3.0, height, 3.0]} radius={0.35} smoothness={6} position={[0, height / 2 + 0.5, 0]}>
          <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.4} />
        </RoundedBox>
      </Float>
    </group>
  );
}

function CityWorld({ playing, night, bladeAngle, outputRpm }: Omit<SenjerCitySceneProps, "activeDistrict">) {
  return (
    <group>
      <mesh position={[0, -2.4, 0]} receiveShadow>
        <cylinderGeometry args={[25, 28, 4.5, 72]} />
        <meshStandardMaterial color={night ? "#263d48" : "#cbdce4"} roughness={0.62} />
      </mesh>
      <mesh position={[0, -4.6, 0]}>
        <coneGeometry args={[20, 9, 64]} />
        <meshStandardMaterial color={night ? "#1f323b" : "#9db2bd"} roughness={0.72} />
      </mesh>
      <EnergyTower playing={playing} night={night} />
      <SkyGarden playing={playing} bladeAngle={bladeAngle} outputRpm={outputRpm} />
      <WaterGarden playing={playing} />
      <PlaceholderDistrict position={[0, -0.8, 17]} color="#9eb9c8" height={2.8} />
      <PlaceholderDistrict position={[-17, 0.2, 12]} color="#c7b0ce" height={3.6} />
      <PlaceholderDistrict position={[17, 3.2, -12]} color="#9fb2d0" height={5.2} />
      {[[-8, 0.2, -3], [8, -0.1, 4], [0, -0.3, 10]].map((position, index) => (
        <RoundedBox key={index} args={[10, 0.24, 1.4]} radius={0.18} smoothness={5} position={position as [number, number, number]} rotation={[0, index === 0 ? -0.35 : index === 1 ? 0.35 : 0, 0]} receiveShadow>
          <meshStandardMaterial color="#eef4f7" roughness={0.42} />
        </RoundedBox>
      ))}
    </group>
  );
}

export function SenjerCityScene(props: SenjerCitySceneProps) {
  return (
    <Canvas shadows camera={{ position: [26, 20, 30], fov: 42, near: 0.2, far: 180 }}>
      <color attach="background" args={[props.night ? "#142630" : "#eaf4f8"]} />
      <fog attach="fog" args={[props.night ? "#142630" : "#eaf4f8", 38, 110]} />
      <ambientLight intensity={props.night ? 0.5 : 1.15} />
      <directionalLight position={[18, 28, 14]} intensity={props.night ? 1.2 : 2.6} castShadow shadow-mapSize={[2048, 2048]} />
      <hemisphereLight args={[props.night ? "#4c7180" : "#ffffff", "#7f9aa5", props.night ? 0.5 : 0.95]} />
      <Suspense fallback={null}>
        <CityWorld playing={props.playing} night={props.night} bladeAngle={props.bladeAngle} outputRpm={props.outputRpm} />
        <Environment preset={props.night ? "night" : "city"} />
      </Suspense>
      <OrbitControls
        makeDefault
        target={[0, 1.4, 0]}
        minDistance={18}
        maxDistance={58}
        minPolarAngle={0.35}
        maxPolarAngle={1.35}
        enablePan={false}
      />
    </Canvas>
  );
}
