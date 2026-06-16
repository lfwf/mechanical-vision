import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { CatmullRomCurve3, MathUtils, Vector3, type Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export interface SenjerCitySceneProps {
  activeDistrict: "core" | "sky" | "water" | "transit" | "echo" | "research";
  playing: boolean;
  night: boolean;
  bladeAngle: number;
  outputRpm: number;
}

type DistrictId = SenjerCitySceneProps["activeDistrict"];

const presets: Record<DistrictId, { position: [number, number, number]; target: [number, number, number] }> = {
  core: { position: [17, 12, 20], target: [0, 2.1, 0] },
  sky: { position: [-4, 9, 9], target: [-11.8, 3.1, -6.2] },
  water: { position: [21, 8, 16], target: [12, 1.1, 7] },
  transit: { position: [8, 8, 24], target: [0, 1, 13.4] },
  echo: { position: [-23, 8, 17], target: [-14, 1.7, 8.8] },
  research: { position: [24, 12, -15], target: [14, 3.9, -9.4] },
};

function CameraTransition({ district, controls, active }: { district: DistrictId; controls: MutableRefObject<OrbitControlsImpl | null>; active: MutableRefObject<boolean> }) {
  const camera = useThree((state) => state.camera);
  const destination = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    active.current = true;
  }, [district, active]);

  useFrame((_, delta) => {
    if (!active.current) return;
    const preset = presets[district];
    destination.set(...preset.position);
    target.set(...preset.target);
    const alpha = 1 - Math.exp(-delta * 3.1);
    camera.position.lerp(destination, alpha);
    if (controls.current) {
      controls.current.target.lerp(target, alpha);
      controls.current.update();
    }
    if (camera.position.distanceTo(destination) < 0.04 && (!controls.current || controls.current.target.distanceTo(target) < 0.04)) {
      active.current = false;
    }
  });

  return null;
}

function Island({ radius, color = "#dce8e5" }: { radius: number; color?: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius - 0.18, radius, 0.7, 64]} />
        <meshStandardMaterial color="#a9bec4" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.39, 0]} receiveShadow>
        <cylinderGeometry args={[radius - 0.42, radius - 0.42, 0.08, 64]} />
        <meshStandardMaterial color={color} roughness={0.58} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <coneGeometry args={[radius * 0.78, 1.55, 64]} />
        <meshStandardMaterial color="#708893" roughness={0.84} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow><cylinderGeometry args={[0.07, 0.1, 0.36, 12]} /><meshStandardMaterial color="#6d8c75" roughness={0.7} /></mesh>
      <mesh position={[0, 0.31, 0]} castShadow><sphereGeometry args={[0.24, 18, 14]} /><meshStandardMaterial color="#7ca389" roughness={0.72} /></mesh>
    </group>
  );
}

function Bridge({ points }: { points: Array<[number, number, number]> }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal"), [points]);
  return (
    <group>
      <mesh castShadow receiveShadow><tubeGeometry args={[curve, 64, 0.54, 10, false]} /><meshStandardMaterial color="#d6e3e5" roughness={0.48} /></mesh>
      <mesh><tubeGeometry args={[curve, 64, 0.065, 8, false]} /><meshStandardMaterial color="#4e717d" metalness={0.32} roughness={0.33} /></mesh>
    </group>
  );
}

