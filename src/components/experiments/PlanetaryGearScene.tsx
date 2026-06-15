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
  const sunGeometry = useMemo(() => createGearGeometry(SUN_TEETH, 0.42), []);
  const planetGeometry = useMemo(() => createGearGeometry(PLANET_TEETH, 0.42), []);
  const speeds = getSpeeds(speed, direction, variant);

  useEffect(
    () => () => {
      sunGeometry.dispose();
      planetGeometry.dispose();
    },
    [planetGeometry, sunGeometry],
  );

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

  const planets = Array.from({ length: planetCount }, (_, index) =>
    (index * Math.PI * 2) / planetCount,
  );

  return (
    <group>
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[RING_PITCH_RADIUS + 0.3, 0.34, 28, 120]} />
          <meshStandardMaterial color="#476f78" metalness={0.62} roughness={0.28} />
        </mesh>
        {Array.from({ length: RING_TEETH }, (_, index) => {
          const angle = (index * Math.PI * 2) / RING_TEETH;
          return (
            <group key={index} rotation={[0, -angle, 0]}>
              <mesh position={[RING_PITCH_RADIUS - 0.12, 0, 0]} castShadow>
                <boxGeometry args={[0.28, 0.42, 0.1]} />
                <meshStandardMaterial color="#5c8993" metalness={0.62} roughness={0.25} />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={sunRef}>
        <mesh geometry={sunGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#d19a46" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.23, 0.23, 1.2, 36]} />
          <meshStandardMaterial color="#394a4f" metalness={0.82} roughness={0.18} />
        </mesh>
      </group>

      <group ref={carrierRef}>
        {planets.map((angle, index) => (
          <group key={index} rotation={[0, -angle, 0]}>
            <mesh position={[PLANET_RADIUS / 2, -0.3, 0]}>
              <boxGeometry args={[PLANET_RADIUS, 0.12, 0.18]} />
              <meshStandardMaterial color="#7a8583" metalness={0.55} roughness={0.3} />
            </mesh>
            <group
              ref={(node) => {
                planetRefs.current[index] = node;
              }}
              position={[PLANET_RADIUS, 0, 0]}
            >
              <mesh geometry={planetGeometry} castShadow receiveShadow>
                <meshStandardMaterial color="#78a7ad" metalness={0.66} roughness={0.23} />
              </mesh>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.9, 32]} />
                <meshStandardMaterial color="#46565a" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          </group>
        ))}
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.18, 48]} />
          <meshStandardMaterial color="#667371" metalness={0.58} roughness={0.28} />
        </mesh>
      </group>

      <SceneLabel position={[0, 1.15, 0]}>太阳轮</SceneLabel>
      <SceneLabel position={[4.5, 0.8, 0]}>内齿圈</SceneLabel>
      <SceneLabel position={[2.8, 1.15, 0]}>行星轮 × {planetCount}</SceneLabel>
    </group>
  );
}

export default function PlanetaryGearScene() {
  return (
    <ExperimentCanvas camera={[8.5, 8.5, 10.5]} target={[0, 0, 0]} gridY={-0.55} shadowY={-0.5}>
      <PlanetaryMechanism />
    </ExperimentCanvas>
  );
}
