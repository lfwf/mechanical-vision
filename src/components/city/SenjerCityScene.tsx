import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { MathUtils, Vector3, type Group } from "three";

interface SenjerCitySceneProps {
  activeDistrict: "core" | "sky" | "water" | "transit" | "echo" | "research";
  playing: boolean;
  night: boolean;
  bladeAngle: number;
  outputRpm: number;
}

type DistrictId = SenjerCitySceneProps["activeDistrict"];

const cameraPresets: Record<DistrictId, { position: [number, number, number]; target: [number, number, number] }> = {
  core: { position: [20, 15, 23], target: [0, 2.2, 0] },
  sky: { position: [-7, 11, 8], target: [-14.5, 4.2, -7] },
  water: { position: [25, 10, 20], target: [14.8, 1.2, 8] },
  transit: { position: [10, 10, 29], target: [0, 1.2, 16] },
  echo: { position: [-27, 10, 20], target: [-16.5, 1.8, 10.5] },
  research: { position: [29, 16, -18], target: [16.5, 4.8, -11] },
};

interface ControlsHandle {
  target: Vector3;
  update: () => void;
}

function CameraRig({ activeDistrict, controlsRef }: { activeDistrict: DistrictId; controlsRef: React.RefObject<ControlsHandle | null> }) {
  const camera = useThree((state) => state.camera);
  const destination = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const preset = cameraPresets[activeDistrict];
    destination.set(...preset.position);
    target.set(...preset.target);
    const alpha = 1 - Math.exp(-delta * 2.6);
    camera.position.lerp(destination, alpha);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(target, alpha);
      controlsRef.current.update();
    } else {
      camera.lookAt(target);
    }
  });

  return null;
}

function IslandBase({ radius, height = 0.8, color = "#c9dce5" }: { radius: number; height?: number; color?: string }) {
  return (
    <group>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[radius - 0.25, radius, height, 64]} />
        <meshStandardMaterial color={color} roughness={0.66} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.75, 0]}>
        <coneGeometry args={[radius * 0.82, 1.5, 64]} />
        <meshStandardMaterial color="#8199a5" roughness={0.78} />
      </mesh>
      <mesh position={[0, height / 2 + 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[radius - 0.48, radius - 0.48, 0.08, 64]} />
        <meshStandardMaterial color="#e4eef2" roughness={0.55} />
      </mesh>
    </group>
  );
}

function Bridge({ from, to, width = 1.35 }: { from: [number, number, number]; to: [number, number, number]; width?: number }) {
  const start = useMemo(() => new Vector3(...from), [from]);
  const end = useMemo(() => new Vector3(...to), [to]);
  const direction = useMemo(() => end.clone().sub(start), [end, start]);
  const length = Math.hypot(direction.x, direction.z);
  const midpoint = useMemo(() => start.clone().add(end).multiplyScalar(0.5), [end, start]);
  const angle = -Math.atan2(direction.z, direction.x);

  return (
    <group position={midpoint} rotation={[0, angle, 0]}>
      <RoundedBox args={[length, 0.28, width]} radius={0.12} smoothness={5} receiveShadow castShadow>
        <meshStandardMaterial color="#d6e5eb" roughness={0.5} />
      </RoundedBox>
      {[-width / 2 + 0.12, width / 2 - 0.12].map((z) => (
        <RoundedBox key={z} args={[length, 0.18, 0.1]} radius={0.04} smoothness={3} position={[0, 0.28, z]}>
          <meshStandardMaterial color="#66818e" metalness={0.38} roughness={0.32} />
        </RoundedBox>
      ))}
      {Array.from({ length: Math.max(3, Math.floor(length / 2.4)) }, (_, index) => {
        const x = -length / 2 + 1.1 + index * ((length - 2.2) / Math.max(1, Math.floor(length / 2.4) - 1));
        return (
          <mesh key={index} position={[x, -0.8, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.2, 1.5, 18]} />
            <meshStandardMaterial color="#718a96" roughness={0.48} />
          </mesh>
        );
      })}
    </group>
  );
}

