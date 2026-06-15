import {
  ContactShadows,
  Environment,
  Grid,
  Html,
  OrbitControls,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type PropsWithChildren, type ReactNode, type RefObject } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useExperimentStore } from "../../store/useExperimentStore";

interface ExperimentCanvasProps extends PropsWithChildren {
  camera?: [number, number, number];
  target?: [number, number, number];
  gridY?: number;
  shadowY?: number;
  background?: string;
}

function CameraReset({
  position,
  target,
  resetToken,
  controlsRef,
}: {
  position: [number, number, number];
  target: [number, number, number];
  resetToken: number;
  controlsRef: RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(new Vector3(...target));
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [camera, resetToken, controlsRef]);

  return null;
}

function CanvasContent({
  children,
  camera,
  target,
  gridY,
  shadowY,
  background,
}: Required<ExperimentCanvasProps>) {
  const showGrid = useExperimentStore((state) => state.showGrid);
  const resetToken = useExperimentStore((state) => state.resetCameraToken);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 18, 38]} />
      <ambientLight intensity={1.05} />
      <directionalLight
        castShadow
        position={[7, 11, 8]}
        intensity={2.5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-7, 5, -4]} intensity={0.7} color="#b7d7de" />

      <Suspense fallback={null}>
        {children}
        <Environment preset="warehouse" environmentIntensity={0.42} />
      </Suspense>

      {showGrid && (
        <Grid
          position={[0, gridY, 0]}
          args={[26, 26]}
          cellSize={0.5}
          cellThickness={0.65}
          cellColor="#bdc4bd"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#8fa09c"
          fadeDistance={20}
          fadeStrength={1.4}
          infiniteGrid
        />
      )}

      <ContactShadows
        position={[0, shadowY, 0]}
        opacity={0.32}
        scale={20}
        blur={2.7}
        far={10}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={28}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI * 0.82}
      />
      <CameraReset
        position={camera}
        target={target}
        resetToken={resetToken}
        controlsRef={controlsRef}
      />
    </>
  );
}

export function ExperimentCanvas({
  children,
  camera = [8, 7, 11],
  target = [0, 0, 0],
  gridY = -2.4,
  shadowY = -2.35,
  background = "#eef0e8",
}: ExperimentCanvasProps) {
  return (
    <div className="scene-canvas">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: camera, fov: 42, near: 0.1, far: 120 }}
      >
        <CanvasContent
          camera={camera}
          target={target}
          gridY={gridY}
          shadowY={shadowY}
          background={background}
        >
          {children}
        </CanvasContent>
      </Canvas>
    </div>
  );
}

export function SceneLabel({
  children,
  position,
}: {
  children: ReactNode;
  position: [number, number, number];
}) {
  const showLabels = useExperimentStore((state) => state.showLabels);
  if (!showLabels) return null;

  return (
    <Html center position={position} distanceFactor={9} style={{ pointerEvents: "none" }}>
      <div className="experiment-scene-label">{children}</div>
    </Html>
  );
}
