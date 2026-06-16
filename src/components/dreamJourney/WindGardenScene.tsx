import { Float, OrbitControls, RoundedBox, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { CatmullRomCurve3, MathUtils, Vector3, type Group, type Mesh } from "three";

interface WindGardenSceneProps {
  playing: boolean;
  windStrength: number;
  windDirection: number;
  awakenedBells: number;
  onBellAwakened: (index: number) => void;
}

const WHITE = "#FDFEFE";
const SKY = "#DDF3FB";
const MINT = "#D7EEE4";
const BLUSH = "#F8E4EA";
const BLUE = "#8ED9EC";

function SoftMaterial({ color, opacity = 1, emissive = "#000000", emissiveIntensity = 0 }: { color: string; opacity?: number; emissive?: string; emissiveIntensity?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.86}
      metalness={0}
      transparent={opacity < 1}
      opacity={opacity}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

function Cloud({ position, scale = 1, speed = 0.05 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const ref = useRef<Group>(null);
  const originX = position[0];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = originX + Math.sin(clock.elapsedTime * speed) * 1.1;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {[
        [-0.7, 0, 0, 0.72],
        [0, 0.2, 0, 0.9],
        [0.75, 0.02, 0, 0.64],
        [0.25, -0.18, 0.15, 0.72],
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[radius, 28, 20]} />
          <SoftMaterial color={WHITE} opacity={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function FlowerField({ windStrength, windDirection }: { windStrength: number; windDirection: number }) {
  const flowers = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => {
        const row = Math.floor(index / 15);
        const column = index % 15;
        return {
          x: -7 + column * 0.95 + (row % 2) * 0.35,
          z: 1.5 + row * 0.8,
          height: 0.32 + ((index * 17) % 7) * 0.035,
          phase: index * 0.41,
        };
      }),
    [],
  );

  return (
    <group>
      {flowers.map((flower, index) => (
        <Flower key={index} {...flower} windStrength={windStrength} windDirection={windDirection} />
      ))}
    </group>
  );
}

function Flower({ x, z, height, phase, windStrength, windDirection }: { x: number; z: number; height: number; phase: number; windStrength: number; windDirection: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const sway = Math.sin(clock.elapsedTime * (0.65 + windStrength * 0.015) + phase) * (0.035 + windStrength * 0.0018);
    ref.current.rotation.z = sway * Math.cos(windDirection);
    ref.current.rotation.x = sway * Math.sin(windDirection);
  });
  return (
    <group ref={ref} position={[x, 0.02, z]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.018, 0.025, height, 8]} />
        <SoftMaterial color="#A8CDBB" />
      </mesh>
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.07, 14, 10]} />
        <SoftMaterial color={indexColor(x, z)} />
      </mesh>
    </group>
  );
}

function indexColor(x: number, z: number) {
  const value = Math.abs(Math.round((x * 13 + z * 17) * 10)) % 3;
  return value === 0 ? WHITE : value === 1 ? BLUSH : "#CDE9DE";
}

function WindTower({ playing, windStrength }: { playing: boolean; windStrength: number }) {
  const rotor = useRef<Group>(null);
  useFrame((_, delta) => {
    if (playing && rotor.current) rotor.current.rotation.z -= delta * (0.14 + windStrength * 0.006);
  });

  return (
    <group position={[5.2, 0, -1.4]}>
      <RoundedBox args={[2.3, 0.42, 2.3]} radius={0.28} smoothness={8} position={[0, 0.22, 0]} castShadow receiveShadow>
        <SoftMaterial color="#EEF8F9" />
      </RoundedBox>
      <RoundedBox args={[1.55, 5.8, 1.55]} radius={0.42} smoothness={10} position={[0, 3.05, 0]} castShadow>
        <SoftMaterial color={WHITE} />
      </RoundedBox>
      <mesh position={[0, 5.1, 0.9]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.9, 32]} />
        <SoftMaterial color="#B6DCE7" />
      </mesh>
      <group ref={rotor} position={[0, 5.1, 1.35]}>
        <mesh>
          <sphereGeometry args={[0.35, 24, 18]} />
          <SoftMaterial color={BLUE} emissive="#C8F4FA" emissiveIntensity={0.18} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
          <group key={angle} rotation={[0, 0, angle]}>
            <RoundedBox args={[0.48, 2.5, 0.14]} radius={0.16} smoothness={8} position={[0, 1.45, 0]} castShadow>
              <SoftMaterial color={WHITE} />
            </RoundedBox>
          </group>
        ))}
      </group>
      <Sparkles count={18} scale={[4, 5, 4]} size={2.2} speed={0.2} color="#D6F8FF" opacity={0.5} />
    </group>
  );
}

function WindBell({ index, position, awakened, onAwakened }: { index: number; position: [number, number, number]; awakened: boolean; onAwakened: (index: number) => void }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.2 + index) * 0.04;
  });

  return (
    <group
      ref={ref}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onAwakened(index);
      }}
    >
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[0.38, 0.045, 12, 48]} />
        <SoftMaterial color={awakened ? BLUE : "#D7E7EC"} emissive={awakened ? BLUE : "#000000"} emissiveIntensity={awakened ? 0.35 : 0} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.85, 10]} />
        <SoftMaterial color="#BFD6DE" />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.12, 18, 14]} />
        <SoftMaterial color={awakened ? "#FFFFFF" : "#E5EEF1"} emissive={awakened ? "#C7F7FF" : "#000000"} emissiveIntensity={awakened ? 0.7 : 0} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <coneGeometry args={[0.18, 0.48, 18]} />
        <SoftMaterial color={awakened ? BLUSH : "#D8E5E9"} />
      </mesh>
    </group>
  );
}