function EnergyCore({ playing, night }: { playing: boolean; night: boolean }) {
  const ring = useRef<Group>(null);
  useFrame((_, delta) => { if (playing && ring.current) ring.current.rotation.y += delta * 0.11; });
  return (
    <group position={[0, 0.35, 0]}>
      <Island radius={4.7} color={night ? "#3d535d" : "#e5eeea"} />
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow><cylinderGeometry args={[3.0, 3.45, 1.25, 64]} /><meshStandardMaterial color={night ? "#314852" : "#d8e4e5"} roughness={0.5} /></mesh>
      <mesh position={[0, 1.95, 0]} castShadow><cylinderGeometry args={[1.35, 2.0, 0.95, 56]} /><meshStandardMaterial color="#55737f" metalness={0.28} roughness={0.38} /></mesh>
      <group ref={ring} position={[0, 2.85, 0]}>
        <mesh castShadow><torusGeometry args={[1.55, 0.2, 20, 80]} /><meshStandardMaterial color="#c69745" metalness={0.64} roughness={0.24} /></mesh>
        {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle) => <mesh key={angle} position={[Math.cos(angle) * 1.0, 0, Math.sin(angle) * 1.0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.42, 28]} /><meshStandardMaterial color="#76aab5" metalness={0.45} roughness={0.28} /></mesh>)}
      </group>
      <mesh position={[0, 4.2, 0]}><sphereGeometry args={[0.5, 36, 24]} /><meshStandardMaterial color="#71c5d0" emissive="#2d7f8c" emissiveIntensity={night ? 0.9 : 0.28} roughness={0.18} /></mesh>
      <mesh position={[0, 3.58, 0]} castShadow><cylinderGeometry args={[0.11, 0.18, 0.82, 18]} /><meshStandardMaterial color="#55717d" metalness={0.4} roughness={0.34} /></mesh>
    </group>
  );
}

function SkyGarden({ playing, bladeAngle, outputRpm }: { playing: boolean; bladeAngle: number; outputRpm: number }) {
  const rotor = useRef<Group>(null);
  const lift = useRef<Group>(null);
  const ready = outputRpm >= 18 && outputRpm <= 22;
  useFrame((_, delta) => {
    if (playing && rotor.current) rotor.current.rotation.z -= delta * MathUtils.lerp(0.14, 0.34, bladeAngle / 55);
    if (lift.current) lift.current.position.y = MathUtils.damp(lift.current.position.y, ready ? 2.35 : 0.9, 2, delta);
  });
  return (
    <group position={[-11.8, 1.9, -6.2]}>
      <Island radius={4.55} />
      <group position={[-1.35, 0.35, 0]}>
        <RoundedBox args={[1.5, 5.2, 1.5]} radius={0.26} smoothness={6} position={[0, 2.45, 0]} castShadow><meshStandardMaterial color="#d7e4e6" roughness={0.5} /></RoundedBox>
        <mesh position={[0, 4.2, 0.85]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.9, 32]} /><meshStandardMaterial color="#4d6873" metalness={0.56} roughness={0.28} /></mesh>
        <group ref={rotor} position={[0, 4.2, 1.3]}>
          <mesh castShadow><cylinderGeometry args={[0.3, 0.3, 0.3, 28]} /><meshStandardMaterial color="#466572" metalness={0.58} roughness={0.26} /></mesh>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => <group key={angle} rotation={[0, 0, angle]}><RoundedBox args={[0.36, 1.95, 0.15]} radius={0.1} smoothness={5} position={[0, 1.1, 0]} rotation={[0, 0, bladeAngle * Math.PI / 900]} castShadow><meshStandardMaterial color="#eef3f1" roughness={0.37} /></RoundedBox></group>)}
        </group>
      </group>
      <group position={[1.55, 0.35, 0]}>
        <RoundedBox args={[0.82, 4.2, 0.82]} radius={0.16} smoothness={5} position={[0, 1.95, 0]} castShadow><meshStandardMaterial color="#69848f" metalness={0.28} roughness={0.4} /></RoundedBox>
        <group ref={lift} position={[0, 0.9, 0]}>
          <mesh castShadow receiveShadow><cylinderGeometry args={[1.2, 1.35, 0.3, 44]} /><meshStandardMaterial color="#e3ecea" roughness={0.42} /></mesh>
          <mesh position={[0, 0.36, 0]}><torusGeometry args={[0.98, 0.05, 12, 56]} /><meshStandardMaterial color={ready ? "#71c7b2" : "#69b7c5"} emissive={ready ? "#236758" : "#205e68"} emissiveIntensity={0.12} /></mesh>
        </group>
      </group>
      <Tree position={[-3.0, 0.7, 2.0]} scale={1.1} /><Tree position={[0.1, 0.7, -2.5]} /><Tree position={[3.0, 0.7, 2.0]} />
    </group>
  );
}

