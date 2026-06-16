import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import {
  CatmullRomCurve3,
  Color,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { ExplodablePart } from "./ExplodablePart";
import { RodBetween, Spring, TubePath } from "./ScenePrimitives";

const WATER = new Color("#4aa9d3");
const SOAP = new Color("#77c7d7");

function FrontPanelFrame() {
  return (
    <group>
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[4.55, 0.85, 0.18]} />
        <meshStandardMaterial color="#eceee9" roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.95, 0]} castShadow>
        <boxGeometry args={[4.55, 1.15, 0.18]} />
        <meshStandardMaterial color="#eceee9" roughness={0.4} />
      </mesh>
      <mesh position={[-1.98, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 3.45, 0.18]} />
        <meshStandardMaterial color="#eceee9" roughness={0.4} />
      </mesh>
      <mesh position={[1.98, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 3.45, 0.18]} />
        <meshStandardMaterial color="#eceee9" roughness={0.4} />
      </mesh>
    </group>
  );
}

function InnerDrum({ drumRef }: { drumRef: RefObject<Group | null> }) {
  return (
    <group ref={drumRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.58, 1.58, 2.65, 72, 1, true]} />
        <meshStandardMaterial
          color="#aab8b7"
          metalness={0.82}
          roughness={0.18}
          side={2}
        />
      </mesh>
      <mesh position={[0, 0, 1.32]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.12, 20, 72]} />
        <meshStandardMaterial color="#8f9d9d" metalness={0.8} roughness={0.18} />
      </mesh>

      {Array.from({ length: 3 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 3;
        return (
          <mesh
            key={`lifter-${index}`}
            position={[Math.cos(angle) * 1.27, Math.sin(angle) * 1.27, 0.15]}
            rotation={[0, 0, angle]}
            castShadow
          >
            <boxGeometry args={[0.2, 0.34, 1.95]} />
            <meshStandardMaterial color="#c9d3d1" metalness={0.42} roughness={0.28} />
          </mesh>
        );
      })}

      {Array.from({ length: 60 }, (_, index) => {
        const angle = (index % 15) * (Math.PI * 2 / 15);
        const z = -1.05 + Math.floor(index / 15) * 0.7;
        return (
          <mesh
            key={`hole-${index}`}
            position={[Math.cos(angle) * 1.57, Math.sin(angle) * 1.57, z]}
          >
            <sphereGeometry args={[0.042, 10, 8]} />
            <meshBasicMaterial color="#3b5257" />
          </mesh>
        );
      })}
    </group>
  );
}

function DirectDriveMotor({ rotorRef }: { rotorRef: RefObject<Group | null> }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.0, 0.18, 24, 72]} />
        <meshStandardMaterial color="#7f6238" metalness={0.56} roughness={0.28} />
      </mesh>
      {Array.from({ length: 18 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 18;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.98, Math.sin(angle) * 0.98, 0]}>
            <boxGeometry args={[0.16, 0.26, 0.16]} />
            <meshStandardMaterial color="#bd7e3e" metalness={0.48} roughness={0.28} />
          </mesh>
        );
      })}
      <group ref={rotorRef} position={[0, 0, -0.3]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.24, 72]} />
          <meshStandardMaterial color="#3f555a" metalness={0.72} roughness={0.2} />
        </mesh>
        <mesh position={[0.78, 0, -0.14]}>
          <boxGeometry args={[0.34, 0.12, 0.08]} />
          <meshStandardMaterial
            color="#f1c760"
            emissive="#6f4f1b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

