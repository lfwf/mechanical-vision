import { ContactShadows, Float, OrbitControls, RoundedBox, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { CatmullRomCurve3, MathUtils, Vector3, type Group, type OrthographicCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export interface SenjerCitySceneProps {
  activeDistrict: "core" | "sky" | "water" | "transit" | "echo" | "research";
  playing: boolean;
  night: boolean;
  bladeAngle: number;
  outputRpm: number;
}

type DistrictId = SenjerCitySceneProps["activeDistrict"];

const PALETTE = {
  background: "#EAF5FB",
  backgroundNight: "#CAD3E6",
  white: "#F8FBFD",
  coolWhite: "#EEF6FA",
  shadow: "#C7DBE7",
  blue: "#8CCBE8",
  brightBlue: "#68D6F0",
  paleBlue: "#CDEAF4",
  pink: "#F1A9C0",
  lavender: "#D9D1EF",
  mint: "#D6EAE2",
  green: "#C7DFD6",
  warm: "#F5D7C8",
  line: "#D3E7F1",
  text: "#708894",
};

const CAMERA_POSITION: [number, number, number] = [20, 24, 20];

const FOCUS: Record<DistrictId, { target: [number, number, number]; zoom: number }> = {
  core: { target: [0, 1.2, 0], zoom: 36 },
  sky: { target: [-8.5, 0.8, -5.5], zoom: 42 },
  water: { target: [8.4, 0.4, 5.5], zoom: 42 },
  transit: { target: [0, 0.35, 9.5], zoom: 44 },
  echo: { target: [-9.5, 0.4, 6.8], zoom: 44 },
  research: { target: [9.5, 0.8, -6.8], zoom: 44 },
};

function Matte({ color, emissive = "#000000", emissiveIntensity = 0, opacity = 1 }: { color: string; emissive?: string; emissiveIntensity?: number; opacity?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0}
      roughness={0.82}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

function CameraController({
  district,
  controls,
  transitioning,
}: {
  district: DistrictId;
  controls: MutableRefObject<OrbitControlsImpl | null>;
  transitioning: MutableRefObject<boolean>;
}) {
  const camera = useThree((state) => state.camera) as OrthographicCamera;
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    transitioning.current = true;
  }, [district, transitioning]);

  useFrame((_, delta) => {
    if (!transitioning.current) return;
    const preset = FOCUS[district];
    target.set(...preset.target);
    const alpha = 1 - Math.exp(-delta * 3.5);

    if (controls.current) {
      controls.current.target.lerp(target, alpha);
      controls.current.update();
    }

    camera.zoom = MathUtils.lerp(camera.zoom, preset.zoom, alpha);
    camera.updateProjectionMatrix();

    if (
      Math.abs(camera.zoom - preset.zoom) < 0.04 &&
      (!controls.current || controls.current.target.distanceTo(target) < 0.03)
    ) {
      transitioning.current = false;
    }
  });

  return null;
}

function EnergyLine({ points, color = PALETTE.brightBlue, active = true }: { points: Array<[number, number, number]>; color?: string; active?: boolean }) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((point) => new Vector3(...point)), false, "centripetal"),
    [points],
  );
  const pulseRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!pulseRef.current || !active) return;
    const point = curve.getPoint((clock.elapsedTime * 0.08) % 1);
    pulseRef.current.position.copy(point);
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.035, 8, false]} />
        <Matte color={active ? color : PALETTE.line} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.28 : 0} />
      </mesh>
      {active && (
        <group ref={pulseRef}>
          <mesh>
            <sphereGeometry args={[0.11, 18, 14]} />
            <Matte color="#FFFFFF" emissive={color} emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.38, 12]} />
        <Matte color="#D3C4B4" />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <coneGeometry args={[0.25, 0.58, 20]} />
        <Matte color={PALETTE.green} />
      </mesh>
    </group>
  );
}

function Person({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.78}>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.13, 18, 14]} />
        <Matte color={PALETTE.white} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.48, 6, 12]} />
        <Matte color={PALETTE.coolWhite} />
      </mesh>
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, -0.02, 0]} rotation={[0, 0, x < 0 ? -0.08 : 0.08]} castShadow>
          <capsuleGeometry args={[0.045, 0.34, 5, 10]} />
          <Matte color={PALETTE.shadow} />
        </mesh>
      ))}
      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]} rotation={[0, 0, x < 0 ? 0.45 : -0.45]} castShadow>
          <capsuleGeometry args={[0.038, 0.3, 5, 10]} />
          <Matte color={PALETTE.white} />
        </mesh>
      ))}
    </group>
  );
}