function WaterGarden({ playing }: { playing: boolean }) {
  const wheel = useRef<Group>(null);
  useFrame((_, delta) => { if (playing && wheel.current) wheel.current.rotation.z += delta * 0.15; });
  return (
    <group position={[12, -0.1, 7]}>
      <Island radius={4.9} />
      <mesh position={[0, 0.58, 0]} receiveShadow><cylinderGeometry args={[3.55, 3.8, 0.34, 60]} /><meshStandardMaterial color="#76bbce" transparent opacity={0.82} roughness={0.2} /></mesh>
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[3.8, 3.8, 0.4, 60]} /><meshStandardMaterial color="#d4e2e4" roughness={0.54} /></mesh>
      <group position={[-2.05, 0.98, -0.7]}>
        <RoundedBox args={[2.0, 1.42, 1.75]} radius={0.2} smoothness={6} castShadow><meshStandardMaterial color="#d9e5e6" roughness={0.5} /></RoundedBox>
        <mesh position={[0, 0.86, 0]} castShadow><cylinderGeometry args={[0.54, 0.65, 0.42, 30]} /><meshStandardMaterial color="#607d89" metalness={0.36} roughness={0.36} /></mesh>
      </group>
      <group ref={wheel} position={[-1.9, 1.85, 0.86]}>
        <mesh castShadow><torusGeometry args={[0.92, 0.14, 16, 56]} /><meshStandardMaterial color="#c59748" metalness={0.6} roughness={0.26} /></mesh>
        {Array.from({ length: 6 }, (_, index) => <RoundedBox key={index} args={[0.12, 1.55, 0.22]} radius={0.04} smoothness={4} rotation={[0, 0, index / 6 * Math.PI * 2]}><meshStandardMaterial color="#4c6c77" metalness={0.42} roughness={0.32} /></RoundedBox>)}
      </group>
      <RoundedBox args={[4.2, 0.24, 0.56]} radius={0.1} smoothness={5} position={[0.5, 1.0, -1.3]} rotation={[0, 0.14, 0]} castShadow><meshStandardMaterial color="#e0eae8" roughness={0.46} /></RoundedBox>
      {[-1.55, 0, 1.55].map((x) => <group key={x} position={[x, 0.86, 1.5]}><mesh castShadow><cylinderGeometry args={[0.52, 0.65, 0.42, 26]} /><meshStandardMaterial color="#e1eae8" roughness={0.48} /></mesh><mesh position={[0, 0.66, 0]}><cylinderGeometry args={[0.055, 0.11, 1.08, 16]} /><meshStandardMaterial color="#55b5cb" emissive="#216878" emissiveIntensity={0.14} /></mesh></group>)}
    </group>
  );
}

function DistantDistrict({ kind, position }: { kind: "transit" | "echo" | "research"; position: [number, number, number] }) {
  return (
    <group position={position}>
      <Island radius={3.75} color="#d9e4e1" />
      {kind === "transit" && <><RoundedBox args={[4.1, 0.42, 2.0]} radius={0.2} smoothness={5} position={[0, 0.72, 0]} castShadow><meshStandardMaterial color="#718b96" roughness={0.44} /></RoundedBox><mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.5, 0.12, 12, 52]} /><meshStandardMaterial color="#4f6d78" metalness={0.36} roughness={0.34} /></mesh></>}
      {kind === "echo" && <>{[0, 1, 2].map((index) => <mesh key={index} position={[-1.1 + index * 1.1, 0.9 + index * 0.38, 0]} castShadow><cylinderGeometry args={[0.5, 0.65, 1.2 + index * 0.72, 26]} /><meshStandardMaterial color="#92869a" roughness={0.5} /></mesh>)}<mesh position={[0, 2.65, 0]}><torusGeometry args={[1.5, 0.12, 12, 52]} /><meshStandardMaterial color="#af9bb6" roughness={0.38} /></mesh></>}
      {kind === "research" && <><RoundedBox args={[2.1, 3.65, 2.1]} radius={0.28} smoothness={6} position={[0, 2.05, 0]} castShadow><meshStandardMaterial color="#778da5" roughness={0.46} /></RoundedBox><Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.1}><mesh position={[0, 4.35, 0]} rotation={[0.24, 0.18, 0]}><torusGeometry args={[0.86, 0.08, 12, 52]} /><meshStandardMaterial color="#bcc9d5" metalness={0.26} roughness={0.34} /></mesh></Float></>}
    </group>
  );
}

