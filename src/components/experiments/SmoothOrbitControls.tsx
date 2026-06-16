import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { MathUtils, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface SmoothOrbitControlsProps {
  controlsRef: RefObject<OrbitControlsImpl | null>;
  resetToken: number;
  cameraKey?: string | number;
  minDistance?: number;
  maxDistance?: number;
  wheelSensitivity?: number;
  damping?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

const scratchOffset = new Vector3();
const scratchPosition = new Vector3();

export function SmoothOrbitControls({
  controlsRef,
  resetToken,
  cameraKey = "default",
  minDistance = 5.5,
  maxDistance = 22,
  wheelSensitivity = 0.0008,
  damping = 13,
  minPolarAngle = 0.2,
  maxPolarAngle = Math.PI * 0.82,
}: SmoothOrbitControlsProps) {
  const { camera, gl } = useThree();
  const desiredDistance = useRef(
    MathUtils.clamp(camera.position.length(), minDistance, maxDistance),
  );

  useEffect(() => {
    const element = gl.domElement;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;
      const normalizedDelta = MathUtils.clamp(event.deltaY * unit, -240, 240);
      const factor = Math.exp(normalizedDelta * wheelSensitivity);
      desiredDistance.current = MathUtils.clamp(
        desiredDistance.current * factor,
        minDistance,
        maxDistance,
      );
    };

    element.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
    return () => element.removeEventListener("wheel", onWheel, true);
  }, [gl, maxDistance, minDistance, wheelSensitivity]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const controls = controlsRef.current;
      if (!controls) return;
      desiredDistance.current = MathUtils.clamp(
        camera.position.distanceTo(controls.target),
        minDistance,
        maxDistance,
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, [camera, controlsRef, maxDistance, minDistance, resetToken, cameraKey]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    scratchOffset.copy(camera.position).sub(controls.target);
    const currentDistance = scratchOffset.length();
    if (currentDistance < 0.0001) return;

    const nextDistance = MathUtils.damp(
      currentDistance,
      desiredDistance.current,
      damping,
      Math.min(delta, 0.05),
    );
    if (Math.abs(nextDistance - currentDistance) < 0.0002) return;

    scratchOffset.setLength(nextDistance);
    scratchPosition.copy(controls.target).add(scratchOffset);
    camera.position.copy(scratchPosition);
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enableZoom={false}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      minDistance={minDistance}
      maxDistance={maxDistance}
    />
  );
}