function DataCrates({ position, rows = 3, columns = 3 }: { position: [number, number, number]; rows?: number; columns?: number }) {
  return (
    <group position={position}>
      {Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        return (
          <RoundedBox
            key={index}
            args={[0.72, 0.34, 0.72]}
            radius={0.05}
            smoothness={4}
            position={[(column - (columns - 1) / 2) * 0.82, 0.18, (row - (rows - 1) / 2) * 0.82]}
            castShadow
          >
            <Matte color={PALETTE.white} />
          </RoundedBox>
        );
      })}
    </group>
  );
}

function CentralBuilding({ playing, night }: { playing: boolean; night: boolean }) {
  const markRef = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && markRef.current) markRef.current.rotation.z -= delta * 0.18;
  });

  return (
    <group position={[0, 0, 0]}>
      <RoundedBox args={[5.5, 0.24, 4.5]} radius={0.34} smoothness={8} position={[0, 0.12, 0]} receiveShadow>
        <Matte color={night ? "#D8DDEC" : PALETTE.coolWhite} />
      </RoundedBox>

      <RoundedBox args={[2.45, 3.6, 2.65]} radius={0.42} smoothness={10} position={[0, 2.0, 0]} castShadow>
        <Matte color={PALETTE.white} />
      </RoundedBox>
      <RoundedBox args={[1.65, 2.7, 2.45]} radius={0.38} smoothness={9} position={[-2.0, 1.55, 0]} castShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      <RoundedBox args={[1.65, 2.7, 2.45]} radius={0.38} smoothness={9} position={[2.0, 1.55, 0]} castShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      <RoundedBox args={[1.75, 0.5, 1.7]} radius={0.18} smoothness={6} position={[0, 4.05, 0]} castShadow>
        <Matte color={PALETTE.white} />
      </RoundedBox>
      <RoundedBox args={[1.3, 0.16, 1.28]} radius={0.08} smoothness={5} position={[0, 4.34, 0]}>
        <Matte color={PALETTE.shadow} />
      </RoundedBox>

      <group ref={markRef} position={[0, 2.4, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = index / 8 * Math.PI * 2;
          return (
            <RoundedBox
              key={index}
              args={[0.16, 0.5, 0.08]}
              radius={0.05}
              smoothness={4}
              position={[Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0]}
              rotation={[0, 0, angle]}
            >
              <Matte color={PALETTE.blue} />
            </RoundedBox>
          );
        })}
      </group>

      <RoundedBox args={[1.15, 1.0, 0.25]} radius={0.12} smoothness={5} position={[0, 0.68, 1.44]}>
        <Matte color={PALETTE.brightBlue} emissive="#BDEFFF" emissiveIntensity={0.34} />
      </RoundedBox>

      <Sparkles count={34} scale={[6.5, 2.2, 5.5]} position={[0, 0.5, 0]} size={2.5} speed={0.22} color="#9FEAFF" opacity={0.72} />
      <EnergyLine points={[[0, 0.17, 1.9], [0.2, 0.17, 4.2], [0.4, 0.17, 6.8]]} />
    </group>
  );
}

function SkyNode({ playing, bladeAngle, outputRpm }: { playing: boolean; bladeAngle: number; outputRpm: number }) {
  const rotorRef = useRef<Group>(null);
  const ready = outputRpm >= 18 && outputRpm <= 22;
  useFrame((_, delta) => {
    if (playing && rotorRef.current) rotorRef.current.rotation.z -= delta * MathUtils.lerp(0.12, 0.28, bladeAngle / 55);
  });

  return (
    <group position={[-8.5, 0, -5.5]}>
      <RoundedBox args={[3.5, 0.18, 2.7]} radius={0.3} smoothness={8} position={[0, 0.09, 0]} receiveShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      <RoundedBox args={[1.5, 3.0, 1.4]} radius={0.36} smoothness={10} position={[0, 1.58, 0]} castShadow>
        <Matte color={PALETTE.white} />
      </RoundedBox>
      <group ref={rotorRef} position={[0, 2.55, 0.76]}>
        <mesh>
          <sphereGeometry args={[0.18, 20, 14]} />
          <Matte color={PALETTE.blue} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
          <group key={angle} rotation={[0, 0, angle]}>
            <RoundedBox args={[0.22, 1.25, 0.08]} radius={0.08} smoothness={5} position={[0, 0.72, 0]} rotation={[0, 0, bladeAngle * Math.PI / 1100]}>
              <Matte color={PALETTE.white} />
            </RoundedBox>
          </group>
        ))}
      </group>
      <mesh position={[1.05, 0.7, 0]}>
        <sphereGeometry args={[0.36, 24, 18]} />
        <Matte color={ready ? PALETTE.mint : PALETTE.paleBlue} emissive={ready ? "#DDF8EB" : "#000000"} emissiveIntensity={ready ? 0.22 : 0} />
      </mesh>
      <Tree position={[-1.25, 0.28, 0.8]} scale={0.78} />
    </group>
  );
}