function WindRibbon({ windStrength, windDirection, playing }: { windStrength: number; windDirection: number; playing: boolean }) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-7.5, 1.1, -2.6),
          new Vector3(-4.5, 1.8, -1.2),
          new Vector3(-1.5, 1.25, 0.6),
          new Vector3(1.9, 1.7, -0.2),
          new Vector3(4.5, 1.2, -1.0),
        ],
        false,
        "centripetal",
      ),
    [],
  );
  const pulse = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!pulse.current || !playing) return;
    const point = curve.getPoint((clock.elapsedTime * (0.035 + windStrength * 0.0015)) % 1);
    pulse.current.position.copy(point);
    pulse.current.rotation.y = windDirection;
  });

  return (
    <group rotation={[0, windDirection * 0.08, 0]}>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.045, 10, false]} />
        <SoftMaterial color="#A8E5F3" opacity={0.72} emissive="#A8E5F3" emissiveIntensity={0.3} />
      </mesh>
      <group ref={pulse}>
        <mesh>
          <sphereGeometry args={[0.13, 18, 14]} />
          <SoftMaterial color="#FFFFFF" emissive="#8FE6F7" emissiveIntensity={0.75} />
        </mesh>
      </group>
    </group>
  );
}

function Petals({ windStrength, windDirection }: { windStrength: number; windDirection: number }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      const mesh = child as Mesh;
      mesh.position.x += (0.002 + windStrength * 0.0002) * Math.cos(windDirection);
      mesh.position.z += (0.002 + windStrength * 0.0002) * Math.sin(windDirection);
      mesh.position.y += Math.sin(clock.elapsedTime + index) * 0.0008;
      mesh.rotation.z += 0.004;
      if (mesh.position.x > 8) mesh.position.x = -8;
      if (mesh.position.z > 6) mesh.position.z = -5;
    });
  });
  const petals = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        position: [
          -8 + ((index * 37) % 160) / 10,
          0.8 + ((index * 23) % 35) / 10,
          -4 + ((index * 19) % 100) / 10,
        ] as [number, number, number],
        color: index % 3 === 0 ? BLUSH : WHITE,
      })),
    [],
  );
  return (
    <group ref={group}>
      {petals.map((petal, index) => (
        <mesh key={index} position={petal.position} rotation={[0.4, index, 0.2]}>
          <planeGeometry args={[0.12, 0.06]} />
          <SoftMaterial color={petal.color} opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function WindGardenWorld(props: WindGardenSceneProps) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[42, 28]} />
        <SoftMaterial color="#EEF8F6" />
      </mesh>
      <mesh position={[0, -0.25, 4]} scale={[1.25, 0.28, 1]} receiveShadow>
        <sphereGeometry args={[10, 64, 32]} />
        <SoftMaterial color="#E6F2EC" />
      </mesh>
      <Cloud position={[-6.5, 6.5, -7]} scale={1.55} />
      <Cloud position={[1.5, 7.2, -9]} scale={1.2} speed={0.035} />
      <Cloud position={[7.5, 5.7, -5]} scale={0.95} speed={0.045} />
      <WindTower playing={props.playing} windStrength={props.windStrength} />
      <FlowerField windStrength={props.windStrength} windDirection={props.windDirection} />
      <WindRibbon windStrength={props.windStrength} windDirection={props.windDirection} playing={props.playing} />
      <Petals windStrength={props.windStrength} windDirection={props.windDirection} />
      {[
        [-4.2, 0.2, -0.7],
        [-0.7, 0.2, 0.7],
        [2.8, 0.2, -0.35],
      ].map((position, index) => (
        <WindBell
          key={index}
          index={index}
          position={position as [number, number, number]}
          awakened={index < props.awakenedBells}
          onAwakened={props.onBellAwakened}
        />
      ))}
    </group>
  );
}

export function WindGardenScene(props: WindGardenSceneProps) {
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [16, 13, 18], zoom: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, toneMappingExposure: 1.12 }}
    >
      <color attach="background" args={[SKY]} />
      <fog attach="fog" args={[SKY, 26, 54]} />
      <ambientLight intensity={1.2} />
      <hemisphereLight args={["#FFFFFF", "#CFE4EA", 1.05]} />
      <directionalLight
        position={[10, 18, 8]}
        intensity={0.9}
        color="#FFF8EB"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-bias={-0.00012}
      />
      <pointLight position={[-7, 8, -3]} color="#F8DDE7" intensity={0.35} distance={24} />
      <pointLight position={[8, 7, 3]} color="#C9F4FA" intensity={0.5} distance={22} />
      <Suspense fallback={null}>
        <WindGardenWorld {...props} />
      </Suspense>
      <OrbitControls
        enableRotate={false}
        enablePan
        enableZoom
        screenSpacePanning
        minZoom={32}
        maxZoom={55}
        enableDamping
        dampingFactor={0.09}
      />
    </Canvas>
  );
}
