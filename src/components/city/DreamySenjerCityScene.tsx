import { ContactShadows, Float, OrbitControls, RoundedBox, Sparkles } from "@react-three/drei";
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

const PRESETS: Record<DistrictId, { position: [number, number, number]; target: [number, number, number] }> = {
  core: { position: [15, 11, 18], target: [0, 2.1, 0] },
  sky: { position: [-3, 8, 9], target: [-10.5, 2.8, -5.8] },
  water: { position: [19, 8, 15], target: [10.8, 1.2, 6.4] },
  transit: { position: [8, 8, 22], target: [0, 1, 12.5] },
  echo: { position: [-21, 8, 15], target: [-12.5, 1.5, 8] },
  research: { position: [22, 11, -14], target: [12.8, 3.6, -8.5] },
};

const COLORS = {
  cream: "#FFF8F1",
  pearl: "#F7FBFD",
  mist: "#DCEFF4",
  sky: "#CFEAF5",
  aqua: "#9EDBE2",
  mint: "#BFE7D4",
  blush: "#F2D5DE",
  lavender: "#DCCFF0",
  lilac: "#C8B9E4",
  peach: "#F6C9A8",
  blue: "#8DBFD8",
  text: "#6A7D8A",
};

function CameraTransition({
  district,
  controls,
  active,
}: {
  district: DistrictId;
  controls: MutableRefObject<OrbitControlsImpl | null>;
  active: MutableRefObject<boolean>;
}) {
  const camera = useThree((state) => state.camera);
  const destination = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    active.current = true;
  }, [district, active]);

  useFrame((_, delta) => {
    if (!active.current) return;
    const preset = PRESETS[district];
    destination.set(...preset.position);
    target.set(...preset.target);
    const alpha = 1 - Math.exp(-delta * 3.2);
    camera.position.lerp(destination, alpha);
    if (controls.current) {
      controls.current.target.lerp(target, alpha);
      controls.current.update();
    }
    if (
      camera.position.distanceTo(destination) < 0.04 &&
      (!controls.current || controls.current.target.distanceTo(target) < 0.04)
    ) {
      active.current = false;
    }
  });

  return null;
}

function SoftMaterial({ color, emissive = "#000000", emissiveIntensity = 0 }: { color: string; emissive?: string; emissiveIntensity?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.72}
      metalness={0}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function FloatingIsland({ radius, topColor = COLORS.cream }: { radius: number; topColor?: string }) {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius - 0.15, radius, 0.58, 64]} />
        <SoftMaterial color={COLORS.mist} />
      </mesh>
      <mesh position={[0, 0.34, 0]} receiveShadow>
        <cylinderGeometry args={[radius - 0.34, radius - 0.34, 0.1, 64]} />
        <SoftMaterial color={topColor} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <coneGeometry args={[radius * 0.76, 1.3, 64]} />
        <SoftMaterial color="#B9D4DE" />
      </mesh>
    </group>
  );
}

function SoftTree({ position, scale = 1, color = COLORS.mint }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.34, 12]} />
        <SoftMaterial color="#C8B59D" />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.26, 20, 16]} />
        <SoftMaterial color={color} />
      </mesh>
      <mesh position={[0.18, 0.28, 0.04]} castShadow>
        <sphereGeometry args={[0.18, 18, 14]} />
        <SoftMaterial color={color} />
      </mesh>
    </group>
  );
}