function WashingMachineAssembly() {
  const drumRef = useRef<Group>(null);
  const rotorRef = useRef<Group>(null);
  const particleRefs = useRef<Array<Mesh | null>>([]);
  const spinAngle = useRef(0);
  const phaseRef = useRef(0);

  const variant = useExperimentStore((state) => state.variant);
  const speed = useExperimentStore((state) => state.speed);
  const waterLevel = useExperimentStore((state) => state.primary);
  const transparency = useExperimentStore((state) => state.secondary);
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const assemblyEnabled = variant === 4;
  const shellOpacity = Math.max(0.12, 1 - transparency / 100);

  const inletCurve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-1.35, 2.6, -2.0),
          new Vector3(-1.35, 2.25, 1.55),
          new Vector3(-0.8, 1.35, 0.8),
          new Vector3(0, 0.7, 0.2),
        ],
        false,
        "centripetal",
      ),
    [],
  );
  const drainCurve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(0, -1.25, 0.2),
          new Vector3(-1.35, -1.85, 1.0),
          new Vector3(-2.25, -0.6, -0.8),
          new Vector3(-2.4, 1.0, -2.25),
        ],
        false,
        "centripetal",
      ),
    [],
  );
  const particles = useMemo(
    () => Array.from({ length: 34 }, (_, index) => index / 34),
    [],
  );

  useFrame(({ clock }, delta) => {
    const visualSpeed = 0.35 + speed / 35;
    if (isPlaying && !assemblyEnabled) {
      phaseRef.current += delta * (0.08 + speed / 720);
      if (variant === 1) {
        spinAngle.current = Math.sin(clock.elapsedTime * visualSpeed * 0.75) * 1.55;
      } else if (variant === 3) {
        spinAngle.current += delta * visualSpeed * 4.5;
      } else {
        spinAngle.current += delta * visualSpeed * 0.12;
      }
    }

    if (drumRef.current) drumRef.current.rotation.z = spinAngle.current;
    if (rotorRef.current) rotorRef.current.rotation.z = spinAngle.current;

    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      particle.visible = !assemblyEnabled;
      if (assemblyEnabled) return;

      const progress = (particles[index] + phaseRef.current) % 1;
      const material = particle.material as MeshStandardMaterial;
      material.color.copy(index % 4 === 0 ? SOAP : WATER);
      material.emissive.copy(WATER).multiplyScalar(0.28);

      if (variant === 0) {
        particle.position.copy(inletCurve.getPoint(progress));
      } else if (variant === 2) {
        particle.position.copy(drainCurve.getPoint(progress));
      } else if (variant === 1) {
        const angle = progress * Math.PI * 2 + clock.elapsedTime * 0.25;
        const radius = 0.55 + (index % 5) * 0.17;
        const level = -1.15 + (waterLevel / 70) * 0.85;
        particle.position.set(
          Math.cos(angle) * radius,
          level + Math.abs(Math.sin(angle * 1.7)) * 0.5,
          -0.15 + Math.sin(progress * Math.PI * 4) * 0.8,
        );
      } else {
        const angle = progress * Math.PI * 2 + spinAngle.current;
        const radius = 1.45 + (index % 3) * 0.22;
        particle.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          -0.6 + (index % 5) * 0.32,
        );
      }
    });
  });

  return (
    <group>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[4.65, 5.45, 4.25]} />
        <meshPhysicalMaterial
          color="#e7eae6"
          roughness={0.38}
          transparent
          opacity={shellOpacity * 0.62}
          transmission={Math.min(0.46, transparency / 165)}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -2.58, 0]} receiveShadow>
        <boxGeometry args={[4.72, 0.24, 4.3]} />
        <meshStandardMaterial color="#4b5f62" metalness={0.32} roughness={0.38} />
      </mesh>

      <ExplodablePart id="wm-top-cover" home={[0, 2.88, 0]} exploded={[0, 4.45, 1.6]} assemblyEnabled={assemblyEnabled} selectionRadius={2.2}>
        <mesh castShadow>
          <boxGeometry args={[4.62, 0.18, 4.18]} />
          <meshStandardMaterial color="#f2f2ed" roughness={0.38} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-control-panel" home={[0, 2.25, 2.16]} exploded={[0, 3.85, 3.85]} assemblyEnabled={assemblyEnabled} selectionRadius={2.0}>
        <mesh castShadow>
          <boxGeometry args={[4.5, 0.78, 0.3]} />
          <meshStandardMaterial color="#e9ebe7" roughness={0.4} />
        </mesh>
        <mesh position={[0.3, 0, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.14, 40]} />
          <meshStandardMaterial color="#52696e" metalness={0.45} roughness={0.28} />
        </mesh>
        <mesh position={[1.4, 0, 0.18]}>
          <boxGeometry args={[1.2, 0.34, 0.06]} />
          <meshStandardMaterial color="#253d42" emissive="#4ca0b1" emissiveIntensity={0.12} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-dispenser" home={[-1.35, 1.92, 1.85]} exploded={[-3.65, 2.7, 3.35]} assemblyEnabled={assemblyEnabled} selectionRadius={0.8}>
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.55, 1.45]} />
          <meshStandardMaterial color="#cbd4d0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.76]}>
          <boxGeometry args={[1.05, 0.45, 0.08]} />
          <meshStandardMaterial color="#eff0ea" roughness={0.42} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-inlet-valve" home={[-1.35, 2.15, -1.72]} exploded={[-3.65, 3.35, -2.75]} assemblyEnabled={assemblyEnabled} selectionRadius={0.55}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.55, 0.6]} />
          <meshStandardMaterial color="#4e686d" metalness={0.28} roughness={0.34} />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.38, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.35, 20]} />
            <meshStandardMaterial color="#71868a" metalness={0.42} roughness={0.3} />
          </mesh>
        ))}
      </ExplodablePart>

      <ExplodablePart id="wm-front-panel" home={[0, -0.05, 2.14]} exploded={[0, -0.05, 5.05]} assemblyEnabled={assemblyEnabled} selectionRadius={2.6}>
        <FrontPanelFrame />
      </ExplodablePart>

      <ExplodablePart id="wm-door" home={[0, 0.25, 2.4]} exploded={[0, 0.25, 6.35]} assemblyEnabled={assemblyEnabled} selectionRadius={1.45}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.28, 0.25, 28, 72]} />
          <meshStandardMaterial color="#50666b" metalness={0.4} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[1.08, 64]} />
          <meshPhysicalMaterial color="#8db6bf" transparent opacity={0.32} transmission={0.72} roughness={0.18} depthWrite={false} />
        </mesh>
        <mesh position={[-1.45, 0, 0]}>
          <boxGeometry args={[0.35, 0.55, 0.24]} />
          <meshStandardMaterial color="#4a5d61" metalness={0.52} roughness={0.28} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-bellow" home={[0, 0.25, 1.72]} exploded={[3.25, 0.45, 3.8]} assemblyEnabled={assemblyEnabled} selectionRadius={1.35}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.35, 0.28, 28, 72]} />
          <meshStandardMaterial color="#697775" roughness={0.56} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-outer-tub" home={[0, 0.25, -0.1]} exploded={[0, 0.25, -3.8]} assemblyEnabled={assemblyEnabled} selectionRadius={2.1}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.92, 1.92, 3.25, 72, 1, true]} />
          <meshPhysicalMaterial color="#8b9d9c" transparent opacity={0.34} transmission={0.25} roughness={0.38} side={2} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, -1.62]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.88, 72]} />
          <meshStandardMaterial color="#6f8281" metalness={0.18} roughness={0.42} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-inner-drum" home={[0, 0.25, 0.05]} exploded={[0, 0.25, 3.0]} assemblyEnabled={assemblyEnabled} selectionRadius={1.85}>
        <InnerDrum drumRef={drumRef} />
      </ExplodablePart>

      <ExplodablePart id="wm-counterweights" home={[0, 0, 0]} exploded={[3.75, 0.8, 0.2]} assemblyEnabled={assemblyEnabled} selectionRadius={1.2}>
        <mesh position={[0, 1.45, 1.05]} castShadow>
          <boxGeometry args={[2.7, 0.55, 0.55]} />
          <meshStandardMaterial color="#6f7470" roughness={0.62} />
        </mesh>
        <mesh position={[0, -1.25, 1.0]} castShadow>
          <boxGeometry args={[2.35, 0.48, 0.52]} />
          <meshStandardMaterial color="#737873" roughness={0.62} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-suspension" home={[0, 0, 0]} exploded={[-4.3, 2.6, 0]} assemblyEnabled={assemblyEnabled} selectionRadius={1.2}>
        <Spring length={1.75} radius={0.18} turns={7} position={[-1.15, 1.85, 0]} rotation={[0, 0, Math.PI / 2]} />
        <Spring length={1.75} radius={0.18} turns={7} position={[1.15, 1.85, 0]} rotation={[0, 0, Math.PI / 2]} />
      </ExplodablePart>

      <ExplodablePart id="wm-dampers" home={[0, 0, 0]} exploded={[-4.2, -1.5, 0.2]} assemblyEnabled={assemblyEnabled} selectionRadius={1.3}>
        <RodBetween start={[-1.25, -2.25, 0.4]} end={[-1.0, -1.15, -0.3]} radius={0.13} color="#5b6d70" />
        <RodBetween start={[1.25, -2.25, 0.4]} end={[1.0, -1.15, -0.3]} radius={0.13} color="#5b6d70" />
      </ExplodablePart>

      <ExplodablePart id="wm-direct-drive-motor" home={[0, 0.25, -1.95]} exploded={[0, 0.25, -5.25]} assemblyEnabled={assemblyEnabled} selectionRadius={1.55}>
        <DirectDriveMotor rotorRef={rotorRef} />
      </ExplodablePart>

      <ExplodablePart id="wm-drain-pump" home={[-1.35, -1.9, 1.0]} exploded={[-3.8, -2.15, 3.45]} assemblyEnabled={assemblyEnabled} selectionRadius={0.65}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.65, 36]} />
          <meshStandardMaterial color="#40595e" metalness={0.4} roughness={0.32} />
        </mesh>
        <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.8, 22]} />
          <meshStandardMaterial color="#657a7d" metalness={0.34} roughness={0.36} />
        </mesh>
      </ExplodablePart>

      <ExplodablePart id="wm-main-pcb" home={[1.35, 2.0, -1.55]} exploded={[3.65, 3.05, -2.85]} assemblyEnabled={assemblyEnabled} selectionRadius={0.75}>
        <mesh castShadow>
          <boxGeometry args={[1.25, 0.78, 0.55]} />
          <meshStandardMaterial color="#4a6267" metalness={0.3} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0, 0.3]}>
          <boxGeometry args={[1.0, 0.58, 0.04]} />
          <meshStandardMaterial color="#6ca17a" metalness={0.14} roughness={0.45} />
        </mesh>
      </ExplodablePart>

      {!assemblyEnabled && (
        <>
          {variant === 0 && (
            <TubePath points={[[-1.35, 2.6, -2.0], [-1.35, 2.25, 1.55], [-0.8, 1.35, 0.8], [0, 0.7, 0.2]]} color="#4aa9d3" radius={0.055} />
          )}
          {variant === 2 && (
            <TubePath points={[[0, -1.25, 0.2], [-1.35, -1.85, 1.0], [-2.25, -0.6, -0.8], [-2.4, 1.0, -2.25]]} color="#4aa9d3" radius={0.055} />
          )}
          {particles.map((_, index) => (
            <mesh key={index} ref={(node) => { particleRefs.current[index] = node; }}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#4aa9d3" emissive="#2f7d99" emissiveIntensity={0.3} />
            </mesh>
          ))}
        </>
      )}

      <SceneLabel position={[0, 3.75, 0]}>LG WM4000HWA · 4.5 cu. ft. 前置滚筒</SceneLabel>
      {!assemblyEnabled && variant === 1 && <SceneLabel position={[3.1, 0.6, 0]}>低速正反转：提升衣物并形成翻滚</SceneLabel>}
      {!assemblyEnabled && variant === 3 && <SceneLabel position={[3.1, 0.6, 0]}>高速脱水：内筒转，外筒悬挂减振</SceneLabel>}
    </group>
  );
}

export default function WashingMachineScene() {
  return (
    <ExperimentCanvas
      camera={[9.8, 7.2, 13.8]}
      target={[0, 0.2, 0]}
      gridY={-2.85}
      shadowY={-2.8}
      minDistance={8}
      maxDistance={24}
    >
      <WashingMachineAssembly />
    </ExperimentCanvas>
  );
}