function EnergyTower({ playing, night }: { playing: boolean; night: boolean }) {
  const coreRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && coreRef.current) coreRef.current.rotation.y += delta * 0.16;
  });

  return (
    <group position={[0, 0.4, 0]}>
      <IslandBase radius={5.1} height={1.0} color={night ? "#405763" : "#c5d9e2"} />
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.25, 3.8, 1.7, 64]} />
        <meshStandardMaterial color={night ? "#334b57" : "#e6eef2"} roughness={0.46} />
      </mesh>
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[1.5, 2.2, 1.15, 56]} />
        <meshStandardMaterial color="#66818f" metalness={0.42} roughness={0.3} />
      </mesh>
      <group ref={coreRef} position={[0, 3.05, 0]}>
        <mesh castShadow>
          <torusGeometry args={[2.15, 0.31, 24, 96]} />
          <meshStandardMaterial color="#c9953e" metalness={0.7} roughness={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.78, 0.78, 1.65, 48]} />
          <meshStandardMaterial color="#3f5d6b" metalness={0.66} roughness={0.22} />
        </mesh>
        {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle) => (
          <group key={angle} rotation={[0, -angle, 0]}>
            <mesh position={[1.38, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.5, 36]} />
              <meshStandardMaterial color="#74aebb" metalness={0.52} roughness={0.25} />
            </mesh>
            <RoundedBox args={[1.45, 0.12, 0.22]} radius={0.04} smoothness={3} position={[0.72, -0.42, 0]}>
              <meshStandardMaterial color="#637984" metalness={0.44} roughness={0.32} />
            </RoundedBox>
          </group>
        ))}
      </group>
      <mesh position={[0, 5.35, 0]}>
        <sphereGeometry args={[0.7, 48, 32]} />
        <meshStandardMaterial color="#65c3d0" emissive="#278092" emissiveIntensity={night ? 1.1 : 0.42} roughness={0.16} />
      </mesh>
      <mesh position={[0, 4.55, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.3, 1.15, 24]} />
        <meshStandardMaterial color="#607986" metalness={0.52} roughness={0.28} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = index / 6 * Math.PI * 2;
        return (
          <group key={index} position={[Math.cos(angle) * 3.55, 4.65, Math.sin(angle) * 3.55]} rotation={[0, -angle, 0]}>
            <RoundedBox args={[0.62, 0.86, 0.16]} radius={0.08} smoothness={4} castShadow>
              <meshStandardMaterial color={index < 3 ? "#80cfba" : "#8296a0"} emissive={index < 3 ? "#246c5d" : "#000000"} emissiveIntensity={index < 3 ? 0.18 : 0} roughness={0.3} />
            </RoundedBox>
          </group>
        );
      })}
    </group>
  );
}