function RibbonBridge({ points, color = COLORS.pearl }: { points: Array<[number, number, number]>; color?: string }) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal"),
    [points],
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 72, 0.42, 12, false]} />
        <SoftMaterial color={color} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.045, 8, false]} />
        <SoftMaterial color={COLORS.aqua} emissive="#BFEFF5" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function DreamCore({ playing, night }: { playing: boolean; night: boolean }) {
  const halo = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && halo.current) halo.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={[0, 0.3, 0]}>
      <FloatingIsland radius={4.35} topColor={night ? "#D7D4EB" : COLORS.cream} />
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.75, 3.15, 1.05, 64]} />
        <SoftMaterial color={COLORS.pearl} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.8, 0.82, 56]} />
        <SoftMaterial color={COLORS.lavender} />
      </mesh>
      <group ref={halo} position={[0, 2.55, 0]}>
        <mesh>
          <torusGeometry args={[1.35, 0.14, 18, 80]} />
          <SoftMaterial color={COLORS.peach} emissive="#FFE1CC" emissiveIntensity={0.22} />
        </mesh>
        {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9]}>
            <sphereGeometry args={[0.23, 24, 18]} />
            <SoftMaterial color={COLORS.aqua} emissive="#D7FAFF" emissiveIntensity={0.16} />
          </mesh>
        ))}
      </group>
      <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.16}>
        <mesh position={[0, 3.85, 0]}>
          <sphereGeometry args={[0.48, 36, 26]} />
          <SoftMaterial color={COLORS.aqua} emissive="#D2F7FB" emissiveIntensity={night ? 0.85 : 0.32} />
        </mesh>
      </Float>
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.72, 18]} />
        <SoftMaterial color={COLORS.lilac} />
      </mesh>
      <Sparkles count={18} scale={[5, 4, 5]} size={2.2} speed={0.25} color="#FFFFFF" opacity={0.55} />
    </group>
  );
}

function SkyGarden({ playing, bladeAngle, outputRpm }: { playing: boolean; bladeAngle: number; outputRpm: number }) {
  const rotor = useRef<Group>(null);
  const lift = useRef<Group>(null);
  const ready = outputRpm >= 18 && outputRpm <= 22;

  useFrame((_, delta) => {
    if (playing && rotor.current) rotor.current.rotation.z -= delta * MathUtils.lerp(0.12, 0.3, bladeAngle / 55);
    if (lift.current) lift.current.position.y = MathUtils.damp(lift.current.position.y, ready ? 2.15 : 0.82, 2, delta);
  });

  return (
    <group position={[-10.5, 1.75, -5.8]}>
      <FloatingIsland radius={4.25} topColor="#F7F4EC" />
      <group position={[-1.25, 0.34, 0]}>
        <RoundedBox args={[1.35, 4.7, 1.35]} radius={0.34} smoothness={8} position={[0, 2.25, 0]} castShadow>
          <SoftMaterial color={COLORS.blush} />
        </RoundedBox>
        <mesh position={[0, 3.8, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.7, 28]} />
          <SoftMaterial color={COLORS.lilac} />
        </mesh>
        <group ref={rotor} position={[0, 3.8, 1.12]}>
          <mesh>
            <sphereGeometry args={[0.28, 24, 18]} />
            <SoftMaterial color={COLORS.aqua} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
            <group key={angle} rotation={[0, 0, angle]}>
              <RoundedBox args={[0.34, 1.72, 0.12]} radius={0.12} smoothness={6} position={[0, 0.98, 0]} rotation={[0, 0, bladeAngle * Math.PI / 900]} castShadow>
                <SoftMaterial color={COLORS.pearl} />
              </RoundedBox>
            </group>
          ))}
        </group>
      </group>
      <group position={[1.45, 0.3, 0]}>
        <RoundedBox args={[0.72, 3.8, 0.72]} radius={0.22} smoothness={6} position={[0, 1.8, 0]} castShadow>
          <SoftMaterial color={COLORS.sky} />
        </RoundedBox>
        <group ref={lift} position={[0, 0.82, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.08, 1.2, 0.26, 44]} />
            <SoftMaterial color={COLORS.pearl} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <torusGeometry args={[0.88, 0.045, 12, 56]} />
            <SoftMaterial color={ready ? COLORS.mint : COLORS.aqua} emissive={ready ? "#D7F8E8" : "#D7F7FA"} emissiveIntensity={0.18} />
          </mesh>
        </group>
      </group>
      <SoftTree position={[-2.8, 0.68, 1.9]} scale={1.08} color={COLORS.mint} />
      <SoftTree position={[0.1, 0.68, -2.25]} color="#D7E9C4" />
      <SoftTree position={[2.7, 0.68, 1.8]} color="#CDE7DA" />
    </group>
  );
}

