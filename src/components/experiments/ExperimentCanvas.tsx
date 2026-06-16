import { ContactShadows, Environment, Grid, Html } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type PropsWithChildren, type ReactNode, type RefObject } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useExperimentStore } from "../../store/useExperimentStore";
import { SmoothOrbitControls } from "./SmoothOrbitControls";

interface ExperimentCanvasProps extends PropsWithChildren {
  camera?: [number, number, number];
  target?: [number, number, number];
  cameraKey?: string | number;
  gridY?: number;
  shadowY?: number;
  background?: string;
  minDistance?: number;
  maxDistance?: number;
}

function CameraReset({ position, target, resetToken, cameraKey, controlsRef }: {
  position: [number, number, number];
  target: [number, number, number];
  resetToken: number;
  cameraKey: string | number;
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
  }, [
    camera,
    controlsRef,
    resetToken,
    cameraKey,
    position[0],
    position[1],
    position[2],
    target[0],
    target[1],
    target[2],
  ]);
  return null;
}

function CanvasContent({ children, camera, target, cameraKey, gridY, shadowY, background, minDistance, maxDistance }: Required<ExperimentCanvasProps>) {
  const showGrid = useExperimentStore((state) => state.showGrid);
  const resetToken = useExperimentStore((state) => state.resetCameraToken);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 18, 38]} />
      <ambientLight intensity={0.95} />
      <directionalLight castShadow position={[7, 11, 8]} intensity={2.35} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-7, 5, -4]} intensity={0.78} color="#b7d7de" />
      <directionalLight position={[0, 3, -10]} intensity={0.42} color="#dbe8eb" />
      <Suspense fallback={null}>{children}<Environment preset="warehouse" environmentIntensity={0.48} /></Suspense>
      {showGrid && <Grid position={[0, gridY, 0]} args={[26, 26]} cellSize={0.5} cellThickness={0.65} cellColor="#bdc4bd" sectionSize={2} sectionThickness={1} sectionColor="#8fa09c" fadeDistance={20} fadeStrength={1.4} infiniteGrid />}
      <ContactShadows position={[0, shadowY, 0]} opacity={0.24} scale={20} blur={3.2} far={10} />
      <SmoothOrbitControls controlsRef={controlsRef} resetToken={resetToken} cameraKey={cameraKey} minDistance={minDistance} maxDistance={maxDistance} />
      <CameraReset position={camera} target={target} resetToken={resetToken} cameraKey={cameraKey} controlsRef={controlsRef} />
    </>
  );
}

export function ExperimentCanvas({ children, camera = [8, 7, 11], target = [0, 0, 0], cameraKey = "default", gridY = -2.4, shadowY = -2.35, background = "#eef0e8", minDistance = 5.5, maxDistance = 22 }: ExperimentCanvasProps) {
  return (
    <div className="scene-canvas">
      <Canvas shadows dpr={[1, 1.8]} gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ position: camera, fov: 42, near: 0.1, far: 120 }}>
        <CanvasContent camera={camera} target={target} cameraKey={cameraKey} gridY={gridY} shadowY={shadowY} background={background} minDistance={minDistance} maxDistance={maxDistance}>{children ?? null}</CanvasContent>
      </Canvas>
    </div>
  );
}

export function SceneLabel({ children, position }: { children: ReactNode; position: [number, number, number] }) {
  const showLabels = useExperimentStore((state) => state.showLabels);
  if (!showLabels) return null;
  return <Html center position={position} distanceFactor={9} style={{ pointerEvents: "none" }}><div className="experiment-scene-label">{children}</div></Html>;
}