function SkyGarden({ playing, bladeAngle, outputRpm }: { playing: boolean; bladeAngle: number; outputRpm: number }) {
  const rotorRef = useRef<Group>(null);
  const platformRef = useRef<Group>(null);
  const safe = outputRpm >= 18 && outputRpm <= 22;

  useFrame((_, delta) => {
    if (playing && rotorRef.current) rotorRef.current.rotation.z -= delta * MathUtils.lerp(0.18, 0.42, bladeAngle / 55);
    if (platformRef.current) {
      const target = safe ? 3.65 : 1.25;
      platformRef.current.position.y = MathUtils.damp(platformRef.current.position.y, target, 2.2, delta);
    }
  });

  return (
    <group position={[-14.5, 2.1, -7]}>
      <IslandBase radius={5.35} height={0.9} />
      <group position={[-1.55, 0.45, 0]}>
        <RoundedBox args={[1.9, 6.7, 1.75]} radius={0.28} smoothness={6} position={[0, 3.15, 0]} castShadow>
          <meshStandardMaterial color="#dce8ed" roughness={0.48} />
        </RoundedBox>
        <RoundedBox args={[2.5, 0.5, 2.25]} radius={0.18} smoothness={5} position={[0, 0.25, 0]} castShadow>
          <meshStandardMaterial color="#76909c" metalness={0.32} roughness={0.36} />
        </RoundedBox>
        <mesh position={[0, 5.65, 1.0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 1.45, 40]} />
          <meshStandardMaterial color="#496773" metalness={0.62} roughness={0.24} />
        </mesh>
        <group ref={rotorRef} position={[0, 5.65, 1.72]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.44, 36]} />
            <meshStandardMaterial color="#3f5e6c" metalness={0.66} roughness={0.22} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
            <group key={angle} rotation={[0, 0, angle]}>
              <RoundedBox args={[0.48, 2.75, 0.2]} radius={0.14} smoothness={5} position={[0, 1.55, 0]} rotation={[0, 0, bladeAngle * Math.PI / 720]} castShadow>
                <meshStandardMaterial color="#edf4f6" metalness={0.12} roughness={0.34} />
              </RoundedBox>
            </group>
          ))}
        </group>
      </group>

      <group position={[2.1, 0.45, 0]}>
        <RoundedBox args={[1.1, 5.7, 1.1]} radius={0.18} smoothness={5} position={[0, 2.75, 0]} castShadow>
          <meshStandardMaterial color="#6d8793" metalness={0.36} roughness={0.35} />
        </RoundedBox>
        <group ref={platformRef} position={[0, 1.25, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.65, 1.85, 0.4, 48]} />
            <meshStandardMaterial color="#e5eef2" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <torusGeometry args={[1.38, 0.075, 14, 64]} />
            <meshStandardMaterial color={safe ? "#70cfb7" : "#63b9c9"} emissive={safe ? "#246a5b" : "#245c68"} emissiveIntensity={0.18} />
          </mesh>
          {Array.from({ length: 8 }, (_, index) => {
            const angle = index / 8 * Math.PI * 2;
            return (
              <mesh key={index} position={[Math.cos(angle) * 1.38, 0.72, Math.sin(angle) * 1.38]}>
                <cylinderGeometry args={[0.045, 0.045, 0.55, 12]} />
                <meshStandardMaterial color="#5f7783" metalness={0.4} roughness={0.32} />
              </mesh>
            );
          })}
        </group>
      </group>

      {[[-3.7, 0.7, 2.5], [0.2, 0.65, -3.0], [3.8, 0.7, 2.45]].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          <mesh castShadow><cylinderGeometry args={[0.62, 0.76, 0.54, 28]} /><meshStandardMaterial color="#a8c3b0" roughness={0.56} /></mesh>
          <mesh position={[0, 0.85, 0]} castShadow><sphereGeometry args={[0.72, 24, 18]} /><meshStandardMaterial color="#6d9b7e" roughness={0.66} /></mesh>
        </group>
      ))}
    </group>
  );
}