function World({ playing, night, bladeAngle, outputRpm }: Omit<SenjerCitySceneProps, "activeDistrict">) {
  return (
    <group>
      <mesh position={[0, -3.25, 0]} receiveShadow castShadow><cylinderGeometry args={[21.5, 23.5, 3.5, 72]} /><meshStandardMaterial color={night ? "#263d47" : "#98adb5"} roughness={0.78} /></mesh>
      <mesh position={[0, -6.3, 0]} castShadow><coneGeometry args={[17.5, 6.0, 64]} /><meshStandardMaterial color={night ? "#192b34" : "#718791"} roughness={0.86} /></mesh>
      <mesh position={[0, -1.56, 0]} receiveShadow><cylinderGeometry args={[20.8, 20.8, 0.16, 72]} /><meshStandardMaterial color={night ? "#374f59" : "#b8c8cc"} roughness={0.66} /></mesh>
      <EnergyCore playing={playing} night={night} /><SkyGarden playing={playing} bladeAngle={bladeAngle} outputRpm={outputRpm} /><WaterGarden playing={playing} />
      <DistantDistrict kind="transit" position={[0, -0.25, 13.4]} /><DistantDistrict kind="echo" position={[-14, 0.1, 8.8]} /><DistantDistrict kind="research" position={[14, 2.35, -9.4]} />
      <Bridge points={[[-7.8, 1.48, -4.2], [-5.2, 1.15, -2.7], [-3.4, 0.9, -1.3]]} /><Bridge points={[[3.6, 0.78, 1.6], [6.0, 0.52, 3.5], [8.4, 0.28, 4.9]]} /><Bridge points={[[0, 0.42, 4.0], [0.15, 0.14, 7.6], [0, -0.04, 9.8]]} /><Bridge points={[[-3.2, 0.78, 2.0], [-7.6, 0.5, 5.2], [-10.3, 0.32, 6.9]]} /><Bridge points={[[3.0, 0.92, -2.0], [8.0, 1.7, -5.2], [10.3, 2.1, -6.9]]} />
      {Array.from({ length: 20 }, (_, index) => { const angle = index / 20 * Math.PI * 2; const radius = 7 + (index % 4) * 1.25; return <Tree key={index} position={[Math.cos(angle) * radius, -1.25, Math.sin(angle) * radius]} scale={0.72 + (index % 3) * 0.1} />; })}
    </group>
  );
}

export function SenjerCityScene(props: SenjerCitySceneProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const transitioning = useRef(true);
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: presets.sky.position, fov: 44, near: 0.3, far: 145 }} gl={{ antialias: true, alpha: false, toneMappingExposure: props.night ? 0.82 : 0.9 }}>
      <color attach="background" args={[props.night ? "#13252f" : "#c8dbe3"]} /><fog attach="fog" args={[props.night ? "#13252f" : "#c8dbe3", 44, 112]} />
      <ambientLight intensity={props.night ? 0.34 : 0.58} /><hemisphereLight args={[props.night ? "#567989" : "#edf7f6", props.night ? "#14242b" : "#718891", props.night ? 0.42 : 0.72]} />
      <directionalLight position={[17, 25, 13]} intensity={props.night ? 1.0 : 1.5} color={props.night ? "#bddbe5" : "#fff2d7"} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-29} shadow-camera-right={29} shadow-camera-top={29} shadow-camera-bottom={-29} shadow-camera-near={1} shadow-camera-far={70} shadow-bias={-0.00018} />
      <Suspense fallback={null}><World playing={props.playing} night={props.night} bladeAngle={props.bladeAngle} outputRpm={props.outputRpm} /></Suspense>
      <ContactShadows position={[0, -1.5, 0]} opacity={props.night ? 0.23 : 0.33} scale={52} blur={3.2} far={31} />
      <CameraTransition district={props.activeDistrict} controls={controls} active={transitioning} />
      <OrbitControls ref={controls} makeDefault target={presets.sky.target} minDistance={7} maxDistance={44} minPolarAngle={0.4} maxPolarAngle={1.38} enablePan screenSpacePanning={false} enableDamping dampingFactor={0.08} onStart={() => { transitioning.current = false; }} />
    </Canvas>
  );
}