function WaterGarden({ playing }: { playing: boolean }) {
  const wheel = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && wheel.current) wheel.current.rotation.z += delta * 0.13;
  });

  return (
    <group position={[10.8, -0.1, 6.4]}>
      <FloatingIsland radius={4.55} topColor="#F5FBF9" />
      <mesh position={[0, 0.54, 0]} receiveShadow>
        <cylinderGeometry args={[3.25, 3.5, 0.3, 60]} />
        <meshStandardMaterial color={COLORS.aqua} roughness={0.24} metalness={0} transparent opacity={0.76} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.38, 60]} />
        <SoftMaterial color={COLORS.pearl} />
      </mesh>
      <group position={[-1.85, 0.92, -0.65]}>
        <RoundedBox args={[1.75, 1.28, 1.55]} radius={0.3} smoothness={8} castShadow>
          <SoftMaterial color={COLORS.blush} />
        </RoundedBox>
        <mesh position={[0, 0.78, 0]}>
          <sphereGeometry args={[0.42, 24, 18]} />
          <SoftMaterial color={COLORS.lavender} />
        </mesh>
      </group>
      <group ref={wheel} position={[-1.7, 1.7, 0.78]}>
        <mesh>
          <torusGeometry args={[0.78, 0.1, 14, 56]} />
          <SoftMaterial color={COLORS.peach} />
        </mesh>
        {Array.from({ length: 6 }, (_, index) => (
          <RoundedBox key={index} args={[0.1, 1.3, 0.16]} radius={0.04} smoothness={4} rotation={[0, 0, index / 6 * Math.PI * 2]}>
            <SoftMaterial color={COLORS.sky} />
          </RoundedBox>
        ))}
      </group>
      {[-1.4, 0, 1.4].map((x) => (
        <group key={x} position={[x, 0.82, 1.38]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.46, 0.58, 0.36, 26]} />
            <SoftMaterial color={COLORS.pearl} />
          </mesh>
          <mesh position={[0, 0.58, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 0.9, 16]} />
            <SoftMaterial color={COLORS.aqua} emissive="#D8FAFF" emissiveIntensity={0.16} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DreamDistrict({ kind, position }: { kind: "transit" | "echo" | "research"; position: [number, number, number] }) {
  return (
    <group position={position}>
      <FloatingIsland radius={3.45} topColor="#F8F5F1" />
      {kind === "transit" && (
        <>
          <RoundedBox args={[3.8, 0.38, 1.85]} radius={0.28} smoothness={7} position={[0, 0.68, 0]} castShadow>
            <SoftMaterial color={COLORS.sky} />
          </RoundedBox>
          <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.32, 0.09, 12, 52]} />
            <SoftMaterial color={COLORS.aqua} />
          </mesh>
        </>
      )}
      {kind === "echo" && (
        <>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[-0.95 + index * 0.95, 0.82 + index * 0.34, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.54, 1.05 + index * 0.62, 26]} />
              <SoftMaterial color={index === 1 ? COLORS.blush : COLORS.lavender} />
            </mesh>
          ))}
          <Float speed={0.8} rotationIntensity={0.03} floatIntensity={0.08}>
            <mesh position={[0, 2.35, 0]}>
              <torusGeometry args={[1.28, 0.09, 12, 52]} />
              <SoftMaterial color={COLORS.peach} />
            </mesh>
          </Float>
        </>
      )}
      {kind === "research" && (
        <>
          <RoundedBox args={[1.9, 3.3, 1.9]} radius={0.38} smoothness={8} position={[0, 1.88, 0]} castShadow>
            <SoftMaterial color={COLORS.lavender} />
          </RoundedBox>
          <Float speed={0.7} rotationIntensity={0.05} floatIntensity={0.12}>
            <mesh position={[0, 3.95, 0]} rotation={[0.22, 0.18, 0]}>
              <torusGeometry args={[0.76, 0.07, 12, 52]} />
              <SoftMaterial color={COLORS.aqua} emissive="#D8F8FB" emissiveIntensity={0.15} />
            </mesh>
          </Float>
        </>
      )}
    </group>
  );
}