function WaterGarden({ playing }: { playing: boolean }) {
  const wheelRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && wheelRef.current) wheelRef.current.rotation.z += delta * 0.2;
  });

  return (
    <group position={[14.8, -0.1, 8]}>
      <IslandBase radius={5.8} height={1.0} />
      <mesh position={[0, 0.75, 0]} receiveShadow>
        <cylinderGeometry args={[4.35, 4.55, 0.46, 64]} />
        <meshStandardMaterial color="#6bb6cf" transparent opacity={0.72} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[4.55, 4.55, 0.52, 64]} />
        <meshStandardMaterial color="#d7e7ed" roughness={0.5} />
      </mesh>

      <group position={[-2.6, 1.15, -0.9]}>
        <RoundedBox args={[2.6, 1.8, 2.2]} radius={0.24} smoothness={6} castShadow>
          <meshStandardMaterial color="#dce9ee" roughness={0.46} />
        </RoundedBox>
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.86, 0.56, 36]} />
          <meshStandardMaterial color="#66828f" metalness={0.42} roughness={0.32} />
        </mesh>
      </group>

      <group ref={wheelRef} position={[-2.45, 2.15, 1.1]}>
        <mesh castShadow><torusGeometry args={[1.25, 0.18, 18, 64]} /><meshStandardMaterial color="#c9953e" metalness={0.66} roughness={0.24} /></mesh>
        {[0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3].map((angle) => (
          <RoundedBox key={angle} args={[0.16, 2.15, 0.28]} radius={0.04} smoothness={4} rotation={[0, 0, angle]}>
            <meshStandardMaterial color="#496976" metalness={0.5} roughness={0.28} />
          </RoundedBox>
        ))}
      </group>

      <RoundedBox args={[5.4, 0.34, 0.72]} radius={0.14} smoothness={5} position={[0.65, 1.25, -1.75]} rotation={[0, 0.18, 0]} castShadow>
        <meshStandardMaterial color="#dceaf0" roughness={0.42} />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.34, 3.5]} radius={0.14} smoothness={5} position={[2.55, 1.25, -0.15]} castShadow>
        <meshStandardMaterial color="#dceaf0" roughness={0.42} />
      </RoundedBox>

      {[-2.1, 0, 2.1].map((x) => (
        <group key={x} position={[x, 1.05, 2.0]}>
          <mesh castShadow><cylinderGeometry args={[0.72, 0.9, 0.58, 32]} /><meshStandardMaterial color="#e3edf1" roughness={0.44} /></mesh>
          <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.08, 0.15, 1.6, 22]} /><meshStandardMaterial color="#56bbd1" emissive="#1f7180" emissiveIntensity={0.2} /></mesh>
          <mesh position={[0, 1.72, 0]}><sphereGeometry args={[0.16, 18, 12]} /><meshStandardMaterial color="#7dd1df" emissive="#2b7c89" emissiveIntensity={0.18} /></mesh>
        </group>
      ))}
    </group>
  );
}

function SilhouetteDistrict({ kind, position }: { kind: "transit" | "echo" | "research"; position: [number, number, number] }) {
  return (
    <group position={position}>
      <IslandBase radius={4.4} height={0.8} color="#b9ccd5" />
      {kind === "transit" && (
        <>
          <RoundedBox args={[5.5, 0.5, 2.6]} radius={0.24} smoothness={6} position={[0, 0.8, 0]} castShadow>
            <meshStandardMaterial color="#78919d" roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 2.0, 0]}>
            <torusGeometry args={[2.1, 0.16, 14, 64, Math.PI]} />
            <meshStandardMaterial color="#536f7c" metalness={0.42} roughness={0.3} />
          </mesh>
        </>
      )}
      {kind === "echo" && (
        <>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[-1.5 + index * 1.5, 1.0 + index * 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.7, 0.9, 1.6 + index * 1.1, 32]} />
              <meshStandardMaterial color="#8f8299" roughness={0.46} />
            </mesh>
          ))}
          <mesh position={[0, 3.4, 0]}><torusGeometry args={[2.1, 0.16, 14, 64]} /><meshStandardMaterial color="#b29bbb" metalness={0.26} roughness={0.36} /></mesh>
        </>
      )}
      {kind === "research" && (
        <>
          <RoundedBox args={[2.8, 4.8, 2.8]} radius={0.34} smoothness={6} position={[0, 2.7, 0]} castShadow>
            <meshStandardMaterial color="#7b8fa7" roughness={0.42} />
          </RoundedBox>
          <Float speed={0.7} rotationIntensity={0.06} floatIntensity={0.12}>
            <mesh position={[0, 5.7, 0]} rotation={[0.3, 0.2, 0]}><torusGeometry args={[1.15, 0.11, 14, 64]} /><meshStandardMaterial color="#b7c7d8" metalness={0.34} roughness={0.3} /></mesh>
          </Float>
        </>
      )}
    </group>
  );
}

