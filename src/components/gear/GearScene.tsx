import { ContactShadows, Environment, Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  getCenterDistance,
  getDrivenRpm,
  getExternalMeshPhaseOffset,
  rpmToRadiansPerSecond,
} from "../../lib/gearMath";
import { useGearLabStore } from "../../store/useGearLabStore";
import { CameraController } from "./CameraController";
import { ProceduralGear } from "./ProceduralGear";

function GearPair() {
  const driverRef = useRef<Group>(null);
  const drivenRef = useRef<Group>(null);
  const driverAngle = useRef(0);

  const driverTeeth = useGearLabStore((state) => state.driverTeeth);
  const drivenTeeth = useGearLabStore((state) => state.drivenTeeth);
  const inputRpm = useGearLabStore((state) => state.inputRpm);
  const inputDirection = useGearLabStore((state) => state.inputDirection);
  const isPlaying = useGearLabStore((state) => state.isPlaying);
  const selectedPartId = useGearLabStore((state) => state.selectedPartId);
  const showPitchCircles = useGearLabStore((state) => state.showPitchCircles);
  const showLabels = useGearLabStore((state) => state.showLabels);
  const selectPart = useGearLabStore((state) => state.selectPart);

  const centerDistance = getCenterDistance(driverTeeth, drivenTeeth);
  const drivenRpm = getDrivenRpm(
    inputRpm,
    inputDirection,
    driverTeeth,
    drivenTeeth,
  );

  useFrame((_, delta) => {
    if (isPlaying) {
      driverAngle.current +=
        rpmToRadiansPerSecond(inputRpm * inputDirection) * delta;
    }

    if (driverRef.current) {
      driverRef.current.rotation.y = driverAngle.current;
    }

    if (drivenRef.current) {
      const phaseOffset = getExternalMeshPhaseOffset(drivenTeeth);
      drivenRef.current.rotation.y =
        -driverAngle.current * (driverTeeth / drivenTeeth) + phaseOffset;
    }
  });

  return (
    <group
      onClick={(event) => {
        if (event.intersections.length === 0) selectPart("mesh");
      }}
    >
      <ProceduralGear
        ref={driverRef}
        teeth={driverTeeth}
        label="主动齿轮"
        rpmLabel={`${Math.round(inputRpm)} RPM`}
        partId="driver"
        position={[-centerDistance / 2, 0, 0]}
        selected={selectedPartId === "driver"}
        showPitchCircle={showPitchCircles}
        showLabel={showLabels}
        onSelect={selectPart}
        materialVariant="driver"
      />

      <ProceduralGear
        ref={drivenRef}
        teeth={drivenTeeth}
        label="从动齿轮"
        rpmLabel={`${Math.abs(drivenRpm).toFixed(1)} RPM`}
        partId="driven"
        position={[centerDistance / 2, 0, 0]}
        selected={selectedPartId === "driven"}
        showPitchCircle={showPitchCircles}
        showLabel={showLabels}
        onSelect={selectPart}
        materialVariant="driven"
      />

      <mesh
        position={[0, 0.12, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          selectPart("mesh");
        }}
      >
        <circleGeometry args={[0.17, 48]} />
        <meshBasicMaterial
          color={selectedPartId === "mesh" ? "#f4d27b" : "#87b2bf"}
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SceneContent() {
  const showGrid = useGearLabStore((state) => state.showGrid);
  const driverTeeth = useGearLabStore((state) => state.driverTeeth);
  const drivenTeeth = useGearLabStore((state) => state.drivenTeeth);
  const resetCameraToken = useGearLabStore((state) => state.resetCameraToken);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <color attach="background" args={["#eef0e8"]} />
      <fog attach="fog" args={["#eef0e8", 16, 34]} />

      <ambientLight intensity={1.08} />
      <directionalLight
        castShadow
        position={[6, 10, 6]}
        intensity={2.6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 4, -5]} intensity={0.75} color="#b7d7de" />

      <Suspense fallback={null}>
        <GearPair />
        <Environment preset="warehouse" environmentIntensity={0.46} />
      </Suspense>

      {showGrid && (
        <Grid
          position={[0, -0.42, 0]}
          args={[24, 24]}
          cellSize={0.5}
          cellThickness={0.7}
          cellColor="#bdc4bd"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#8fa09c"
          fadeDistance={18}
          fadeStrength={1.4}
          infiniteGrid
        />
      )}

      <ContactShadows
        position={[0, -0.4, 0]}
        opacity={0.34}
        scale={18}
        blur={2.6}
        far={8}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={0.45}
        minPolarAngle={0.35}
        maxPolarAngle={1.38}
        minDistance={5}
        maxDistance={26}
      />

      <CameraController
        driverTeeth={driverTeeth}
        drivenTeeth={drivenTeeth}
        resetToken={resetCameraToken}
        controlsRef={controlsRef}
      />
    </>
  );
}

export function GearScene() {
  const selectPart = useGearLabStore((state) => state.selectPart);
  const showPitchCircles = useGearLabStore((state) => state.showPitchCircles);

  return (
    <div className="scene-canvas" aria-label="外啮合齿轮三维交互区域">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 8, 12], fov: 40, near: 0.1, far: 100 }}
        onPointerMissed={() => selectPart("mesh")}
      >
        <SceneContent />
      </Canvas>

      {showPitchCircles && (
        <div className="reference-legend" aria-label="基准几何图例">
          <span><i className="legend-root" />齿根圆</span>
          <span><i className="legend-base" />基圆</span>
          <span><i className="legend-pitch" />节圆</span>
          <span><i className="legend-outer" />齿顶圆</span>
        </div>
      )}
    </div>
  );
}