function DreamWorld({ playing, night, bladeAngle, outputRpm }: Omit<SenjerCitySceneProps, "activeDistrict">) {
  return (
    <group>
      <mesh position={[0, -3.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[19.8, 21.5, 3.1, 72]} />
        <SoftMaterial color={night ? "#8895B3" : "#CFE1E5"} />
      </mesh>
      <mesh position={[0, -5.75, 0]}>
        <coneGeometry args={[16.3, 5.4, 64]} />
        <SoftMaterial color={night ? "#697792" : "#B4CED5"} />
      </mesh>
      <mesh position={[0, -1.47, 0]} receiveShadow>
        <cylinderGeometry args={[19.1, 19.1, 0.14, 72]} />
        <SoftMaterial color={night ? "#BAC1D8" : "#E8F2EF"} />
      </mesh>

      <DreamCore playing={playing} night={night} />
      <SkyGarden playing={playing} bladeAngle={bladeAngle} outputRpm={outputRpm} />
      <WaterGarden playing={playing} />
      <DreamDistrict kind="transit" position={[0, -0.2, 12.5]} />
      <DreamDistrict kind="echo" position={[-12.5, 0.05, 8]} />
      <DreamDistrict kind="research" position={[12.8, 2.1, -8.5]} />

      <RibbonBridge points={[[-7.1, 1.35, -3.9], [-4.7, 1.05, -2.5], [-3.0, 0.85, -1.2]]} />
      <RibbonBridge points={[[3.2, 0.72, 1.45], [5.4, 0.5, 3.15], [7.55, 0.27, 4.45]]} />
      <RibbonBridge points={[[0, 0.38, 3.6], [0.12, 0.12, 7.0], [0, -0.02, 9.1]]} />
      <RibbonBridge points={[[-2.9, 0.7, 1.85], [-6.9, 0.46, 4.7], [-9.25, 0.3, 6.25]]} color="#F1E9F7" />
      <RibbonBridge points={[[2.75, 0.84, -1.85], [7.3, 1.5, -4.7], [9.35, 1.9, -6.15]]} color="#E8F2FA" />

      {Array.from({ length: 18 }, (_, index) => {
        const angle = index / 18 * Math.PI * 2;
        const radius = 6.5 + (index % 3) * 1.35;
        const palette = [COLORS.mint, "#D9EBCB", "#D8E3F3"];
        return (
          <SoftTree
            key={index}
            position={[Math.cos(angle) * radius, -1.18, Math.sin(angle) * radius]}
            scale={0.7 + (index % 3) * 0.1}
            color={palette[index % palette.length]}
          />
        );
      })}
    </group>
  );
}

export function DreamySenjerCityScene(props: SenjerCitySceneProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const transitioning = useRef(true);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: PRESETS.sky.position, fov: 43, near: 0.3, far: 140 }}
      gl={{ antialias: true, alpha: false, toneMappingExposure: props.night ? 0.95 : 1.08 }}
    >
      <color attach="background" args={[props.night ? "#777F9E" : "#EAF6FB"]} />
      <fog attach="fog" args={[props.night ? "#777F9E" : "#EAF6FB", 42, 104]} />
      <ambientLight intensity={props.night ? 0.58 : 0.92} />
      <hemisphereLight args={[props.night ? "#D7D5F0" : "#FFF9F2", props.night ? "#6C7390" : "#BDDCE5", props.night ? 0.72 : 1.05]} />
      <directionalLight
        position={[14, 22, 12]}
        intensity={props.night ? 0.9 : 1.18}
        color={props.night ? "#E4E1FF" : "#FFF4DE"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-27}
        shadow-camera-right={27}
        shadow-camera-top={27}
        shadow-camera-bottom={-27}
        shadow-camera-near={1}
        shadow-camera-far={64}
        shadow-bias={-0.00016}
      />
      <pointLight position={[-8, 10, -5]} color="#F8DCE7" intensity={0.7} distance={30} />
      <pointLight position={[10, 7, 8]} color="#CDEFF5" intensity={0.75} distance={28} />

      <Suspense fallback={null}>
        <DreamWorld playing={props.playing} night={props.night} bladeAngle={props.bladeAngle} outputRpm={props.outputRpm} />
      </Suspense>

      <ContactShadows position={[0, -1.43, 0]} opacity={props.night ? 0.16 : 0.2} scale={48} blur={4.2} far={29} />
      <CameraTransition district={props.activeDistrict} controls={controls} active={transitioning} />
      <OrbitControls
        ref={controls}
        makeDefault
        target={PRESETS.sky.target}
        minDistance={7}
        maxDistance={42}
        minPolarAngle={0.42}
        maxPolarAngle={1.4}
        enablePan
        screenSpacePanning={false}
        enableDamping
        dampingFactor={0.08}
        onStart={() => {
          transitioning.current = false;
        }}
      />
    </Canvas>
  );
}