function CityWorld({ playing, night, bladeAngle, outputRpm }: Omit<SenjerCitySceneProps, "activeDistrict">) {
  return (
    <group>
      <mesh position={[0, -4.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[24.5, 27, 4.5, 72]} />
        <meshStandardMaterial color={night ? "#283d48" : "#9eb4bf"} roughness={0.72} />
      </mesh>
      <mesh position={[0, -8.0, 0]} castShadow>
        <coneGeometry args={[20, 7.8, 64]} />
        <meshStandardMaterial color={night ? "#1b2d36" : "#748b97"} roughness={0.82} />
      </mesh>
      <mesh position={[0, -1.76, 0]} receiveShadow>
        <cylinderGeometry args={[23.8, 23.8, 0.22, 72]} />
        <meshStandardMaterial color={night ? "#344e59" : "#c8d9e0"} roughness={0.62} />
      </mesh>

      <EnergyTower playing={playing} night={night} />
      <SkyGarden playing={playing} bladeAngle={bladeAngle} outputRpm={outputRpm} />
      <WaterGarden playing={playing} />
      <SilhouetteDistrict kind="transit" position={[0, -0.45, 16]} />
      <SilhouetteDistrict kind="echo" position={[-16.5, 0.1, 10.5]} />
      <SilhouetteDistrict kind="research" position={[16.5, 2.8, -11]} />

      <Bridge from={[-10.1, 1.95, -5.25]} to={[-4.4, 1.0, -1.55]} />
      <Bridge from={[4.45, 0.85, 2.1]} to={[9.45, 0.35, 5.4]} />
      <Bridge from={[0, 0.55, 5.0]} to={[0, -0.1, 11.7]} />
      <Bridge from={[-4.05, 0.9, 2.7]} to={[-12.2, 0.55, 8.0]} width={1.2} />
      <Bridge from={[3.8, 1.1, -2.8]} to={[12.7, 3.0, -8.1]} width={1.2} />

      {Array.from({ length: 18 }, (_, index) => {
        const angle = index / 18 * Math.PI * 2;
        const radius = 8.2 + (index % 3) * 1.45;
        return (
          <group key={index} position={[Math.cos(angle) * radius, -1.2, Math.sin(angle) * radius]}>
            <mesh castShadow><cylinderGeometry args={[0.28, 0.36, 0.38, 16]} /><meshStandardMaterial color="#8eaa97" roughness={0.58} /></mesh>
            <mesh position={[0, 0.5, 0]} castShadow><sphereGeometry args={[0.38, 16, 12]} /><meshStandardMaterial color="#5f8c71" roughness={0.7} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

export function SenjerCityScene(props: SenjerCitySceneProps) {
  const controlsRef = useRef<ControlsHandle | null>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 1.7]}
      camera={{ position: cameraPresets.sky.position, fov: 45, near: 0.35, far: 160 }}
      gl={{ antialias: true, alpha: false, toneMappingExposure: props.night ? 0.82 : 0.72 }}
    >
      <color attach="background" args={[props.night ? "#13252f" : "#cfe2ea"]} />
      <fog attach="fog" args={[props.night ? "#13252f" : "#cfe2ea", 52, 125]} />
      <ambientLight intensity={props.night ? 0.32 : 0.52} />
      <hemisphereLight args={[props.night ? "#567889" : "#edf7fa", props.night ? "#13232b" : "#718995", props.night ? 0.45 : 0.72]} />
      <directionalLight
        position={[18, 28, 14]}
        intensity={props.night ? 1.15 : 1.75}
        color={props.night ? "#b9d8e4" : "#fff5df"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.00015}
      />
      <Suspense fallback={null}>
        <CityWorld playing={props.playing} night={props.night} bladeAngle={props.bladeAngle} outputRpm={props.outputRpm} />
      </Suspense>
      <ContactShadows position={[0, -1.6, 0]} opacity={props.night ? 0.28 : 0.4} scale={60} blur={2.8} far={36} />
      <CameraRig activeDistrict={props.activeDistrict} controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={cameraPresets.sky.target}
        minDistance={10}
        maxDistance={52}
        minPolarAngle={0.45}
        maxPolarAngle={1.28}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
