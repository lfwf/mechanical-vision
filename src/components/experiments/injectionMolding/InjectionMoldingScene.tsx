import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, MathUtils, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { useExperimentStore } from "../../../store/useExperimentStore";
import { ExperimentCanvas } from "../ExperimentCanvas";
import { ConveyorAssembly } from "./ConveyorAssembly";
import { InjectionMoldingMachine } from "./InjectionMoldingMachine";
import { LetterProduct } from "./LetterProduct";
import { PickAndPlaceRobot } from "./PickAndPlaceRobot";
import { SenjerAssemblyStation, letterSlotPositions } from "./SenjerAssemblyStation";
import {
  SENJER_SEQUENCE,
  getLetterCycleDuration,
  getPhaseDuration,
  resolveProductionFrame,
  type ProductionPhase,
} from "./injectionMoldingCycle";

const phaseLabels: Record<ProductionPhase, string> = {
  close: "合模",
  inject: "注射充模",
  hold: "保压补缩",
  cool: "冷却定型",
  open: "开模",
  eject: "顶出",
  pick: "机械手取件",
  convey: "输送",
  place: "定位组字",
  "batch-complete": "SENJER 完成",
};

const moldPosition = new Vector3(-1.5, 0.05, 0);
const pickPosition = new Vector3(-0.4, 0.72, 0);
const conveyorStart = new Vector3(0.75, -0.18, 0);
const conveyorEnd = new Vector3(5.75, -0.18, 0);
const warmColor = new Color("#f29a4a");
const coolColor = new Color("#8fc7e8");

function updateLetterMaterial(group: Group, warm: boolean, glow: boolean) {
  group.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const material = mesh.material as MeshStandardMaterial;
    if (!material?.color) return;
    material.color.copy(warm ? warmColor : coolColor);
    if (material.emissive) {
      material.emissive.copy(glow ? (warm ? warmColor : coolColor) : new Color("#000000"));
      material.emissiveIntensity = glow ? 0.22 : 0;
    }
  });
}