function WaterNode({ playing }: { playing: boolean }) {
  const pulseRef = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!playing || !pulseRef.current) return;
    pulseRef.current.position.y = 0.5 + Math.sin(clock.elapsedTime * 1.6) * 0.08;
  });

  return (
    <group position={[8.4, 0, 5.5]}>
      <RoundedBox args={[3.8, 0.18, 3.0]} radius={0.34} smoothness={8} position={[0, 0.09, 0]} receiveShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      <mesh position={[0, 0.24, 0]} receiveShadow>
        <cylinderGeometry args={[1.25, 1.38, 0.28, 48]} />
        <meshStandardMaterial color={PALETTE.paleBlue} roughness={0.35} metalness={0} transparent opacity={0.9} />
      </mesh>
      <group ref={pulseRef}>
        {[-0.7, 0, 0.7].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.09, 0.95, 16]} />
              <Matte color={PALETTE.brightBlue} emissive="#CBF7FF" emissiveIntensity={0.25} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.11, 18, 14]} />
              <Matte color="#FFFFFF" emissive={PALETTE.brightBlue} emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
      </group>
      <RoundedBox args={[1.45, 1.3, 1.25]} radius={0.3} smoothness={8} position={[-1.1, 0.8, -0.55]} castShadow>
        <Matte color={PALETTE.white} />
      </RoundedBox>
      <Tree position={[1.25, 0.28, -0.75]} scale={0.72} />
    </group>
  );
}

function TransitNode() {
  return (
    <group position={[0, 0, 9.5]}>
      <RoundedBox args={[4.0, 0.18, 2.2]} radius={0.3} smoothness={8} position={[0, 0.09, 0]} receiveShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      <RoundedBox args={[2.8, 0.7, 1.2]} radius={0.22} smoothness={7} position={[0, 0.5, 0]} castShadow>
        <Matte color={PALETTE.white} />
      </RoundedBox>
      {[-0.65, 0, 0.65].map((x) => (
        <RoundedBox key={x} args={[0.42, 0.18, 0.52]} radius={0.08} smoothness={4} position={[x, 0.58, 0.62]}>
          <Matte color={PALETTE.blue} />
        </RoundedBox>
      ))}
    </group>
  );
}

function EchoNode() {
  return (
    <group position={[-9.5, 0, 6.8]}>
      <RoundedBox args={[3.3, 0.18, 2.7]} radius={0.3} smoothness={8} position={[0, 0.09, 0]} receiveShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      {[0, 1, 2].map((index) => (
        <RoundedBox
          key={index}
          args={[0.55, 1.1 + index * 0.45, 0.72]}
          radius={0.2}
          smoothness={7}
          position={[-0.85 + index * 0.85, 0.65 + index * 0.22, 0]}
          castShadow
        >
          <Matte color={index === 1 ? PALETTE.pink : PALETTE.lavender} />
        </RoundedBox>
      ))}
      <Float speed={0.8} rotationIntensity={0.04} floatIntensity={0.08}>
        <mesh position={[0, 2.15, 0]}>
          <torusGeometry args={[0.78, 0.06, 12, 48]} />
          <Matte color={PALETTE.pink} emissive="#F9D4DF" emissiveIntensity={0.18} />
        </mesh>
      </Float>
    </group>
  );
}

function ResearchNode() {
  return (
    <group position={[9.5, 0, -6.8]}>
      <RoundedBox args={[3.2, 0.18, 2.6]} radius={0.3} smoothness={8} position={[0, 0.09, 0]} receiveShadow>
        <Matte color={PALETTE.coolWhite} />
      </RoundedBox>
      <RoundedBox args={[1.55, 2.8, 1.55]} radius={0.34} smoothness={9} position={[0, 1.5, 0]} castShadow>
        <Matte color={PALETTE.white} />
      </RoundedBox>
      <Float speed={0.65} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh position={[0, 3.15, 0]} rotation={[0.25, 0.2, 0]}>
          <torusGeometry args={[0.68, 0.06, 12, 48]} />
          <Matte color={PALETTE.blue} emissive="#D2F0FA" emissiveIntensity={0.18} />
        </mesh>
      </Float>
      <mesh position={[0, 3.15, 0]}>
        <sphereGeometry args={[0.18, 18, 14]} />
        <Matte color={PALETTE.pink} />
      </mesh>
    </group>
  );
}

