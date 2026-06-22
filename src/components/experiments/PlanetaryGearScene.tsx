import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group } from "three";
import { rpmToRadiansPerSecond } from "../../lib/gearMath";
import { useExperimentStore } from "../../store/useExperimentStore";
import { createGearGeometry } from "../gear/createGearGeometry";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";

const SUN_TEETH = 18;
const PLANET_TEETH = 18;
const RING_TEETH = 54;
const MODULE = 0.145;
const PLANET_RADIUS = (MODULE * (SUN_TEETH + PLANET_TEETH)) / 2;
const RING_PITCH_RADIUS = (MODULE * RING_TEETH) / 2;

function getSpeeds(inputRpm: number, direction: 1 | -1, variant: number) {
  const input = inputRpm * direction;
  let sun = 0;
  let ring = 0;
  let carrier = 0;

  if (variant === 0) {
    sun = input;
    carrier = (sun * SUN_TEETH) / (SUN_TEETH + RING_TEETH);
  } else if (variant === 1) {
    ring = input;
    carrier = (ring * RING_TEETH) / (SUN_TEETH + RING_TEETH);
  } else {
    sun = input;
    ring = -(sun * SUN_TEETH) / RING_TEETH;
  }

  const planet = carrier - (SUN_TEETH / PLANET_TEETH) * (sun - carrier);
  return { sun, ring, carrier, planet };
}

function PlanetaryMechanism() {
  const sunRef = useRef<Group>(null);
  const ringRef = useRef<Group>(null);
  const carrierRef = useRef<Group>(null);
  const planetRefs = useRef<Array<Group | null>>([]);
  const angles = useRef({ sun: 0, ring: 0, carrier: 0, planet: 0 });
  const speed = useExperimentStore((state) => state.speed);
  const direction = useExperimentStore((state) => state.direction);
  const variant = useExperimentStore((state) => state.variant);
  const planetCount = useExperimentStore((state) => Math.round(state.primary));
  const isPlaying = useExperimentStore((state) => state.isPlaying);
  const sunGeometry = useMemo(() => createGearGeometry(SUN_TEETH, 0.44), []);
  const planetGeometry = useMemo(() => createGearGeometry(PLANET_TEETH, 0.44), []);
  const speeds = getSpeeds(speed, direction, variant);

  useEffect(() => () => {
    sunGeometry.dispose();
    planetGeometry.dispose();
  }, [planetGeometry, sunGeometry]);

  useFrame((_, delta) => {
    if (isPlaying) {
      angles.current.sun += rpmToRadiansPerSecond(speeds.sun) * delta;
      angles.current.ring += rpmToRadiansPerSecond(speeds.ring) * delta;
      angles.current.carrier += rpmToRadiansPerSecond(speeds.carrier) * delta;
      angles.current.planet += rpmToRadiansPerSecond(speeds.planet) * delta;
    }

    if (sunRef.current) sunRef.current.rotation.y = angles.current.sun;
    if (ringRef.current) ringRef.current.rotation.y = angles.current.ring;
    if (carrierRef.current) carrierRef.current.rotation.y = angles.current.carrier;
    planetRefs.current.forEach((planet) => {
      if (planet) planet.rotation.y = angles.current.planet - angles.current.carrier;
    });
  });

  const planets = Array.from({ length: planetCount }, (_, index) => (index * Math.PI * 2) / planetCount);

  return (
    <group>
      <RoundedBox args={[9.5, 0.34, 9.5]} radius={0.16} smoothness={5} position={[0, -0.92, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f484d" metalness={0.28} roughness={0.46} />
      </RoundedBox>
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[4.7, 4.7, 0.18, 96]} />
        <meshStandardMaterial color="#40585e" metalness={0.38} roughness={0.38} />
      </mesh>

      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[RING_PITCH_RADIUS + 0.28, 0.3, 28, 144]} />
          <meshStandardMaterial color="#3f6871" metalness={0.66} roughness={0.26} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.24, 0]}>
          <torusGeometry args={[RING_PITCH_RADIUS + 0.28, 0.11, 18, 144]} />
          <meshStandardMaterial color="#789096" metalness={0.6} roughness={0.25} />
        </mesh>
        {Array.from({ length: RING_TEETH }, (_, index) => {
          const angle = (index * Math.PI * 2) / RING_TEETH;
          return (
            <group key={index} rotation={[0, -angle, 0]}>
              <mesh position={[RING_PITCH_RADIUS - 0.12, 0, 0]} castShadow>
                <boxGeometry args={[0.24, 0.46, 0.115]} />
                <meshStandardMaterial color="#5f8790" metalness={0.64} roughness={0.24} />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={sunRef}>
        <mesh geometry={sunGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#c98c37" metalness={0.72} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 1.25, 40]} />
          <meshStandardMaterial color="#2c4147" metalness={0.86} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.29, 0.055, 14, 40]} />
          <meshStandardMaterial color="#84908e" metalness={0.65} roughness={0.22} />
        </mesh>
      </group>

      <group ref={carrierRef}>
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.72, 0.18, 64]} />
          <meshStandardMaterial color="#53676a" metalness={0.55} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.14, 64]} />
          <meshStandardMaterial color="#6f7f7d" metalness={0.5} roughness={0.3} />
        </mesh>

        {planets.map((angle, index) => (
          <group key={index} rotation={[0, -angle, 0]}>
            <RoundedBox args={[PLANET_RADIUS, 0.14, 0.28]} radius={0.06} smoothness={4} position={[PLANET_RADIUS / 2, -0.38, 0]} castShadow>
              <meshStandardMaterial color="#6d7b79" metalness={0.55} roughness={0.3} />
            </RoundedBox>
            <RoundedBox args={[PLANET_RADIUS, 0.11, 0.22]} radius={0.05} smoothness={4} position={[PLANET_RADIUS / 2, 0.4, 0]} castShadow>
              <meshStandardMaterial color="#889491" metalness={0.48} roughness={0.31} />
            </RoundedBox>
            <group
              ref={(node) => {
                planetRefs.current[index] = node;
              }}
              position={[PLANET_RADIUS, 0, 0]}
            >
              <mesh geometry={planetGeometry} castShadow receiveShadow>
                <meshStandardMaterial color="#6f9da5" metalness={0.68} roughness={0.22} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.17, 0.17, 1.0, 36]} />
                <meshStandardMaterial color="#3f5257" metalness={0.84} roughness={0.18} />
              </mesh>
              <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.045, 14, 36]} />
                <meshStandardMaterial color="#919b98" metalness={0.65} roughness={0.22} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      <SceneLabel position={[0, 1.25, 0]}>太阳轮</SceneLabel>
      <SceneLabel position={[4.65, 0.75, -0.2]}>内齿圈</SceneLabel>
      <SceneLabel position={[2.7, 1.15, 0]}>行星轮 × {planetCount}</SceneLabel>
      <SceneLabel position={[-2.6, 0.9, -0.2]}>双侧行星架</SceneLabel>
    </group>
  );
}

export default function PlanetaryGearScene() {
  return (
    <ExperimentCanvas camera={[8.8, 7.2, 10.2]} target={[0, -0.05, 0]} gridY={-1.18} shadowY={-1.12} minDistance={7} maxDistance={20}>
      <PlanetaryMechanism />
    </ExperimentCanvas>
  );
}