function ProductionLine() {
  const movingPlatenRef = useRef<Group>(null);
  const screwRef = useRef<Group>(null);
  const ejectorRef = useRef<Group>(null);
  const coolingRef = useRef<Group>(null);
  const meltRefs = useRef<Array<Mesh | null>>([]);
  const carriageRef = useRef<Group>(null);
  const gripperRef = useRef<Group>(null);
  const letterRefs = useRef<Array<Group | null>>([]);
  const slotRefs = useRef<Array<Group | null>>([]);
  const phaseLabelRefs = useRef<Array<Group | null>>([]);
  const batchLabelRef = useRef<Group>(null);
  const letterIndexRef = useRef(0);
  const elapsedRef = useRef(0);
  const batchRef = useRef(1);
  const completedCountRef = useRef(0);

  const speed = useExperimentStore((state) => state.speed);
  const pressure = useExperimentStore((state) => state.primary);
  const coolingShare = useExperimentStore((state) => state.secondary);
  const isPlaying = useExperimentStore((state) => state.isPlaying);

  const meltCurve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-6.2, 0.18, 0),
          new Vector3(-5.15, 0.18, 0),
          new Vector3(-4.15, 0.18, 0),
          new Vector3(-3.45, 0.18, 0),
          new Vector3(-2.95, 0.18, 0),
        ],
        false,
        "centripetal",
      ),
    [],
  );

  useFrame((_, delta) => {
    const speedFactor = MathUtils.lerp(0.48, 1.45, speed / 100);
    if (isPlaying) elapsedRef.current += delta * speedFactor;

    const lastIndex = SENJER_SEQUENCE.length - 1;
    const currentIndex = letterIndexRef.current;
    const totalDuration =
      getLetterCycleDuration() + (currentIndex === lastIndex ? getPhaseDuration("batch-complete") : 0);

    if (elapsedRef.current > totalDuration) {
      elapsedRef.current = 0;
      if (currentIndex === lastIndex) {
        letterIndexRef.current = 0;
        completedCountRef.current = 0;
        batchRef.current += 1;
      } else {
        letterIndexRef.current += 1;
        completedCountRef.current = letterIndexRef.current;
      }
    }

    const frame = resolveProductionFrame(letterIndexRef.current, elapsedRef.current);
    const { phase, phaseProgress, letterIndex } = frame;
    const moldGap =
      phase === "close"
        ? MathUtils.lerp(0.86, 0, phaseProgress)
        : phase === "open"
          ? MathUtils.lerp(0, 0.86, phaseProgress)
          : ["eject", "pick", "convey", "place", "batch-complete"].includes(phase)
            ? 0.86
            : 0;
    const screwTravel =
      phase === "inject" ? MathUtils.lerp(0, 1.1, phaseProgress) : phase === "hold" ? 1.1 : phase === "cool" ? 0.32 : 0;
    const ejectTravel = phase === "eject" ? MathUtils.smoothstep(phaseProgress, 0.08, 0.86) * 0.48 : 0;

    if (movingPlatenRef.current) movingPlatenRef.current.position.x = 0.15 + moldGap;
    if (screwRef.current) {
      screwRef.current.position.x = -2.2 + screwTravel;
      if (isPlaying && (phase === "close" || phase === "cool")) screwRef.current.rotation.x += delta * 2.1;
    }
    if (ejectorRef.current) ejectorRef.current.position.x = 1.45 - ejectTravel;
    if (coolingRef.current) coolingRef.current.visible = phase === "cool";

    const flowActive = phase === "inject" || phase === "hold";
    meltRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = flowActive;
      if (!flowActive) return;
      const t = MathUtils.clamp((phase === "hold" ? 1 : phaseProgress * 1.35) - index * 0.055, 0, 1);
      mesh.position.copy(meltCurve.getPoint(t));
      const material = mesh.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.16 + pressure / 420;
    });

    if (carriageRef.current) {
      const robotX =
        phase === "pick"
          ? MathUtils.lerp(-0.5, 0.7, phaseProgress)
          : phase === "convey" || phase === "place"
            ? 0.7
            : -0.5;
      carriageRef.current.position.x = robotX;
    }
    if (gripperRef.current) {
      gripperRef.current.position.y = phase === "pick" ? -1.48 + Math.sin(phaseProgress * Math.PI) * 0.28 : -1.48;
    }

    letterRefs.current.forEach((letterGroup, index) => {
      if (!letterGroup) return;
      const finalPosition = new Vector3(...letterSlotPositions[index]);

      if (index < letterIndex) {
        letterGroup.visible = true;
        letterGroup.position.copy(finalPosition);
        letterGroup.scale.setScalar(1);
        updateLetterMaterial(letterGroup, false, frame.batchComplete);
        return;
      }
      if (index > letterIndex) {
        letterGroup.visible = false;
        return;
      }

      const visible = !["close"].includes(phase) && !(phase === "inject" && phaseProgress < 0.06);
      letterGroup.visible = visible;
      if (!visible) return;

      if (phase === "inject") {
        letterGroup.position.copy(moldPosition);
        letterGroup.scale.setScalar(MathUtils.lerp(0.08, 1, phaseProgress));
      } else if (["hold", "cool", "open", "eject"].includes(phase)) {
        letterGroup.position.copy(moldPosition).add(new Vector3(ejectTravel, 0, 0));
        letterGroup.scale.setScalar(1);
      } else if (phase === "pick") {
        const firstHalf = MathUtils.smoothstep(phaseProgress, 0, 0.55);
        const secondHalf = MathUtils.smoothstep(phaseProgress, 0.45, 1);
        letterGroup.position.copy(moldPosition).lerp(pickPosition, firstHalf).lerp(conveyorStart, secondHalf);
      } else if (phase === "convey") {
        letterGroup.position.copy(conveyorStart).lerp(conveyorEnd, MathUtils.smoothstep(phaseProgress, 0, 1));
      } else if (phase === "place") {
        letterGroup.position.copy(conveyorEnd).lerp(finalPosition, MathUtils.smoothstep(phaseProgress, 0, 1));
      } else {
        letterGroup.position.copy(finalPosition);
      }

      updateLetterMaterial(letterGroup, ["inject", "hold"].includes(phase), phase === "batch-complete");
    });

    completedCountRef.current = frame.completedCount;
    phaseLabelRefs.current.forEach((group, index) => {
      if (group) group.visible = index === Object.keys(phaseLabels).indexOf(phase);
    });
    if (batchLabelRef.current) batchLabelRef.current.position.y = 2.95 + Math.sin(elapsedRef.current * 2.4) * 0.025;
  });

  return (
    <group>
      <InjectionMoldingMachine
        movingPlatenRef={movingPlatenRef}
        screwRef={screwRef}
        ejectorRef={ejectorRef}
        coolingRef={coolingRef}
        meltRefs={meltRefs}
      />
      <PickAndPlaceRobot carriageRef={carriageRef} gripperRef={gripperRef} />
      <ConveyorAssembly active={isPlaying} speed={speed} />
      <SenjerAssemblyStation completedCount={completedCountRef.current} slotRefs={slotRefs} />

      {SENJER_SEQUENCE.map((letter, index) => (
        <group
          key={`${letter}-${index}`}
          ref={(group) => {
            letterRefs.current[index] = group;
          }}
          visible={false}
        >
          <LetterProduct letter={letter} />
        </group>
      ))}

      <RoundedBox args={[5.2, 0.12, 0.82]} radius={0.06} smoothness={4} position={[1.9, 3.02, 0]}>
        <meshStandardMaterial color="#f3f8fb" transparent opacity={0.92} roughness={0.28} />
      </RoundedBox>
      {Object.values(phaseLabels).map((label, index) => (
        <group
          key={label}
          ref={(group) => {
            phaseLabelRefs.current[index] = group;
          }}
          visible={index === 0}
        >
          <Text position={[1.9, 3.04, 0.08]} fontSize={0.31} color="#24536d" anchorX="center" anchorY="middle">
            当前阶段：{label}
          </Text>
        </group>
      ))}
      <group ref={batchLabelRef}>
        <Text position={[-4.0, 2.95, 0]} fontSize={0.28} color="#2f6684" anchorX="center" anchorY="middle">
          单机循环生产 · S → E → N → J → E → R
        </Text>
      </group>
      <Text position={[-4.0, 2.52, 0]} fontSize={0.18} color="#57798b" anchorX="center" anchorY="middle">
        橙色：熔体 / 蓝色：冷却制品 / 冷却占比 {Math.round(coolingShare)}%
      </Text>
    </group>
  );
}

export default function InjectionMoldingScene() {
  return (
    <ExperimentCanvas
      camera={[15.5, 8.4, 16.5]}
      target={[2.5, 0.25, 0]}
      gridY={-1.72}
      shadowY={-1.64}
      minDistance={11}
      maxDistance={32}
    >
      <ProductionLine />
    </ExperimentCanvas>
  );
}