function GroundDetails() {
  return (
    <group>
      <DataCrates position={[4.5, 0, -5.2]} rows={3} columns={3} />
      <DataCrates position={[-5.4, 0, 5.0]} rows={2} columns={2} />
      <Person position={[-4.2, 0, -2.0]} rotation={0.8} />
      <Person position={[5.2, 0, 2.4]} rotation={-0.7} />
      <Person position={[6.0, 0, 2.8]} rotation={2.4} />
      <Person position={[-2.2, 0, 5.2]} rotation={0.2} />
      <Tree position={[1.6, 0, 4.5]} scale={0.75} />
      <Tree position={[-1.8, 0, -4.0]} scale={0.8} />
      <Tree position={[3.2, 0, 5.0]} scale={0.7} />
      <Tree position={[-6.0, 0, -1.0]} scale={0.72} />
    </group>
  );
}

function IsometricWorld({ playing, night, bladeAngle, outputRpm }: Omit<SenjerCitySceneProps, "activeDistrict">) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[60, 48]} />
        <Matte color={night ? PALETTE.backgroundNight : PALETTE.background} />
      </mesh>

      <CentralBuilding playing={playing} night={night} />
      <SkyNode playing={playing} bladeAngle={bladeAngle} outputRpm={outputRpm} />
      <WaterNode playing={playing} />
      <TransitNode />
      <EchoNode />
      <ResearchNode />

      <EnergyLine points={[[-7.0, 0.08, -4.4], [-4.4, 0.08, -2.9], [-2.5, 0.08, -1.4]]} color={PALETTE.pink} />
      <EnergyLine points={[[2.4, 0.08, 1.5], [5.0, 0.08, 3.4], [6.8, 0.08, 4.6]]} />
      <EnergyLine points={[[0, 0.08, 2.4], [0, 0.08, 5.5], [0, 0.08, 7.8]]} color={PALETTE.blue} />
      <EnergyLine points={[[-2.2, 0.08, 1.5], [-5.3, 0.08, 3.8], [-7.7, 0.08, 5.6]]} color={PALETTE.lavender} />
      <EnergyLine points={[[2.2, 0.08, -1.4], [5.4, 0.08, -3.9], [7.7, 0.08, -5.7]]} color={PALETTE.paleBlue} />

      <GroundDetails />
    </group>
  );
}

export function DreamySenjerCityScene(props: SenjerCitySceneProps) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const transitioning = useRef(true);

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.6]}
      camera={{ position: CAMERA_POSITION, zoom: FOCUS.sky.zoom, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false, toneMappingExposure: props.night ? 0.96 : 1.12 }}
    >
      <color attach="background" args={[props.night ? PALETTE.backgroundNight : PALETTE.background]} />
      <fog attach="fog" args={[props.night ? PALETTE.backgroundNight : PALETTE.background, 34, 76]} />
      <ambientLight intensity={props.night ? 0.85 : 1.18} />
      <hemisphereLight
        args={[
          props.night ? "#E5E5F8" : "#FFFFFF",
          props.night ? "#A7B2C9" : "#C9E0EA",
          props.night ? 0.8 : 1.15,
        ]}
      />
      <directionalLight
        position={[12, 20, 10]}
        intensity={props.night ? 0.72 : 0.92}
        color={props.night ? "#E8E6FF" : "#FFF7ED"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={55}
        shadow-bias={-0.00012}
      />
      <pointLight position={[-8, 7, -4]} color="#F8DCE7" intensity={0.45} distance={26} />
      <pointLight position={[8, 6, 6]} color="#C9F2FA" intensity={0.55} distance={24} />

      <Suspense fallback={null}>
        <IsometricWorld playing={props.playing} night={props.night} bladeAngle={props.bladeAngle} outputRpm={props.outputRpm} />
      </Suspense>

      <ContactShadows position={[0, -0.02, 0]} opacity={props.night ? 0.12 : 0.16} scale={42} blur={5.5} far={22} />
      <CameraController district={props.activeDistrict} controls={controls} transitioning={transitioning} />
      <OrbitControls
        ref={controls}
        makeDefault
        target={FOCUS.sky.target}
        enableRotate={false}
        enablePan
        enableZoom
        screenSpacePanning
        minZoom={24}
        maxZoom={58}
        enableDamping
        dampingFactor={0.1}
        mouseButtons={{ LEFT: 2, MIDDLE: 1, RIGHT: 2 }}
        onStart={() => {
          transitioning.current = false;
        }}
      />
    </Canvas>
  );
}
