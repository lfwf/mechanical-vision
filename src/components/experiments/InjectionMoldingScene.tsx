import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, MathUtils, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../store/useExperimentStore";
import { ExperimentCanvas, SceneLabel } from "./ExperimentCanvas";
import { TubePath } from "./ScenePrimitives";

const STAGES = ["合模", "注射", "保压", "冷却", "开模", "顶出"] as const;
const STAGE_DURATIONS = [0.14, 0.16, 0.14, 0.28, 0.14, 0.14];

function getStageState(progress: number) {
  let cursor = 0;
  for (let index = 0; index < STAGE_DURATIONS.length; index += 1) {
    const next = cursor + STAGE_DURATIONS[index];
    if (progress <= next || index === STAGE_DURATIONS.length - 1) {
      return {
        stage: index,
        local: MathUtils.clamp((progress - cursor) / STAGE_DURATIONS[index], 0, 1),
      };
    }
    cursor = next;
  }
  return { stage: 0, local: 0 };
}

function manualStageState(variant: number) {
  const stage = MathUtils.clamp(variant - 1, 0, STAGES.length - 1);
  return {
    stage,
    local: stage === 0 || stage === 4 ? 0.72 : stage === 5 ? 0.9 : 0.65,
  };
}

function Screw() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 3.7, 40]} />
        <meshStandardMaterial color="#6f7e82" metalness={0.82} roughness={0.18} />
      </mesh>
      {Array.from({ length: 15 }, (_, index) => (
        <mesh key={index} position={[-1.7 + index * 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.045, 10, 28]} />
          <meshStandardMaterial color="#9aa6a8" metalness={0.78} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function CoolingCircuit() {
  const pathA: Array<[number, number, number]> = [
    [0.55, 0.72, -0.42],
    [0.8, 0.72, -0.42],
    [0.8, -0.72, -0.42],
    [0.55, -0.72, -0.42],
  ];
  const pathB: Array<[number, number, number]> = [
    [1.45, 0.72, 0.42],
    [1.7, 0.72, 0.42],
    [1.7, -0.72, 0.42],
    [1.45, -0.72, 0.42],
  ];
  return (
    <>
      <TubePath points={pathA} color="#5aa7c7" radius={0.035} opacity={0.88} />
      <TubePath points={pathB} color="#5aa7c7" radius={0.035} opacity={0.88} />
    </>
  );
}

function InjectionMoldingMechanism() {
  const movingPlatenRef = useRef<Group>(null);
  const screwRef = useRef<Group>(null);
  const ejectorRef = useRef<Group>(null);
  const partRef = useRef<Group>(null);
  const coolingRef = useRef<Group>(null);
  const stageLabelRefs = useRef<Array<Group | null>>([]);
  const meltRefs = useRef<Array<Mesh | null>>([]);
  const progressRef = useRef(0);

  const speed = useExperimentStore((state) => state.speed);
  const pressure = useExperimentStore((state) => state.primary);
  const coolingShare = useExperimentStore((state) => state.secondary);
  const variant = useExperimentStore((state) => state.variant);
  const isPlaying = useExperimentStore((state) => state.isPlaying);

  const materialPath: Array<[number, number, number]> = [
    [-2.6, 0.12, 0],
    [-1.5, 0.12, 0],
    [-0.65, 0.12, 0],
    [0.1, 0.12, 0],
    [0.35, 0.12, 0],
  ];
  const meltCurve = useMemo(
    () => new CatmullRomCurve3(materialPath.map((point) => new Vector3(...point)), false, "centripetal"),
    [],
  );

  useFrame((_, delta) => {
    if (variant === 0 && isPlaying) {
      const cycleRate = MathUtils.lerp(0.025, 0.08, speed / 100);
      progressRef.current = (progressRef.current + delta * cycleRate) % 1;
    }

    const { stage, local } = variant === 0 ? getStageState(progressRef.current) : manualStageState(variant);
    let moldGap = 0;
    let screwTravel = 0;
    let ejectTravel = 0;
    let partOffset = 0;

    if (stage === 0) moldGap = MathUtils.lerp(0.9, 0, local);
    else if (stage <= 3) moldGap = 0;
    else if (stage === 4) moldGap = MathUtils.lerp(0, 0.9, local);
    else moldGap = 0.9;

    if (stage === 1) screwTravel = MathUtils.lerp(0, 1.15, local);
    else if (stage === 2) screwTravel = 1.15;
    else if (stage >= 3) screwTravel = 0.35;

    if (stage === 5) {
      ejectTravel = MathUtils.smoothstep(local, 0.12, 0.8) * 0.52;
      partOffset = MathUtils.smoothstep(local, 0.35, 1) * 0.65;
    }

    if (movingPlatenRef.current) movingPlatenRef.current.position.x = 1.05 + moldGap;
    if (screwRef.current) {
      screwRef.current.position.x = -2.45 + screwTravel;
      if (isPlaying && (stage === 0 || stage === 3)) screwRef.current.rotation.x += delta * 2.2;
    }
    if (ejectorRef.current) ejectorRef.current.position.x = 1.72 - ejectTravel;
    if (partRef.current) {
      partRef.current.visible = stage >= 2;
      partRef.current.position.x = 0.82 + partOffset;
      partRef.current.position.y = stage === 5 ? -partOffset * 0.35 : 0;
    }
    if (coolingRef.current) coolingRef.current.visible = stage === 3;

    stageLabelRefs.current.forEach((label, index) => {
      if (label) label.visible = index === stage;
    });

    const flowActive = stage === 1 || stage === 2;
    const flowProgress = stage === 1 ? local : 1;
    meltRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = flowActive;
      if (!flowActive) return;
      const t = MathUtils.clamp(flowProgress * 1.35 - index * 0.06, 0, 1);
      mesh.position.copy(meltCurve.getPoint(t));
      (mesh.material as MeshStandardMaterial).emissiveIntensity = 0.18 + pressure / 500;
    });
  });

  return (
    <group>
      <RoundedBox args={[10.8, 0.42, 4.2]} radius={0.14} smoothness={5} position={[0.2, -1.45, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#2f474d" metalness={0.32} roughness={0.44} />
      </RoundedBox>

      <group position={[-3.5, 0, 0]}>
        <RoundedBox args={[3.8, 1.22, 1.38]} radius={0.16} smoothness={6} castShadow>
          <meshStandardMaterial color="#435f66" metalness={0.42} roughness={0.34} />
        </RoundedBox>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 3.9, 56]} />
          <meshStandardMaterial color="#5c7075" metalness={0.58} roughness={0.28} />
        </mesh>
        <group ref={screwRef} position={[-2.45, 0.12, 0]}>
          <Screw />
        </group>
        <mesh position={[-4.1, 1.1, 0]}>
          <coneGeometry args={[0.72, 1.5, 4]} />
          <meshStandardMaterial color="#6d7e81" metalness={0.42} roughness={0.36} />
        </mesh>
        <mesh position={[-1.42, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.22, 0.62, 40]} />
          <meshStandardMaterial color="#929d9f" metalness={0.76} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.35, 0, 0]}>
        <RoundedBox args={[0.52, 2.65, 3.1]} radius={0.08} smoothness={5} castShadow>
          <meshStandardMaterial color="#6a797b" metalness={0.46} roughness={0.34} />
        </RoundedBox>
        <RoundedBox args={[0.52, 2.2, 2.65]} radius={0.06} smoothness={4} position={[0.42, 0, 0]} castShadow>
          <meshStandardMaterial color="#889493" metalness={0.36} roughness={0.4} />
        </RoundedBox>
      </group>

      <group ref={movingPlatenRef} position={[1.05, 0, 0]}>
        <RoundedBox args={[0.52, 2.65, 3.1]} radius={0.08} smoothness={5} castShadow>
          <meshStandardMaterial color="#5c6d70" metalness={0.46} roughness={0.34} />
        </RoundedBox>
        <RoundedBox args={[0.52, 2.2, 2.65]} radius={0.06} smoothness={4} position={[-0.42, 0, 0]} castShadow>
          <meshStandardMaterial color="#7c8988" metalness={0.38} roughness={0.38} />
        </RoundedBox>
        <group ref={ejectorRef} position={[1.72, 0, 0]}>
          {[-0.45, 0, 0.45].map((y) => (
            <mesh key={y} position={[-0.72, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.055, 0.9, 20]} />
              <meshStandardMaterial color="#a2acab" metalness={0.72} roughness={0.22} />
            </mesh>
          ))}
          <RoundedBox args={[0.22, 1.5, 1.7]} radius={0.05} smoothness={4} position={[-0.2, 0, 0]}>
            <meshStandardMaterial color="#53666a" metalness={0.46} roughness={0.34} />
          </RoundedBox>
        </group>
      </group>

      {[-1.15, 1.15].map((z) => (
        <mesh key={z} position={[1.7, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 4.6, 28]} />
          <meshStandardMaterial color="#84918f" metalness={0.72} roughness={0.22} />
        </mesh>
      ))}
      {[-0.95, 0.95].map((y) => (
        <mesh key={y} position={[1.7, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 4.6, 28]} />
          <meshStandardMaterial color="#84918f" metalness={0.72} roughness={0.22} />
        </mesh>
      ))}

      <group ref={partRef} position={[0.82, 0, 0]}>
        <RoundedBox args={[0.18, 1.25, 1.55]} radius={0.18} smoothness={6} castShadow>
          <meshStandardMaterial color="#e58b3b" metalness={0.08} roughness={0.42} />
        </RoundedBox>
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.36, 24]} />
          <meshStandardMaterial color="#d7752a" roughness={0.4} />
        </mesh>
      </group>

      <TubePath points={materialPath} color="#9a5a28" radius={0.045} opacity={0.55} />
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index} ref={(mesh) => { meltRefs.current[index] = mesh; }} visible={false}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <meshStandardMaterial color="#e68a38" emissive="#8d3f11" emissiveIntensity={0.25} />
        </mesh>
      ))}
      <group ref={coolingRef} visible={false}>
        <CoolingCircuit />
      </group>

      <RoundedBox args={[1.5, 1.0, 2.1]} radius={0.12} smoothness={5} position={[3.65, 0, 0]} castShadow>
        <meshStandardMaterial color="#405b61" metalness={0.4} roughness={0.36} />
      </RoundedBox>
      <mesh position={[2.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 1.4, 40]} />
        <meshStandardMaterial color="#617579" metalness={0.56} roughness={0.3} />
      </mesh>

      {STAGES.map((label, index) => (
        <group key={label} ref={(group) => { stageLabelRefs.current[index] = group; }} visible={index === 0}>
          <SceneLabel position={[0.75, 2.35, 0]}>{label}</SceneLabel>
        </group>
      ))}
      <SceneLabel position={[-3.6, 2.0, 0]}>塑化与注射单元</SceneLabel>
      <SceneLabel position={[0.7, 1.75, 0]}>定模 / 动模</SceneLabel>
      <SceneLabel position={[3.6, 1.35, 0]}>锁模与顶出单元</SceneLabel>
      <SceneLabel position={[0.7, -1.95, 0]}>冷却占比 {Math.round(coolingShare)}%</SceneLabel>
    </group>
  );
}

export default function InjectionMoldingScene() {
  return (
    <ExperimentCanvas camera={[10.5, 6.8, 11.8]} target={[0, 0, 0]} gridY={-1.7} shadowY={-1.62} minDistance={8} maxDistance={24}>
      <InjectionMoldingMechanism />
    </ExperimentCanvas>
  );
}
